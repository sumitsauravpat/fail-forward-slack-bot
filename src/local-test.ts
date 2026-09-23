import { formatMessage } from "./formatter";
import { TestResult } from "./types";
import { diffResults } from "./diff";

const oldResults: TestResult[] = [
  {
    runId: 1,
    filePath: "auth.spec.ts",
    title: "login",
    status: "failed",
    errorMessage: "Timeout waiting for button",
  },
  { runId: 1, filePath: "cart.spec.ts", title: "checkout", status: "failed" },
];

const newResults: TestResult[] = [
  {
    runId: 2,
    filePath: "auth.spec.ts",
    title: "login",
    status: "failed",
    errorMessage: "Element not found: #submit",
  },
  { runId: 2, filePath: "cart.spec.ts", title: "payment", status: "failed" },
];

const result = diffResults(oldResults, newResults);
const message = formatMessage(result);
console.log(message);
