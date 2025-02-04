import { SearchInput, SearchResult } from "../base/audit.type";
import { ScrapingSearchConfig } from "../base/config.type";
import { firecrawl } from "../lib/firecrawl/firecrawler";
import { filterJobs } from "../lib/openai/gpt";
import { scrape } from "./scraping";

export async function search(input: SearchInput): Promise<SearchResult> {
    const { searchConfig } = input;
    const { source } = searchConfig
    if (source == "scraping+ai") {
        const scrapingResult = await scrape(input);
        const processedResult = await filterJobs({...scrapingResult, searchConfig});
        return { ...processedResult, searchConfig }
    } else {
        const firecrawlResult = await firecrawl(searchConfig);
        return { ...firecrawlResult, searchConfig }
    }
}