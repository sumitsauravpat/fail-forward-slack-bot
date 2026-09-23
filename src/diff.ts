import { TestResult } from "./types";
import { buildFingerprint } from "./fingerprint";

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
  return { newFailureList, changedReasonList, newlyPassingList };
}
