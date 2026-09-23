import { TestResult } from "./types";

// Purpose — catches renamed tests that exact fingerprint matching misses, so they aren't wrongly reported as a fake new+removed pair
export function findRenamedTests(
  newFailures: TestResult[],
  newlyPassing: TestResult[],
): { oldTest: TestResult; newTest: TestResult }[] {
  const results: { oldTest: TestResult; newTest: TestResult }[] = [];

  newFailures.forEach((item) => {
    const match = newlyPassing.find((entry) => {
      if (
        item.filePath === entry.filePath &&
        (item.title.includes(entry.title) || entry.title.includes(item.title))
      ) {
        return true;
      }
    });
    if (match) {
      results.push({ oldTest: match, newTest: item });
    }
  });
  return results;
}
