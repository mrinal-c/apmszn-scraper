import { ScrapingSearchConfig } from "@/src/base/config.type";
import { SearchInput, SearchResult } from "../../base/audit.type";
import { scrape as atlassianScrape } from "./atlassian";
import { scrape as cloudflareScrape } from "./cloudflare";
import { scrape as figmaScrape } from "./figma";
import { scrape as instacartScrape } from "./instacart";
import { scrape as kpcbScrape } from "./kpcb";
import { scrape as linkedinScrape } from "./linkedin";
import { scrape as spotifyScrape } from "./spotify";
import { scrape as tinderScrape } from "./tinder";
import { scrape as walmartScrape } from "./walmart";
import { scrape as yahooScrape } from "./yahoo";


export async function scrape(input: SearchInput): Promise<SearchResult> {
    const { searchConfig, browser } = input;
    const { company, roleType, keyword } = searchConfig as ScrapingSearchConfig;
    console.log(`Starting SCRAPE on ${company} for ${roleType} roles with keyword: ${keyword}`)
    if (company == "atlassian") {
        return await atlassianScrape(browser, roleType)
    } else if (company == "cloudflare") {
        return await cloudflareScrape(browser)
    } else if (company == "figma") {
        return await figmaScrape(browser)
    } else if (company == "instacart") {
        return await instacartScrape(browser, keyword)
    } else if (company == "kpcb") {
        return await kpcbScrape(browser)
    } else if (company == "linkedin") {
        return await linkedinScrape(browser, keyword)
    } else if (company == "spotify") {
        return await spotifyScrape(browser, roleType)
    } else if (company == "tinder") {
        return await tinderScrape(browser, keyword, roleType)
    } else if (company == "walmart") {
        return await walmartScrape(browser, keyword)
    } else if (company == "yahoo") {
        return await yahooScrape(browser, keyword)
    }
}