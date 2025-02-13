import { Browser, ElementHandle, Page } from "puppeteer-core";
import { SearchResult } from "../../base/audit.type"; // Update the import path as needed
import { delay } from "../../lib/utils";

export async function scrape(browser: Browser, keyword: string): Promise<SearchResult> {
    const page = await browser.newPage();

    try {

        //go to page, prefill with query params
        await page.goto(
            `https://careers.walmart.com/results?q=${encodeURIComponent(keyword)}&page=1&sort=rank&jobCategory=00000161-8bda-d3dd-a1fd-bbda62130000&expand=department,00000159-7585-d286-a3f9-7fa533590000,00000159-7589-d286-a3f9-7fa968750000,00000159-758d-d286-a3f9-7fad37a00000,0000015e-b97d-d143-af5e-bd7da8ca0000,00000159-7574-d286-a3f9-7ff45f640000,brand,type,rate&type=jobs`
        );

        // await this.fillForm({page, keyword});

        // Check for existence of the no-results banner
        const noResultsElement = await page.$("div.search__no-results");
        const noResults = noResultsElement ? await page.evaluate(element => {
            return window.getComputedStyle(element).display !== 'none';
        }, noResultsElement) : false;
        if (noResults) {
            return { jobs: [], success: true, message: "No jobs found from this source", source: "scraping" };
        }

        await delay(1000);


        // handle pagination
        const nextPageSelector = "ul.search__results__pagination button[data-page=next]";
        const jobCardSelector = "div.search__results ul#search-results li.search-result";
        const jobCards: ElementHandle<HTMLElement>[] = [];

        for (let i = 0; i < 5; i++) {
            const temp = await page.$$(jobCardSelector);
            jobCards.push(...temp);
            const nextPageButton = await page.$(nextPageSelector);
            if (!nextPageButton) break;
            await page.evaluate((button) => {
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, nextPageButton);
            await nextPageButton.click();
            await delay(1000);
        }

        // Extract text content and link from each job card
        const jobs = await Promise.all(
            jobCards.map(async (jobCard) => {
                const textContent = await jobCard.$$eval(
                    'a, span',
                    (elements) =>
                        elements
                            .map((element) => element.textContent?.trim() || "")
                            .filter((text) => text.length > 0)
                );
                const link = await jobCard.$eval("h4.job-listing__title a", (element) => element.href);
                return { textContent, link }
            })
        );

        return { jobs, success: true, count: jobs.length, source: "scraping" };

    } catch (error) {
        const err = error as Error;
        console.error("Error during Walmart audit:", error);
        return { jobs: [], success: false, error: err.message, source: 'scraping' };
    } finally {
        await page.close();
    }
}
