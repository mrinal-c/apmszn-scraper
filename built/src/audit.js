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
const fs = __importStar(require("fs"));
const csv = __importStar(require("fast-csv"));
const config_1 = require("../config");
const promises_1 = require("fs/promises");
const search_1 = require("./search");
async function runAudit(browser) {
    const results = [];
    const jobQueue = createJobQueue(config_1.auditConfig, 3);
    for (const jobSet of jobQueue) {
        await Promise.all(jobSet.map(async (searchConfig) => {
            const searchResult = await (0, search_1.search)({ searchConfig, browser });
            results.push(searchResult);
        }));
    }
    await saveResults(results);
}
/**
 * @param [maxConcurrency=3] maximum number of concurrent jobs, defaults to 3
 * @returns jobQueue - a 2D array, where each element is an array of concurrent jobs that will be run together
 */
function createJobQueue(searchList, maxConcurrency = 3) {
    const jobQueue = [];
    let tempQueue = [];
    for (const searchConfig of searchList) {
        tempQueue.push(searchConfig);
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
async function saveResults(newResults) {
    //get current data
    if (!fs.existsSync('results/results.json')) {
        fs.writeFileSync('results/results.json', '[]', 'utf-8');
    }
    const fileContent = await (0, promises_1.readFile)('results/results.json', 'utf-8');
    const currentResults = fileContent.trim() ? JSON.parse(fileContent) : [];
    //merge results
    const results = newResults;
    const companies = new Set();
    newResults.forEach((result) => companies.add(result.searchConfig.company));
    currentResults.forEach((result) => {
        const { company } = result.searchConfig;
        if (companies.has(company))
            return;
        results.push(result);
    });
    const timestamp = new Date().toISOString();
    //format for csv
    const csvResults = [];
    for (const result of results) {
        const { searchConfig, jobs } = result;
        const { source: searchSource, company, roleType } = searchConfig;
        const entries = jobs.map((job) => {
            const j = job;
            return { ...j, searchSource, company, roleType, timestamp, searchConfig: JSON.stringify(searchConfig) };
        });
        csvResults.push(...entries);
    }
    //save to json
    await (0, promises_1.writeFile)('results/results.json', JSON.stringify(results, null, 2));
    console.log("Audit results written to results.json");
    //format and save
    const csvStream = csv.format({ headers: true });
    const writableStream = fs.createWriteStream('results/results.csv');
    csvStream.pipe(writableStream);
    for (const row of csvResults) {
        csvStream.write(row);
    }
    csvStream.end();
    console.log("Audit results written to results.csv");
}
exports.default = runAudit;
