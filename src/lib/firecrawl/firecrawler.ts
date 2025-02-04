import { z } from "zod";
import FirecrawlApp from "@mendable/firecrawl-js";
import { app } from "./client";
import { FirecrawlSearchConfig, SearchSource } from "../../base/config.type";
import { SearchResult } from "../../base/audit.type";

export async function firecrawl(searchConfig: FirecrawlSearchConfig): Promise<SearchResult> {
    const { url, searchQuery, company, customQuery } = searchConfig;
    console.log(`Starting a firecrawl search on ${company}`)

    const prompt = customQuery ? customQuery :
        `Extract all job positions related to ${searchQuery}. Include title and application link as required fields. Optionally include location, salary, visa, and description if available. Search across the first 3 pages of the site if possible.`


    const schema = z.object({
        positions: z.array(z.object({
            title: z.string(),
            application_link: z.string(),
            location: z.string().optional(),
            other: z.string().optional(),
            description: z.string().optional()
        }))
    });
    const response = await app.extract([
        `${url}`
    ], {
        prompt: prompt,
        schema,
    });

    const jobs = 'data' in response ? response.data.positions : [];

    const data = {
        jobs,
        success: true,
        count: jobs.length,
        source: "firecrawl" as SearchSource
    }

    return data;
}
