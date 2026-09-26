import { App } from "@slack/bolt";
import { parseCompareCommand } from "./parser";
import { getRunResults } from "./persistence";
import { diffResults } from "./diff";
import { formatMessage } from "./formatter";

const app = new App({
  token: process.env["SLACK_BOT_TOKEN"],
  appToken: process.env["SLACK_APP_TOKEN"],
  socketMode: true,
});

// Purpose — runs the same pipeline local-test.ts runs by hand, but triggered by a real Slack mention instead
app.event("app_mention", async ({ event, say }) => {
  const text = event.text;

  try {
    const { oldRunId, newRunId } = parseCompareCommand(text);
    const oldResults = await getRunResults(oldRunId);
    const newResults = await getRunResults(newRunId);
    const result = diffResults(oldResults, newResults);
    const message = formatMessage(result);
    await say(message);
  } catch (error) {
    if (error instanceof Error) {
      await say(error.message);
    }
  }
});

// Purpose — top-level await needs an async wrapper, same pattern local-test.ts uses
async function main() {
  await app.start();
  console.log("⚡️ Fail Forward Bot is running!");
}

main();
