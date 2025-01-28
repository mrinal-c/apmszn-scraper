"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YahooAudit = void 0;
const yahoo_1 = require("../scraping/yahoo");
class YahooAudit {
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
            console.log("Scraping Yahoo on keyword and roletype: ", keyword, roleType);
            const data = await (0, yahoo_1.scrape)(browser, keyword);
            return { ...data, searchConfig };
        }
        else if (source === "firecrawl") {
            return { rawJobs: [], message: "Firecrawl not implemented for Yahoo", success: false, searchConfig, count: 0 };
        }
        else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented for Yahoo", success: false, searchConfig, count: 0 };
        }
    }
}
exports.YahooAudit = YahooAudit;
