"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPCBAudit = void 0;
const kpcb_1 = require("../scraping/kpcb");
const kpcb_2 = require("../firecrawl/kpcb");
class KPCBAudit {
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
            const { roleType } = searchConfig;
            console.log("Scraping KPCB on roletype: ", roleType);
            const data = await (0, kpcb_1.search)(browser);
            return { ...data, searchConfig };
        }
        else if (source === "firecrawl") {
            const { searchQuery, url } = searchConfig;
            console.log("Firecrawl KPCB on search query: ", searchQuery);
            const data = await (0, kpcb_2.fcSearch)(url, searchQuery);
            return { ...data, searchConfig };
        }
        else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }
    }
}
exports.KPCBAudit = KPCBAudit;
