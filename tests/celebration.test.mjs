import assert from "node:assert/strict";
import test from "node:test";
import { getCelebrationMessage } from "../src/celebration.ts";

const cases = [
  ["the previous night", "2026-11-01T03:59:59.999Z", false],
  ["midnight in New York", "2026-11-01T04:00:00.000Z", true],
  ["before daylight saving time ends", "2026-11-01T05:30:00.000Z", true],
  ["after daylight saving time ends", "2026-11-01T06:30:00.000Z", true],
  ["the last moment of the day", "2026-11-02T04:59:59.999Z", true],
  ["midnight the following day", "2026-11-02T05:00:00.000Z", false],
  ["a later date", "2026-12-01T17:00:00.000Z", false],
  ["the same date next year", "2027-11-01T17:00:00.000Z", false],
];

for (const [description, timestamp, isAnniversary] of cases) {
  test(description, () => {
    assert.equal(
      getCelebrationMessage(new Date(timestamp)),
      isAnniversary
        ? "Happy Anniversary!!!"
        : "Wedding details will be here soon!",
    );
  });
}
