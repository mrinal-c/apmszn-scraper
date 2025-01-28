"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TinderAudit = void 0;
const tinder_1 = require("../scraping/tinder");
const tinder_2 = require("../firecrawl/tinder");
class TinderAudit {
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
            console.log("Scraping Tinder on keyword and roletype: ", keyword, roleType);
            const data = await (0, tinder_1.scrape)(browser, keyword, roleType);
            return { ...data, searchConfig };
        }
        else if (source === "firecrawl") {
            const { url, searchQuery, roleType } = searchConfig;
            console.log("Firecrawl for Tinder on search query and roletype: ", searchQuery, roleType);
            const data = await (0, tinder_2.firecrawl)(url, searchQuery);
            return { ...data, searchConfig };
        }
        else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }
    }
}
exports.TinderAudit = TinderAudit;
