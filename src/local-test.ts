import { formatMessage } from "./formatter";
import { TestResult } from "./types";
import { diffResults } from "./diff";
import { saveRun, getRunResults } from "./persistence";
import { db } from "./db";

async function main() {
  // Purpose — save two real runs to Postgres, exactly what the future Reporter package will eventually do
  const oldRunId = await saveRun("checkout-service", [
    {
      filePath: "auth.spec.ts",
      title: "login",
      status: "failed",
      errorMessage: "Timeout waiting for button",
    },
    { filePath: "cart.spec.ts", title: "checkout", status: "failed" },
  ]);

  const newRunId = await saveRun("checkout-service", [
    {
      filePath: "auth.spec.ts",
      title: "login",
      status: "failed",
      errorMessage: "Element not found: #submit",
    },
    { filePath: "cart.spec.ts", title: "payment", status: "failed" },
  ]);

  // Purpose — load both runs back from Postgres, exactly what the compare command will eventually do
  const oldResults: TestResult[] = await getRunResults(oldRunId);
  const newResults: TestResult[] = await getRunResults(newRunId);

  const result = diffResults(oldResults, newResults);
  const message = formatMessage(result);
  console.log(message);

  await db.$disconnect();
}

main();
