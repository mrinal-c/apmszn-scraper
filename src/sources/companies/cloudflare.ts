import { Browser, Page } from "puppeteer-core";
import { Audit, AuditInput, AuditOutput, ProcessedData, RawData } from "../../base/audit.type";
import { CompanySearchConfig } from "../../base/config.type";
import { scrape } from "../scraping/cloudflare";
import { firecrawl } from "../firecrawl/cloudflare";
import { filterJobs } from "../../lib/openai/gpt";

export class CloudflareAudit implements Audit {
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
            console.log("Scraping Cloudflare on roletype: ", roleType);
            const data = await scrape(browser);
            return { ...data, searchConfig };
        } else if (source === "firecrawl") {
            const { url, searchQuery, roleType } = searchConfig;
            console.log("Firecrawl Cloudflare on search query and roletype: ", searchQuery, roleType);
            const data = await firecrawl(url, searchQuery);
            return { ...data, searchConfig };
        } else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }

    }
}
