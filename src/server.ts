import express from "express";
import { saveRun } from "./persistence";

const app = express();

app.use(express.json());

// Purpose — the real ingestion endpoint any outside Playwright project's Reporter POSTs its results to
app.post("/runs", async (req, res) => {
  const { project, results } = req.body;
  const runId = await saveRun(project, results);
  res.json({ runId });
});

app.listen(3000, () => {
  console.log("Server started");
});
