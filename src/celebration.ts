/** Only the requested day is special, using the site's New York time zone. */
export function getCelebrationMessage(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const day = ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join("-");

  return day === "2026-11-01"
    ? "Happy Anniversary!!!"
    : "Wedding details will be here soon!";
}
