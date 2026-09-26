import { TestResult } from "./types";
import { buildFingerprint } from "./fingerprint";
import { findRenamedTests } from "./rename";

// Purpose — the core comparison engine: matches two runs' failures by fingerprint to find what's new, what changed, and what's now passing
export function diffResults(
  oldResults: TestResult[],
  newResults: TestResult[],
) {
  const oldFailures = oldResults.filter((item) => item.status === "failed");
  const newFailures = newResults.filter((item) => item.status === "failed");

  const newFailureList = newFailures.filter(
    (item) =>
      !oldFailures.some(
        (entry) => buildFingerprint(entry) === buildFingerprint(item),
      ),
  );

  const changedReasonList = newFailures
    .map((item) => {
      const match = oldFailures.find((entry) => {
        if (buildFingerprint(entry) === buildFingerprint(item)) {
          const isErrorCheck = entry.errorMessage !== item.errorMessage;
          return isErrorCheck;
        }
      });
      if (match) {
        return { ...item, previousError: match.errorMessage };
      }
      return null;
    })
    // filter(Boolean) removes the nulls at runtime, but TS can't infer that automatically — assert the real shape
    .filter(Boolean) as (TestResult & { previousError: string })[];

  const newlyPassingList = oldFailures.filter(
    (item) =>
      !newFailures.some(
        (entry) => buildFingerprint(item) === buildFingerprint(entry),
      ),
  );

  // Purpose — a rename looks like a fake new failure + a fake newly-passing test unless we catch and strip out the matched pairs below
  const renamedPairs = findRenamedTests(newFailureList, newlyPassingList);

  const filteredNewFailureList = newFailureList.filter(
    (item) =>
      !renamedPairs.some(
        (check) => buildFingerprint(check.newTest) === buildFingerprint(item),
      ),
  );

  const filteredNewlyPassingList = newlyPassingList.filter(
    (item) =>
      !renamedPairs.some(
        (check) => buildFingerprint(check.oldTest) === buildFingerprint(item),
      ),
  );

  return {
    newFailureList: filteredNewFailureList,
    changedReasonList,
    newlyPassingList: filteredNewlyPassingList,
  };
}
