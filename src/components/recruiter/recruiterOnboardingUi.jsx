import React from "react";
import FormLabel from "../forms/FormLabel";

export const RECRUITER_ONBOARDING_STEPS = [
  "Basic Details",
  "Profile Setup",
  "Company Details",
  "Location",
];

const inputClass =
  "w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500";

const textareaClass =
  "w-full min-h-[120px] bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all resize-none";

export function RecruiterPageHero({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="text-center mb-8">
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1A3E32] to-[#2A5E4A] rounded-2xl shadow-lg mb-4">
          <Icon className="text-3xl text-white" />
        </div>
      )}
      {eyebrow && (
        <p className="text-[#16730F] text-sm font-medium uppercase tracking-wide">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3E32] mt-1 mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export function RecruiterFormShell({
  sectionTitle,
  sectionHint,
  icon: Icon,
  children,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1A3E32] to-[#2A5E4A] px-6 py-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          {Icon && <Icon className="text-white/80 shrink-0" />}
          {sectionTitle}
        </h2>
        {sectionHint && (
          <p className="text-white/70 text-sm mt-1">{sectionHint}</p>
        )}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

export function RecruiterTextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
  disabled = false,
  hint,
}) {
  return (
    <div>
      <FormLabel label={label} required={required} optional={optional} />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
      />
      {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
  );
}

export function RecruiterTextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  rows = 4,
  hint,
}) {
  return (
    <div>
      <FormLabel label={label} required={required} />
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={textareaClass}
      />
      {maxLength && (
        <p className="text-xs text-gray-400 text-right mt-1">
          {String(value || "").length}/{maxLength}
        </p>
      )}
      {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
  );
}

export function RecruiterSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
}) {
  return (
    <div>
      <FormLabel label={label} required={required} />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none cursor-pointer`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const labelText = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>
    </div>
  );
}
