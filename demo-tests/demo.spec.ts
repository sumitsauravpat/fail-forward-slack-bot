import { test, expect } from "@playwright/test";

// Purpose — one pass + one fail, just enough to prove the Reporter collects both statuses and POSTs them
test("this one passes", () => {
  expect(1 + 1).toBe(2);
});

test("this one fails", () => {
  expect(1 + 1).toBe(3);
});
