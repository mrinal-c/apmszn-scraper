import puppeteer from "puppeteer-core";
import { supabase } from "./lib/supabase/client";
import runAudit from "./audit";
import axios from "axios";
import { delay } from "./lib/utils";

async function setupBrowser() {
    const response = await axios.get("http://localhost:9222/json/version");
    const { webSocketDebuggerUrl } = response.data;
    const browser = await puppeteer.connect({
        browserWSEndpoint: webSocketDebuggerUrl,
        defaultViewport: {width: 1440, height: 900},
    });

    return browser;
}

async function fetchPositions() {
    const { data, error } = await supabase.from("positions").select("*");
    if (error) {
        console.error(error);
        return [];
    }
    return data;
}


export async function main() {
    await delay(5000);
    const browser = await setupBrowser();
    // const positions = await fetchPositions();
    // const positions = [];

    await runAudit(browser);

    browser.disconnect()
}

main()
