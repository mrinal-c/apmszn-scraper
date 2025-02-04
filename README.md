# APM Season AI Job Search

Last Updated: February 3, 2025

## Introduction

This is an MVP of an AI-Powered Job Search. This is work in progress so the repository and code will be updated as it is used more and I get feedback.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [Data Sources](#data-sources)
- [Notes](#notes)
  - [How To Use](#how-to-use)
  - [Tip And Tricks](#tips-and-tricks)

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

## Usage

1. Read [Tips and Tricks](#tips-and-tricks) and [Configuration](#configuration) before using.
2. Create a configuration file in the root directory. You can use the `config.example.ts` file as a template.
3. Open a new terminal window. Quit your Chrome app if it is running. Then run the Chrome script using the following command:
   ```bash
   ./scripts/chrome.sh
   ```
4. Open a new terminal window (Separate from the Chrome process). Run the audit script using the following command:
   ```bash
   npm start
   ```
5. Check the terminal output for updates. All job listings will be saved in the results.json and results.csv files.

## Features

What does this script do? In short, it uses a combination of TWO data sources to scrape jobs across specific sites. As a user, you will have to just provide a configuration file that tells the script which companies to look for or where.

### Data Sources

1. **Scraping+AI**: I wrote custom scripts by analyzing each website by hand to navigate forms and pagination to retrieve job listings. Then, this raw data is passed to an OpenAI model to structure and filter out irrelevant results. I have only implemented a select list of companies/websites but this will grow.

2. **Firecrawl**: [Firecrawl](https://www.firecrawl.dev/) uses AI for scraping data, minimizing coding effort. Basically it does number 1 with the help of AI so it is way faster to implement as a dev. Note that it is new and may occasionally hallucinate or fail. I have found varying levels of success with it.

### Configuration

The `config.ts` file is used to configure the script. Check the example config file provided in `config.example.ts` It looks like this:

```javascript
//The config object is a list of search configurations --> SearchConfig[]
[
   {
      company: "linkedin",
      roleType: "apm",
      keyword: "product",
      source: "scraping+ai"
   }...
   //more search configs appear below
]

```

#### Config Properties

`SearchConfig` can be either `ScrapingSearchConfig` or `FirecrawlSearchConfig` based on the source.

#### `ScrapingSearchConfig`

```javascript
{
    keyword: string,
    source: "scraping+ai",
    roleType: "apm" | "internship",
    company: `CompanyName`
}
```

| **Property** | **Type**      | **Required** | **Description**                                                                                                     |
| ------------ | ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `keyword`    | `string`      | Yes          | The keyword to search.                                                                                              |
| `source`     | `string`      | Yes          | Always `scraping+ai`.                                                                                               |
| `roleType`   | `string`      | Yes          | Either `apm` or `internship`.                                                                                       |
| `company`    | `CompanyName` | Yes          | One of `spotify`, `linkedin`, `kpcb`, `atlassian`, `instacart`, `walmart`, `figma`, `yahoo`, `tinder`, `cloudflare` |

---

##### `FirecrawlSearchConfig`

```javascript
{
      searchQuery: string,
      customQuery?: string
      url: string,
      roleType: "apm" | "internship",
      source: "firecrawl"
}
```

| **Property**  | **Type** | **Required** | **Description**                            |
| ------------- | -------- | ------------ | ------------------------------------------ |
| `searchQuery` | `string` | Yes          | The query for the search. See below        |
| `customQuery` | `string` | Yes          | The custom query for the search. See below |
| `url`         | `string` | Yes          | The target URL for the search.             |
| `roleType`    | `string` | Yes          | Either `apm` or `internship`               |
| `source`      | `string` | Yes          | Always `firecrawl`.                        |

---

When running on Firecrawl, we interface it like you would any other AI agent, with a prompt. Below is how the prompt is structured:

```javascript
`Extract all job positions related to ${searchQuery}. Include title and application link as required fields. Optionally include location, salary, visa, and description if available. Search across the first 3 pages of the site if possible.`;
```

Want to use a custom query of your own? Feel free to specify in the config. If you give a custom query, the search query field is ignored and you define evenrything in the custom query.

## Notes

### How To Use

The TLDR is:

- Auditing a company/website that appears on the list above? Use `scraping+ai`
- Auditing literally anything else? Use `firecrawl`

The idea is that I have only hand-constructed a few websites for scraping, and this list will grow. You might wonder why we need to write this code when `firecrawl` seems like it will do it all. The reason is because `firecrawl` is still a little inconsistent, and there are still page complexities in the career websites we visit. I haven't found much success with like Linkedin and Hiring Cafe. So while `scraping+ai` takes a little longer to develop, it is the better option when it is available. If you find yourself firecrawling a certain website with minimal success, that is the time to reach out to me so I can get it implemented in scraping.

### Tips and Tricks

- **Read the Docs**: I try to be as detailed as possible, but I hope most answers are here! Reach out to me with anything else
- **Check for Updates**: Frequently pull to get the updated code -> there will be an automatic update notifier in slack whenever I update the code
- **Start Small**: Start with one or two searches to get yourself familiar with the configuration and flow of the script. The example has a bunch, so don't feel like you have to run all at once.
- **Incremental Audits**: Once again, you don't have to run 20 site audits at once. The results append to one another, not overwrite, so you can run 5-10 in succession and all results will be accumulated in the results files.
- **Test Out Websites**: Don't feed Firecrawl with URLs without visiting them yourself. Ensure data can easily be extracted from the website and is relevant. I don't think Firecrawl can fill out forms and navigate pages yet. Sites that work well
   - Are simple (Lever and Greenhouse job pages are beautiful - use them to test)
   - Don't have popups or many ads
   - Prefill form entries by having data in the search query: I don't think Firecrawl is too good at interacting with the page so `https://www.tesla.com/careers/search/?query=product&type=3&site=US` is way better than `https://www.tesla.com/careers/search`
