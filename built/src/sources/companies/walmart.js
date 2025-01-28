"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalmartAudit = void 0;
const walmart_1 = require("../scraping/walmart");
class WalmartAudit {
    async audit(input) {
        const { browser, searches } = input;
        const searchResults = [];
        for (const searchConfig of searches) {
            const data = await this.helper(browser, searchConfig);
            searchResults.push(data);
        }
        return { searchResults };
    }
    async helper(browser, searchConfig) {
        const { source } = searchConfig;
        if (source === "scraping") {
            const { keyword, roleType } = searchConfig;
            console.log("Scraping Walmart on keyword and roletype: ", keyword, roleType);
            const data = await (0, walmart_1.search)(browser, keyword);
            return { ...data, searchConfig };
        }
        else if (source === "firecrawl") {
            return { rawJobs: [], message: "Firecrawl not implemented", success: false, searchConfig, count: 0 };
        }
        else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }
    }
}
exports.WalmartAudit = WalmartAudit;
