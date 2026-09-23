import { TestResult } from "./types";

// Purpose — combines file+title into one string so matching the same test across two runs is a single comparison, not two
export function buildFingerprint(result: TestResult): string {
  return `${result.filePath}///${result.title}`;
}
