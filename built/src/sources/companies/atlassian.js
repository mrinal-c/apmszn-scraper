"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlassianAudit = void 0;
const atlassian_1 = require("../scraping/atlassian");
class AtlassianAudit {
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
            console.log("Scraping Atlassian on job type: ", roleType);
            const data = await (0, atlassian_1.search)(browser, roleType);
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
exports.AtlassianAudit = AtlassianAudit;
