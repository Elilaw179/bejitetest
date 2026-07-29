import React from "react";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options = [],
  rows = 4,
  required = false,
  error,
  helperText,
  className = "",
  inputClassName = "",
  children,
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#1A3E32]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          className={`w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 font-medium cursor-pointer ${inputClassName}`}
          {...props}
        >
          {options.map((opt, idx) => (
            <option
              key={opt.value ?? idx}
              value={typeof opt === "object" ? opt.value : opt}
            >
              {typeof opt === "object" ? opt.label : opt}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 placeholder:text-gray-400 font-medium resize-none ${inputClassName}`}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 placeholder:text-gray-400 font-medium ${inputClassName}`}
          {...props}
        />
      )}

      {helperText && (
        <p className="text-[11px] text-gray-500 font-normal">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
