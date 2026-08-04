import { CHART_PERIODS } from "../../constants/chartPeriods";

/**
 * Shared Year / 6 months / Week dropdown for admin analytics charts.
 */
const ChartPeriodSelect = ({
  value,
  onChange,
  className = "",
  label = "Period",
  id,
}) => {
  const selectId = id || "chart-period-select";

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <label
        htmlFor={selectId}
        className="text-xs font-medium text-gray-500 whitespace-nowrap"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16730F]/30 focus:border-[#16730F]"
      >
        {CHART_PERIODS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChartPeriodSelect;
