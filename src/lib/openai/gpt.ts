import { client } from "./client";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import {  Job, ProcessedJob, RawJob, SearchResult } from "../../base/audit.type";

const JobSchema = z.object({
  jobs: z.array(z.object({
    title: z.string(),
    application_link: z.string(),
    location: z.string().optional(),
    description: z.string().optional(),
    other: z.string().optional(),
  }))
});

const apmCondition = `- Job MUST explicitly have something to do with Product Management, Product Owner, or Product Manager in the title \
                    - Job CANNOT have "senior" or any other word that implies more experience. We are looking for New Grad, Junior, Associate, and Entry Level roles. If a role does not contain a seniority qualifier, consider it to be valid. \
                    - Job MUST be located Remote or in the United States of America`;

const internshipCondition = `- Job MUST explicitly have something to do with a Product internship, or product fellowship in the title \
                    - Job CANNOT have "senior" or any other word that implies more experience. We are looking for Internship and Fellowship roles. \
                    - Job MUST be located Remote or in the United States of America`;



export async function filterJobs(searchResult: SearchResult): Promise<SearchResult> {
  const { jobs, searchConfig } = searchResult;
  console.log(`AI Filtering jobs from ${searchConfig.company} search`)

  const { roleType } = searchConfig;
  const CHUNK_SIZE = 10; // Adjust based on expected token size per job
  const chunks: Job[][] = [];
  const validJobs: ProcessedJob[] = [];

  // Split the jobs into smaller chunks
  for (let i = 0; i < jobs.length; i += CHUNK_SIZE) {
    chunks.push(jobs.slice(i, i + CHUNK_SIZE));
  }

  for (const chunk of chunks) {
    const userInput = { rawJobs: chunk };
    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: `You are an expert at structured data extraction. You will be given unstructured data from a job site \
                  audit and should filter it and convert it into the given structure. Here is the criteria for a valid job: \
                    ${roleType === "apm" ? apmCondition : internshipCondition}`,
        },
        { role: "user", content: JSON.stringify(userInput) },
      ],
      response_format: zodResponseFormat(JobSchema, "job_schema"),
    });

    const response = completion.choices[0].message;

    if (response.parsed.jobs) {
      validJobs.push(...response.parsed.jobs);
    }
  }

  return {
    jobs: validJobs,
    success: true,
    searchConfig,
    count: validJobs.length,
    source: "scraping+ai"
  };
}




