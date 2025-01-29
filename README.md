# APM Season AI Job Search

## Introduction

This is an MVP of an AI-Powered Job Search. This is work in progress so the repository and code will be updated as it is used more and I get feedback.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Features](#features)
  - [Data Sources](#data-sources)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Notes](#notes)

## Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/mrinal-c/apmszn-scraper.git
   ```
2. Open the repository in terminal and install the required packages.

   ```bash
   npm install
   ```

   or

   ```bash
    yarn
   ```

3. Create a `.env` file in the root directory and add the environment variables I sent you. An `.env.example` file is provided for reference.

## Features

What does this script do? In short, it uses a combination of THREE data sources to scrape jobs across specific sites. As a user, you will have to just provide a configuration
file that tells the script which companies to look for and such.

### Data Sources

1. **API**: Using the company's official careers page API to fetch job listings directly and reliably.

2. **Scraping**: I wrote custom scripts to analyze the company's HTML structure to programmatically navigate forms and pagination to retrieve job listings.

3. **Firecrawl**: [Firecrawl](https://www.firecrawl.dev/) uses AI for `scraping` data, minimizing coding effort. Note that it is new and may occasionally hallucinate or fail.

### Search Support

Here’s a table showing whether API, scraping, or Firecrawl is supported for each company, with ✅ for supported and ❌ for not supported:

| **Company** | **API** | **Scraping** | **Firecrawl** |
| ----------- | ------- | ------------ | ------------- |
| Spotify     | ❌      | ✅           | ✅            |
| LinkedIn    | ❌      | ✅           | ❌            |
| KPCB        | ❌      | ✅           | ✅            |
| Atlassian   | ❌      | ✅           | ❌            |
| Instacart   | ❌      | ✅           | ❌            |
| Walmart     | ❌      | ✅           | ❌            |
| Figma       | ❌      | ✅           | ❌            |
| Yahoo       | ❌      | ✅           | ❌            |
| Tinder      | ❌      | ✅           | ✅            |
| Cloudflare  | ❌      | ✅           | ✅            |
| HubSpot     | ❌      | ❌           | ✅            |
| UiPath      | ❌      | ❌           | ✅            |
| Tesla       | ❌      | ❌           | ✅            |
| eBay        | ❌      | ❌           | ✅            |

I am always gonna be updating this so keep on pulling the repo to check if this updates.

### Configuration

The `config.js` file is used to configure the script. Check the example config file provided in `config.example.json` It looks like this:

```javascript
{
    [CompanyName]: {
        searches: CompanySearchConfig[] (list of search configurations)
    }
}
```

#### Config Properties

| **Key**       | **Values**                                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CompanyName` | `spotify`, `linkedin`, `kpcb`, `atlassian`, `instacart`, `walmart`, `figma`, `yahoo`, `tinder`, `cloudflare`, `hubspot`, `uipath`, `tesla`, or `ebay` |

`CompanySearchConfig` can be either `SearchConfig` or `FirecrawlSearchConfig` based on the source.

#### `SearchConfig`

The `SearchConfig` object is used to configure a search using either the API or scraping.

```javascript
{
    keyword: string,
    source: "api" | "scraping",
    roleType: "apm" | "internship",
    aiFilter?: boolean
}
```

| **Property** | **Type**  | **Required** | **Description**                               |
| ------------ | --------- | ------------ | --------------------------------------------- |
| `keyword`    | `string`  | Yes          | The keyword to search.                        |
| `source`     | `string`  | Yes          | Either `api` or `scraping`.                   |
| `roleType`   | `string`  | Yes          | Either `apm` or `internship`.                 |
| `aiFilter`   | `boolean` | No           | Indicates whether to apply ChatGPT filtering. |

---

##### `FirecrawlSearchConfig`

The `FirecrawlSearchConfig` object is used to configure a search using Firecrawl.

```javascript
{
      searchQuery: string,
      url: string,
      roleType: "apm" | "internship",
      source: "firecrawl"
}
```

| **Property**  | **Type** | **Required** | **Description**                |
| ------------- | -------- | ------------ | ------------------------------ |
| `searchQuery` | `string` | Yes          | The query for the search.      |
| `url`         | `string` | Yes          | The target URL for the search. |
| `roleType`    | `string` | Yes           | Either `apm` or `internship`   |
| `source`      | `string` | Yes          | Always `firecrawl`.            |

---

## Usage

1. Create a configuration file in the root directory. You can use the `config.ts` file as a template. You should read [Configuration](#configuration) to understand how to configure the file.
2. Open a new terminal window. Quit your Chrome app if it is running. Then run the Chrome script using the following command:
   ```bash
   ./scripts/chrome.sh
   ```
2. Open a new terminal window (Separate from the Chrome process). Run the audit script using the following command:
   ```bash
   npm start
   ```
3. Check the terminal output for updates. All job listings will be saved in the results.json directory.

NOTE: Let's say you have 3 companies initially in config and you run the script. The script will save the results in a file called `results.json`. If you add more companies to the config file and run the script again, the script will append the new results to the existing `results.json` file, NOT overwrite the results. This allows you to rerun the script multiple times without losing any data.

## Notes
IMPORTANT: Using the API Keys and Firecrawl credits, we can only run the script a limited number of times. Please use it judiciously. If you run out of credits, please let me know and we can load more.
