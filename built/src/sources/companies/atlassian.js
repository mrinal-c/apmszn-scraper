"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlassianAudit = void 0;
const atlassian_1 = require("../scraping/atlassian");
const gpt_1 = require("../../lib/openai/gpt");
class AtlassianAudit {
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
