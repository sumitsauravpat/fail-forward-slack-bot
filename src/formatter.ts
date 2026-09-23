import { DiffResult } from "./types";

// Purpose — turns the diff result into the actual readable text posted back to Slack
export function formatMessage(result: DiffResult): string {
  const lines = [];
  lines.push(`🔴 New failures (${result.newFailureList.length})`);

  result.newFailureList.forEach((item) => {
    lines.push(`${item.filePath} > ${item.title}`);
  });

  lines.push(
    `🟠 Still failing, reason changed (${result.changedReasonList.length})`,
  );

  result.changedReasonList.forEach((item) => {
    lines.push(
      `${item.filePath} > ${item.title} (was: ${item.previousError} → now: ${item.errorMessage}).`,
    );
  });

  lines.push(`🟢 Newly passing (${result.newlyPassingList.length})`);

  result.newlyPassingList.forEach((item) => {
    lines.push(`${item.filePath} > ${item.title}`);
  });

  return lines.join("\n");
}
