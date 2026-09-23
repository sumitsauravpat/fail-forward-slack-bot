interface Run {
  id: number;
  project: string;
  createdAt: Date;
}

export interface TestResult {
  runId: number;
  filePath: string;
  title: string;
  status: "passed" | "failed" | "skipped";
  errorMessage?: string;
}

export interface DiffResult {
  newFailureList: TestResult[];
  changedReasonList: (TestResult & { previousError: string })[];
  newlyPassingList: TestResult[];
}
