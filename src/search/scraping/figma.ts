
import { Browser, Page } from "puppeteer-core";
import { SearchResult } from "../../base/audit.type"; // Update the import path as needed
import { delay } from "../../lib/utils";

export async function scrape(browser: Browser): Promise<SearchResult> {
    const page = await browser.newPage();

    try {

        //go to page, no in query params possible
        await page.goto(
            `https://www.figma.com/careers/#job-openings`
        );

        // they dont have no results, or search!!!
        // pagination - they dont have any!!!

        const jobSectionSelector = "section#job-openings"
        await (await page.$(jobSectionSelector)).scrollIntoView();

        //find all job cards and store in variable
        const jobCardSelector = "ul[aria-labelledby=product] > li";
        const jobCards = await page.$$(jobCardSelector);

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
                const link = await jobCard.$eval("a", (element) => element.href);
                return { textContent, link }
            })
        );

        return { jobs, success: true, count: jobs.length, source: "scraping" };
    } catch (error) {
        const err = error as Error;
        console.error("Error during Figma audit:", error);
        return { jobs: [], success: false, error: err.message, count: 0, source: "scraping" };
    } finally {
        await page.close();
    }
}
