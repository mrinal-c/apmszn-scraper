import { Browser } from "puppeteer-core";
import { CompanySearchConfig, Config, SearchSource } from "./config.type";

export type RoleType = "apm" | "internship";

export interface Audit {
    audit(input: AuditInput): Promise<AuditOutput>;

    fillForm?(input: any): any;
    nextPage?(input: any): any;
}

export type AuditInput = {
    // Define the structure of the input (e.g., URL, parameters, etc.)
    browser: Browser;
    searches: CompanySearchConfig[];
};

export type ScrapedJob = {
    textContent: any,
    link: string
}

export type APIJob = {
    data: any
}

export type FirecrawlJob = {
    title?: string,
    application_link?: string,
    location?: string,
    description?: string,
    other?: string
}

export type ProcessedJob = {
    title?: string,
    application_link?: string,
    location?: string,
    description?: string,
    other?: string
}

export type RawJob = ScrapedJob | APIJob | FirecrawlJob;

export type RawData = {
    rawJobs: RawJob[],
    success: boolean,
    error?: string,
    message?: string,
    count?: number,
    searchConfig?: CompanySearchConfig
}

export type ProcessedData = {
    jobs: ProcessedJob[],
    success: boolean,
    error?: string,
    message?: string,
    count?: number,
    searchConfig?: CompanySearchConfig
}

export type AuditOutput = {
    searchResults: RawData[],
    finalResults?: (ProcessedData | RawData)[]
};
