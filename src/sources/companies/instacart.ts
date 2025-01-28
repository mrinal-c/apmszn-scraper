import { Browser, Page } from "puppeteer-core";
import { Audit, AuditInput, AuditOutput, ProcessedData, RawData } from "../../base/audit.type";
import { CompanySearchConfig } from "../../base/config.type";
import { search } from "../scraping/instacart";
import { filterJobs } from "../../lib/openai/gpt";

export class InstacartAudit implements Audit {
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
            const { keyword } = searchConfig;
            console.log("Scraping Instacart on keyword: ", keyword);
            const data = await search(browser, keyword);
            return { ...data, searchConfig };
        } else if (source === "firecrawl") {
            return { rawJobs: [], message: "Firecrawl not implemented", success: false, searchConfig, count: 0 };
        } else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }

    }
}
