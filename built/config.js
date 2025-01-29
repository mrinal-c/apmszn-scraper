"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditConfig = void 0;
exports.auditConfig = {
    // linkedin: {
    //   searches: [
    //     {
    //       keyword: "product",
    //       roleType: "apm",
    //       source: "scraping"
    //     }
    //   ]
    // },
    // spotify: {
    //   searches: [
    //     {
    //       keyword: "N/A",
    //       roleType: "apm",
    //       source: "scraping"
    //     },
    //     {
    //       keyword: "N/A",
    //       roleType: "internship",
    //       source: "scraping"
    //     },
    //     {
    //       roleType: "internship",
    //       source: "firecrawl",
    //       searchQuery: "product internships",
    //       url: "https://www.lifeatspotify.com/jobs?c=product&c=students&l=boston&l=los-angeles&l=new-york"
    //     }
    //   ]
    // },
    // atlassian: {
    //   searches: [
    //     {
    //       keyword: "N/A",
    //       roleType: "apm",
    //       source: "scraping"
    //     },
    //     {
    //       keyword: "N/A",
    //       roleType: "internship",
    //       source: "scraping"
    //     }
    //   ]
    // },
    // instacart: {
    //   searches: [
    //     {
    //       keyword: "product",
    //       roleType: "apm",
    //       source: "scraping"
    //     },
    //     {
    //       keyword: "product",
    //       roleType: "internship",
    //       source: "scraping"
    //     }
    //   ]
    // },
    // walmart: {
    //   searches: [
    //     {
    //       keyword: "product",
    //       roleType: "apm",
    //       source: "scraping"
    //     },
    //     {
    //       keyword: "product",
    //       roleType: "internship",
    //       source: "scraping"
    //     }
    //   ]
    // },
    // figma: {
    //   searches: [
    //     {
    //       keyword: "product",
    //       roleType: "apm",
    //       source: "scraping",
    //       aiFilter: true
    //     },
    //     {
    //       keyword: "product",
    //       roleType: "internship",
    //       source: "scraping"
    //     }
    //   ]
    // },
    // kpcb: {
    //   searches: [
    //     {
    //       keyword: "N/A",
    //       roleType: "apm",
    //       source: "scraping"
    //     },
    //     {
    //       roleType: "internship",
    //       source: "firecrawl",
    //       searchQuery: "product internships or fellowships",
    //       url: "https://jobs.ashbyhq.com/kleinerperkinsfellows"
    //     }
    //   ]
    // },
    // yahoo: {
    //   searches: [
    //     {
    //       keyword: "product",
    //       roleType: "apm",
    //       source: "scraping"
    //     },
    //     {
    //       roleType: "internship",
    //       source: "scraping",
    //       keyword: "product"
    //     }
    //   ]
    // },
    // tinder: {
    //   searches: [
    //     {
    //       keyword: "product",
    //       roleType: "apm",
    //       source: "scraping"
    //     },
    //     {
    //       roleType: "internship",
    //       source: "firecrawl",
    //       url: "https://www.lifeattinder.com/?departments=product&job-type=internship#open-positions",
    //       searchQuery: "product internships"
    //     }
    //   ]
    // },
    cloudflare: {
        searches: [
            {
                source: "firecrawl",
                url: "https://www.cloudflare.com/careers/jobs/?title=intern",
                searchQuery: "product internships",
                roleType: "internship"
            }
        ]
    },
    // hubspot: {
    //     searches: [
    //       {
    //         source: "firecrawl",
    //         url: "https://www.hubspot.com/careers/jobs?page=1#office=san-francisco,cambridge,remote;department=product-ux-engineering;roleType=intern;",
    //         searchQuery: "product internships",
    //         roleType: "internship"
    //       },
    //       {
    //         source: "firecrawl",
    //         url: "https://www.hubspot.com/careers/jobs?page=1#office=san-francisco,cambridge,remote;department=product-ux-engineering",
    //         searchQuery: "software engineering and engineering manager roles",
    //         roleType: "apm"
    //       }
    //     ]
    //   },
    // uipath: {
    //   searches: [
    //     {
    //       source: "firecrawl",
    //       url: "https://careers.uipath.com/careers/jobs?sortBy=relevance&page=1&categories=Product&limit=100&keywords=intern",
    //       searchQuery: "product internships",
    //       roleType: "internship"
    //     },
    //     {
    //       source: "firecrawl",
    //       url: "https://careers.uipath.com/careers/jobs?sortBy=relevance&page=1&categories=Product&limit=100",
    //       searchQuery: "product management roles",
    //       roleType: "apm"
    //     }
    //   ]
    // },
    // tesla: {
    //   searches: [
    //     {
    //       source: "firecrawl",
    //       url: "https://www.tesla.com/careers/search/?query=product&type=3&site=US",
    //       searchQuery: "product internships",
    //       roleType: "internship"
    //     },
    //     {
    //       source: "firecrawl",
    //       url: "https://www.tesla.com/careers/search/?query=product%20manage&site=US",
    //       searchQuery: "product management/manager related roles",
    //       roleType: "apm"
    //     }
    //   ]
    // },
    // ebay: {
    //   searches: [
    //     {
    //       source: "firecrawl",
    //       url: "https://app.ripplematch.com/v2/public/company/ebay/",
    //       searchQuery: "all internships on this page",
    //       roleType: "internship"
    //     }
    //   ]
    // }
};
