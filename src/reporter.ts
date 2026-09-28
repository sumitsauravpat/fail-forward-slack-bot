import { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { TestResult as OurTestResult } from "./types";

export class FailForwardReporter implements Reporter {
  results: Omit<OurTestResult, "runId">[];
  project: string;
  endpoint: string;

  constructor({ project, endpoint }: { project: string; endpoint: string }) {
    this.results = [];
    this.project = project;
    this.endpoint = endpoint;
  }

  // Purpose — collects one trimmed result per test as the suite runs; Playwright's extra statuses (timedOut/interrupted) fold into "failed" since our system only reasons about a 3-way status
  onTestEnd(test: TestCase, result: TestResult) {
    const status =
      result.status === "timedOut" || result.status === "interrupted"
        ? "failed"
        : result.status;
    const trimmedResult = {
      filePath: test.location.file,
      title: test.title,
      status,
      errorMessage: result.errors[0]?.message,
    };
    this.results.push(trimmedResult);
  }

  // Purpose — fires once after every test has already run; sends the whole accumulated results array in one POST, matching what src/server.ts's /runs route expects
  async onEnd() {
    await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: this.project, results: this.results }),
    });
  }
}

// Purpose — Playwright resolves a custom reporter's file path by its default export
export default FailForwardReporter;
