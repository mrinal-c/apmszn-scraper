"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs/promises"));
const kpcb_1 = require("./sources/companies/kpcb");
const linkedin_1 = require("./sources/companies/linkedin");
const spotify_1 = require("./sources/companies/spotify");
const config_1 = require("../config");
const atlassian_1 = require("./sources/companies/atlassian");
const instacart_1 = require("./sources/companies/instacart");
const walmart_1 = require("./sources/companies/walmart");
const figma_1 = require("./sources/companies/figma");
const yahoo_1 = require("./sources/companies/yahoo");
const tinder_1 = require("./sources/companies/tinder");
const cloudflare_1 = require("./sources/companies/cloudflare");
const hubspot_1 = require("./sources/companies/hubspot");
const uipath_1 = require("./sources/companies/uipath");
const tesla_1 = require("./sources/companies/tesla");
const ebay_1 = require("./sources/companies/ebay");
const scrapers = {
    kpcb: () => new kpcb_1.KPCBAudit(),
    linkedin: () => new linkedin_1.LinkedinAudit(),
    spotify: () => new spotify_1.SpotifyAudit(),
    atlassian: () => new atlassian_1.AtlassianAudit(),
    instacart: () => new instacart_1.InstacartAudit(),
    walmart: () => new walmart_1.WalmartAudit(),
    figma: () => new figma_1.FigmaAudit(),
    yahoo: () => new yahoo_1.YahooAudit(),
    tinder: () => new tinder_1.TinderAudit(),
    cloudflare: () => new cloudflare_1.CloudflareAudit(),
    hubspot: () => new hubspot_1.HubspotAudit(),
    uipath: () => new uipath_1.UIPathAudit(),
    tesla: () => new tesla_1.TeslaAudit(),
    ebay: () => new ebay_1.EbayAudit()
};
async function runAudit(browser) {
    const results = {};
    const companyList = Object.keys(config_1.config);
    const jobQueue = createJobQueue(companyList, 1);
    for (const jobSet of jobQueue) {
        await Promise.all(jobSet.map(async (company) => {
            const auditOutput = await auditHelper(company, browser, config_1.config);
            results[company] = auditOutput;
        }));
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
async function auditHelper(company, browser, config) {
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
function createJobQueue(companyList, maxConcurrency = 3) {
    const jobQueue = [];
    let tempQueue = [];
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
async function saveAuditOutput(newResults) {
    try {
        const fileContent = await fs.readFile('results.json', 'utf-8');
        const currentResults = fileContent.trim() ? JSON.parse(fileContent) : {};
        const updatedResults = currentResults;
        for (const [key, result] of Object.entries(newResults)) {
            updatedResults[key] = result;
        }
        await fs.writeFile('results.json', JSON.stringify(updatedResults, null, 2));
        console.log("Audit results written to results.json");
    }
    catch (error) {
        console.error(`Failed to update audit results:`, error);
    }
}
exports.default = runAudit;
