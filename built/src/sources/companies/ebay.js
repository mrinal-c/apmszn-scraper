"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EbayAudit = void 0;
const ebay_1 = require("../firecrawl/ebay");
const gpt_1 = require("../../lib/openai/gpt");
class EbayAudit {
    async audit(input) {
        const { browser, searches } = input;
        const searchResults = [];
        const finalResults = [];
        for (const searchConfig of searches) {
            const { source } = searchConfig;
            const data = await this.helper(browser, searchConfig);
            searchResults.push(data);
            if (source !== "firecrawl" && searchConfig.aiFilter) {
                console.log("AI filtering for Figma");
                const processed = await (0, gpt_1.filterJobs)(data);
                finalResults.push(processed);
            }
            else {
                finalResults.push(data);
            }
        }
        return { searchResults, finalResults };
    }
    async helper(browser, searchConfig) {
        const { source } = searchConfig;
        if (source === "scraping") {
            return { rawJobs: [], message: "Scraping not implemented", success: false, searchConfig, count: 0 };
        }
        else if (source === "firecrawl") {
            const { url, searchQuery, roleType } = searchConfig;
            console.log("Firecrawl for EBay on search query and roletype: ", searchQuery, roleType);
            const data = await (0, ebay_1.firecrawl)(url, searchQuery);
            return { ...data, searchConfig };
        }
        else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }
    }
}
exports.EbayAudit = EbayAudit;
