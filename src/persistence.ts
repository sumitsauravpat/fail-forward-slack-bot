import { db } from "./db";
import { TestResult } from "./types";

// Purpose — saves a full test run and its results to Postgres in one go, returns the new run's real id
export async function saveRun(
  project: string,
  results: Omit<TestResult, "runId">[],
): Promise<number> {
  const run = await db.run.create({
    data: {
      project,
      testResults: {
        create: results.map((result) => ({
          filePath: result.filePath,
          title: result.title,
          status: result.status,
          errorMessage: result.errorMessage,
        })),
      },
    },
  });

  return run.id;
}

// Purpose — loads every TestResult belonging to one specific run, by its real database id
export async function getRunResults(runId: number): Promise<TestResult[]> {
  const results = await db.testResult.findMany({
    where: { runId },
  });

  return results.map((result) => ({
    runId: result.runId,
    filePath: result.filePath,
    title: result.title,
    status: result.status as "passed" | "failed" | "skipped",
    errorMessage: result.errorMessage ?? undefined,
  }));
}
