"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiCrawl = aiCrawl;
const firecrawl_js_1 = __importDefault(require("@mendable/firecrawl-js"));
const zod_1 = require("zod");
const app = new firecrawl_js_1.default({
    apiKey: process.env.FIRECRAWL_API_KEY,
});
async function aiCrawl(url, searchQuery) {
    const schema = zod_1.z.object({
        positions: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string(),
            application_link: zod_1.z.string(),
            location: zod_1.z.string().optional(),
            other: zod_1.z.string().optional(),
            description: zod_1.z.string().optional()
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
