
import { Browser, Page } from "puppeteer-core";
import { SearchResult } from "../../base/audit.type"; // Update the import path as needed
import { delay } from "../../lib/utils";

export async function scrape(browser: Browser, keyword: string): Promise<SearchResult> {
    const page = await browser.newPage();

    try {
        //go to url, prefill data
        await page.goto(
            `https://www.yahooinc.com/careers/search.html?searchText=${encodeURIComponent(keyword)}&location=%22United%20States%22`
        );



        // Wait for the title to contain specific text
        const titleSelector = "h1.resultsTitle";
        const waitForKeyword = "jobs";
        await page.waitForFunction(
            (selector, text) => {
                const element = document.querySelector(selector);
                return element && element.textContent.includes(text);
            },
            {},
            titleSelector,
            waitForKeyword
        );

        //i couldn't get them to show a "no jobs found" message

        // Navigate through more positions (pagination)
        const morePositionsSelector = 'div.loadMoreBtn button.loadMore';
        for (let i = 0; i < 2; i++) {
            await page.evaluate(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            });
            await page.waitForSelector(morePositionsSelector).then((element) => element.click());
            await delay(1500);
        }

        // Wait for job cards to load
        const jobCardSelector = "tbody#tableJobListing tr.jobTitle";
        await page.waitForSelector(jobCardSelector);
        const jobCards = await page.$$(jobCardSelector);

        // Extract job data
        const jobs = await Promise.all(
            jobCards.map(async (jobCard) => {
                const textContent = await jobCard.$$eval(
                    "div, a, td",
                    (elements) =>
                        elements
                            .map((element) => element.textContent?.trim() || "")
                            .filter((text) => text.length > 0)
                );

                const link = await jobCard.$eval("a", (element) => element.href);
                return { textContent, link };
            })
        );

        return { jobs, success: true, count: jobs.length, source: "scraping" };

    } catch (error) {
        const err = error as Error;
        console.error("Error during Yahoo audit:", error);
        return { jobs: [], success: false, error: err.message, count: 0, source: "scraping" };
    } finally {
        await page.close();
    }
}

async function fillForm(page: Page, keyword: string) {
    // form input
    const inputSelector = "input#search-keyword";
    await page.locator(inputSelector).fill(keyword);
    const locationButtonSelector = "button[aria-controls=collapseLocation]";
    await page.locator(locationButtonSelector).click();
    const usaSelector = "input#unitedstates";
    await page.locator(usaSelector).click();
    await page.evaluate(() => {
        const form = document.querySelector("form#search-page-form");
        const event = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
    })
}
