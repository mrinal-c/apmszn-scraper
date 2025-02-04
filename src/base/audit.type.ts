import { Browser } from "puppeteer-core";
import { SearchConfig, SearchSource } from "./config.type";

export type RoleType = "apm" | "internship";

export type SearchInput = {
    browser: Browser;
    searchConfig: SearchConfig;
};

export type ScrapedJob = {
    textContent: any,
    link: string
}

export type ProcessedJob = {
    title?: string,
    application_link?: string,
    location?: string,
    description?: string,
    other?: string
}

export type RawJob = ScrapedJob
export type Job = RawJob | ProcessedJob

export type SearchResult = {
    jobs: Job[],
    success: boolean,
    error?: string,
    message?: string,
    count?: number,
    source: SearchSource
    searchConfig?: SearchConfig
}

export type CSVSearchResult = {
    title?: string,
    application_link?: string,
    location?: string,
    description?: string,
    other?: string,
    searchConfig: string,
    company: string,
    timestamp: string
}

