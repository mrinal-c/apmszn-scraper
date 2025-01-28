import { RawData } from "../../base/audit.type"; // Update the import path as needed
import { aiCrawl } from "../../lib/firecrawl/client";

export async function fcSearch(url: string, searchQuery: string): Promise<RawData> {
    const response = await aiCrawl(url, searchQuery);
    const rawData = {
        rawJobs: 'data' in response ? response.data.positions : [],
        success: true,
        count: 'data' in response ? response.data.positions.length : 0
    }

    return rawData;
}
