import { RoleType } from "./audit.type";
export type SearchSource = "scraping" | "firecrawl" | "scraping+ai";
export type ScrapeCompanyName = "spotify" | "linkedin" | "kpcb" | "atlassian" | "instacart" | "walmart" | "figma" | "yahoo" | "tinder" | "cloudflare" | "hubspot" | "uipath" | "tesla" | "ebay";

export type ScrapingSearchConfig = {
    keyword: string;
    source: "scraping+ai";
    roleType: RoleType;
    company: ScrapeCompanyName;
    jobConditions?: string[]
}

export type FirecrawlSearchConfig = {
    searchQuery: string;
    customQuery?: string;
    url: string;
    roleType: RoleType;
    source: "firecrawl";
    company: string;
}
export type SearchConfig = ScrapingSearchConfig | FirecrawlSearchConfig;