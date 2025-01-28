import { RoleType } from "./audit.type";
export type SearchSource = "api" | "scraping" | "firecrawl";
export type CompanyName = "spotify" | "linkedin" | "kpcb" | "atlassian" | "instacart" | "walmart" | "figma" | "yahoo" | "tinder" | "cloudflare" | "hubspot" | "uipath" | "tesla" | "ebay";

export type SearchConfig = {
    keyword: string;
    source: "api" | "scraping";
    roleType: RoleType;
    llmMessage?: string;
    aiFilter?: boolean;
}

export type FirecrawlSearchConfig = {
    searchQuery: string;
    url: string;
    roleType: RoleType;
    source: "firecrawl";
}
export type CompanySearchConfig = SearchConfig | FirecrawlSearchConfig;

export type Config = {
    [K in CompanyName]?: {
        searches: CompanySearchConfig[]
    }
}