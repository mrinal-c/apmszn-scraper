
import { Browser, Page } from "puppeteer-core";
import { Audit, AuditInput, AuditOutput, ProcessedData, RawData } from "../../base/audit.type";
import { scrape } from "../scraping/yahoo";
import { CompanySearchConfig } from "../../base/config.type";
import { filterJobs } from "../../lib/openai/gpt";

export class YahooAudit implements Audit {
    async audit(input: AuditInput): Promise<AuditOutput> {
        const { browser, searches } = input;


        const searchResults: RawData[] = [];
        const finalResults: (ProcessedData | RawData)[] = [];
        for (const searchConfig of searches) {
            const { source } = searchConfig;
            const data = await this.helper(browser, searchConfig);
            searchResults.push(data);

            if (source !== "firecrawl" && searchConfig.aiFilter) {
                console.log("AI filtering for Figma");
                const processed = await filterJobs(data);
                finalResults.push(processed);
            } else {
                finalResults.push(data);
            }

        }
        return { searchResults, finalResults }


    }

    async helper(browser: Browser, searchConfig: CompanySearchConfig): Promise<RawData> {
        const { source } = searchConfig;


        if (source === "scraping") {
            const { keyword, roleType } = searchConfig;
            console.log("Scraping Yahoo on keyword and roletype: ", keyword, roleType);
            const data = await scrape(browser, keyword);
            return { ...data, searchConfig };
        } else if (source === "firecrawl") {
            return { rawJobs: [], message: "Firecrawl not implemented for Yahoo", success: false, searchConfig, count: 0 };
        } else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented for Yahoo", success: false, searchConfig, count: 0 };
        }

    }
}
