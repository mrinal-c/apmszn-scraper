import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

const app = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function aiCrawl(url: string, searchQuery: string) {
    const schema = z.object({
        positions: z.array(z.object({
            title: z.string(),
            application_link: z.string(),
            location: z.string().optional(),
            other: z.string().optional(),
            description: z.string().optional()
        }))
    });
    const extractResult = await app.extract([
        `${url}`
    ], {
        prompt: `Extract all job positions related to ${searchQuery}. 
        Include title and application link as required fields. Optionally include location, salary, visa, and description if available. Search across the first 3 pages of the site if possible.`,
        schema,
    });

    return extractResult;
}

