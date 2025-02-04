import { SearchConfig } from './src/base/config.type'
export const auditConfig: SearchConfig[] = [
  {
    company: "tesla",
    source: "firecrawl",
    roleType: "apm",
    searchQuery: "all product manager/product management jobs",
    url: "https://www.tesla.com/careers/search/?query=product&site=US"
  },
  {
    company: "linkedin",
    source: "scraping+ai",
    roleType: "internship",
    keyword: "product internships"
  },
  {
    company: "linkedin",
    source: "scraping+ai",
    roleType: "apm",
    keyword: "product manager"
  }
]
