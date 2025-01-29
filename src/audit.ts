import * as fs from 'node:fs/promises';
import { Browser } from "puppeteer-core";
import { Audit, AuditOutput, RawData } from "./base/audit.type";
import { CompanyName, Config } from './base/config.type';
import { KPCBAudit } from './sources/companies/kpcb';
import { LinkedinAudit } from './sources/companies/linkedin';
import { SpotifyAudit } from './sources/companies/spotify';
import { AtlassianAudit } from './sources/companies/atlassian';
import { InstacartAudit } from './sources/companies/instacart';
import { WalmartAudit } from './sources/companies/walmart';
import { FigmaAudit } from './sources/companies/figma';
import { YahooAudit } from './sources/companies/yahoo';
import { TinderAudit } from './sources/companies/tinder';
import { CloudflareAudit } from './sources/companies/cloudflare';
import { HubspotAudit } from './sources/companies/hubspot';
import { UIPathAudit } from './sources/companies/uipath';
import { TeslaAudit } from './sources/companies/tesla';
import { EbayAudit } from './sources/companies/ebay';
import { auditConfig } from '../config';

const scrapers: Record<CompanyName, () => Audit> = {
    kpcb: () => new KPCBAudit(),
    linkedin: () => new LinkedinAudit(),
    spotify: () => new SpotifyAudit(),
    atlassian: () => new AtlassianAudit(),
    instacart: () => new InstacartAudit(),
    walmart: () => new WalmartAudit(),
    figma: () => new FigmaAudit(),
    yahoo: () => new YahooAudit(),
    tinder: () => new TinderAudit(),
    cloudflare: () => new CloudflareAudit(),
    hubspot: () => new HubspotAudit(),
    uipath: () => new UIPathAudit(),
    tesla: () => new TeslaAudit(),
    ebay: () => new EbayAudit()
};

async function runAudit(browser: Browser): Promise<void> {
    const results: Record<string, AuditOutput> = {};

    const companyList = Object.keys(auditConfig);
    const jobQueue = createJobQueue(companyList, 1);

    for (const jobSet of jobQueue) {
        await Promise.all(
            jobSet.map(async (company: string) => {
                const auditOutput = await auditHelper(company, browser, auditConfig);
                results[company] = auditOutput;
            })
        )
    }

    await saveAuditOutput(results);
}

/**
 * 
 * @param company company name
 * @param browser browser reference
 * @param results where we are storing audit results
 * @param config config object for company specific stuff
 */
async function auditHelper(company: string, browser: Browser, config: Config): Promise<AuditOutput> {
    const createScraper = scrapers[company];
    const scraper = createScraper();
    const { searches } = config[company];
    const auditOutput = await scraper.audit({ browser, searches });
    return auditOutput;
}



/**
 * @param [maxConcurrency=3] maximum number of concurrent jobs, defaults to 3
 * @returns jobQueue - a 2D array, where each element is an array of concurrent jobs that will be run together
 */
function createJobQueue(companyList: string[], maxConcurrency: number = 3): string[][] {
    const jobQueue: string[][] = [];
    let tempQueue: string[] = [];
    for (const company of companyList) {
        tempQueue.push(company);
        if (tempQueue.length === maxConcurrency) {
            jobQueue.push(tempQueue);
            tempQueue = [];
        }
    }
    if (tempQueue.length > 0) {
        jobQueue.push(tempQueue);
    }
    return jobQueue;
}

async function saveAuditOutput(newResults: Record<string, AuditOutput>) {
    try {
        const fileContent = await fs.readFile('results.json', 'utf-8');
        const currentResults: Record<string, AuditOutput> = fileContent.trim() ? JSON.parse(fileContent) : {};

        const updatedResults = currentResults;

        for (const [key, result] of Object.entries(newResults)) {
            updatedResults[key] = result;
        }

        await fs.writeFile('results.json', JSON.stringify(updatedResults, null, 2));
        console.log("Audit results written to results.json");
    } catch (error) {
        console.error(`Failed to update audit results:`, error);
    }
}

export default runAudit;
