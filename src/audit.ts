import { Browser } from "puppeteer-core";
import { auditConfig } from '../config';
import { SearchConfig } from './base/config.type';
import { SearchResult } from './base/audit.type';
import { search } from './search';
import { saveResults } from './save-audit';


async function runAudit(browser: Browser): Promise<void> {
    const results: SearchResult[] = []
    const jobQueue = createJobQueue(auditConfig, 3);
    const timestamp = new Date().toISOString();

    for (const jobSet of jobQueue) {
        await Promise.all(
            jobSet.map(async (searchConfig: SearchConfig) => {
                const searchResults = await search({ searchConfig, browser, timestamp })
                results.push(...searchResults);
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


export default runAudit;
