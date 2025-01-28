"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcSearch = fcSearch;
const client_1 = require("../../lib/firecrawl/client");
async function fcSearch(url, searchQuery) {
    const response = await (0, client_1.aiCrawl)(url, searchQuery);
    const rawData = {
        rawJobs: 'data' in response ? response.data.positions : [],
        success: true,
        count: 'data' in response ? response.data.positions.length : 0
    };
    return rawData;
}
