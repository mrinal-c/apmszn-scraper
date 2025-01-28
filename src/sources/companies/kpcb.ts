import { Browser, Page } from "puppeteer-core";
import { Audit, AuditInput, AuditOutput, ProcessedData, RawData } from "../../base/audit.type";
import { search } from "../scraping/kpcb";
import { fcSearch } from "../firecrawl/kpcb";
import { CompanySearchConfig } from "../../base/config.type";
import { filterJobs } from "../../lib/openai/gpt";

export class KPCBAudit implements Audit {
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
            const { roleType } = searchConfig;
            console.log("Scraping KPCB on roletype: ", roleType);
            const data = await search(browser);
            return { ...data, searchConfig };
        } else if (source === "firecrawl") {
            const { searchQuery, url } = searchConfig;
            console.log("Firecrawl KPCB on search query: ", searchQuery);
            const data = await fcSearch(url, searchQuery);
            return { ...data, searchConfig };
        } else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }

    }
}
