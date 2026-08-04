export const CHART_PERIODS = [
  { value: "week", label: "Week progress", days: 7 },
  { value: "six_months", label: "6 months", days: 180 },
  { value: "year", label: "Year", days: 365 },
];

export const DEFAULT_CHART_PERIOD = "week";

export function getChartPeriodLabel(period) {
  return (
    CHART_PERIODS.find((p) => p.value === period)?.label || "Week progress"
  );
}

export function getChartPeriodDays(period) {
  return (
    CHART_PERIODS.find((p) => p.value === period)?.days ||
    CHART_PERIODS[0].days
  );
}

/** Format chart axis/tooltip labels for ISO dates or pre-formatted buckets. */
export function formatChartTick(value) {
  if (value == null || value === "") return "";
  const str = String(value);
  if (/[A-Za-z]/.test(str) && !/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str;
  }
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
