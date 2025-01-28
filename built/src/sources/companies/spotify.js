"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyAudit = void 0;
const spotify_1 = require("../scraping/spotify");
const spotify_2 = require("../firecrawl/spotify");
class SpotifyAudit {
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
            console.log("Scraping Spotify on job type: ", roleType);
            const data = await (0, spotify_1.search)(browser, roleType);
            return { ...data, searchConfig };
        }
        else if (source === "firecrawl") {
            const { url, searchQuery, roleType } = searchConfig;
            console.log("Firecrawl for Spotify on search query and roletype: ", searchQuery, roleType);
            const data = await (0, spotify_2.firecrawl)(url, searchQuery);
            return { ...data, searchConfig };
        }
        else if (source === "api") {
            return { rawJobs: [], message: "API search not implemented", success: false, searchConfig, count: 0 };
        }
    }
}
exports.SpotifyAudit = SpotifyAudit;
