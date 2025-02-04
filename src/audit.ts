import * as fs from 'fs';
import * as csv from 'fast-csv';
import { Browser } from "puppeteer-core";
import { auditConfig } from '../config.example';
import { readFile, writeFile } from 'fs/promises';
import { SearchConfig } from './base/config.type';
import { CSVSearchResult, Job, ProcessedJob, SearchResult } from './base/audit.type';
import { search } from './search';


async function runAudit(browser: Browser): Promise<void> {
    const results: SearchResult[] = []
    const jobQueue = createJobQueue(auditConfig, 3);

    for (const jobSet of jobQueue) {
        await Promise.all(
            jobSet.map(async (searchConfig: SearchConfig) => {
                const searchResult = await search({ searchConfig, browser })
                results.push(searchResult);
            })
        )
    }

    await saveResults(results);
}



/**
 * @param [maxConcurrency=3] maximum number of concurrent jobs, defaults to 3
 * @returns jobQueue - a 2D array, where each element is an array of concurrent jobs that will be run together
 */
function createJobQueue(searchList: SearchConfig[], maxConcurrency: number = 3): SearchConfig[][] {
    const jobQueue: SearchConfig[][] = [];
    let tempQueue: SearchConfig[] = [];
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


async function saveResults(newResults: SearchResult[]) {
    //get current data
    if (!fs.existsSync('results/results.json')) {
        fs.writeFileSync('results/results.json', '[]', 'utf-8');
    }
    const fileContent = await readFile('results/results.json', 'utf-8');
    const currentResults: SearchResult[] = fileContent.trim() ? JSON.parse(fileContent) : [];

    //merge results
    const results: SearchResult[] = newResults;
    const companies: Set<string> = new Set()
    newResults.forEach((result: SearchResult) => companies.add(result.searchConfig.company));
    currentResults.forEach((result: SearchResult) => {
        const { company } = result.searchConfig;
        if (companies.has(company)) return;
        results.push(result);
    })

    const timestamp = new Date().toISOString();

    //format for csv
    const csvResults: CSVSearchResult[] = []
    for (const result of results) {
        const { searchConfig, jobs } = result
        const { source: searchSource, company, roleType } = searchConfig
        const entries = jobs.map((job: Job) => {
            const j = job as ProcessedJob;
            return { ...j, searchSource, company, roleType, timestamp, searchConfig: JSON.stringify(searchConfig) }
        })
        csvResults.push(...entries)
    }

    //save to json
    await writeFile('results/results.json', JSON.stringify(results, null, 2));
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


export default runAudit;
