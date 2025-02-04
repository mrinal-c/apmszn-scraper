import { Browser, ElementHandle, Page } from "puppeteer-core";
import {  SearchResult } from "../../base/audit.type"; // Update the import path as needed
import { delay } from "../../lib/utils";

export async function scrape(browser: Browser, keyword: string): Promise<SearchResult> {
    const page = await browser.newPage();

    try {

        //go to page
        await page.goto(
            `https://www.linkedin.com/jobs/search/?f_C=1337%2C39939%2C2587638%2C9202023&geoId=103644278&keywords=${encodeURIComponent(keyword)}`
        );


        // await this.fillForm({page, keyword});

        // Check for existence of the no-results banner
        const noResults = await page.$('div.jobs-search-no-results-banner');
        if (noResults) {
            return { jobs: [], success: true, message: "No jobs found from this source", source: "scraping", count: 0 };
        }


        //scroll pagination into view
        const paginationSelector = 'div.jobs-search-pagination';
        const nextButtonSelector = `${paginationSelector} button[aria-label='View next page']`;
        const jobCardSelector = 'div.scaffold-layout__list > div > ul div.job-card-container';
        const jobCards: ElementHandle<HTMLElement>[] = [];

        for (let i = 0; i < 3; i++) {
            const paginationElement = await page.$(paginationSelector);
            if (paginationElement) {
                await page.evaluate((element) => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
                }, paginationElement);
            }
            await delay(4000); //wait for jobs 2 load
            await page.waitForSelector(jobCardSelector);
            const temp = await page.$$(jobCardSelector);
            jobCards.push(...temp);

            const nextButton = await page.$(nextButtonSelector);
            if (!nextButton) break;
            await nextButton.click();
        }
        await delay(2500);


        // Extract text content and link from each job card
        const jobs = await Promise.all(
            jobCards.map(async (jobCard) => {
                const textContent = await jobCard.$$eval(
                    'a, span, li',
                    (elements) =>
                        elements
                            .map((element) => element.textContent?.trim() || "")
                            .filter((text) => text.length > 0)
                );
                const link = await jobCard.$eval('a.job-card-container__link', (element) => element.href);
                return { textContent, link }
            })
        );

        return { jobs, success: true, count: jobs.length, source: "scraping" };
    } catch (error) {
        const err = error as Error;
        console.error("Error during LinkedIn audit:", error);
        return { jobs: [], success: false, error: err.message, source: "scraping" };
    } finally {
        await page.close();
    }
}
