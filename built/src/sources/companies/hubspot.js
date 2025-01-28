"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspotAudit = void 0;
const hubspot_1 = require("../firecrawl/hubspot");
class HubspotAudit {
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
            return { rawJobs: [], message: "Scraping not implemented", success: false, searchConfig, count: 0 };
        }
        else if (source === "firecrawl") {
            const { url, searchQuery, roleType } = searchConfig;
            console.log("Firecrawl for Hubspot on search query and roletype: ", searchQuery, roleType);
            const data = await (0, hubspot_1.firecrawl)(url, searchQuery);
            return { ...data, searchConfig };
        }
        else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }
    }
}
exports.HubspotAudit = HubspotAudit;
