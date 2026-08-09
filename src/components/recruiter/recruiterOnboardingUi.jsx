import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import FormLabel from "../forms/FormLabel";

const inputClass =
  "w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16730F] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500";

const textareaClass =
  "w-full min-h-[120px] bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16730F] focus:border-transparent transition-all resize-none";

export function RecruiterPageHero({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="text-center mb-8">
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#16730F] to-[#145a0c] rounded-2xl shadow-lg mb-4">
          <Icon className="text-3xl text-white" />
        </div>
      )}
      {eyebrow && (
        <p className="text-[#16730F] text-sm font-medium uppercase tracking-wide">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#16730F] mt-1 mb-2">
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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 relative">
      <div className="bg-gradient-to-r from-[#16730F] to-[#145a0c] px-6 py-4 rounded-t-2xl">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          {Icon && <Icon className="text-white/80 shrink-0" />}
          {sectionTitle}
        </h2>
        {sectionHint && (
          <p className="text-white/70 text-sm mt-1">{sectionHint}</p>
        )}
      </div>
      <div className="p-6 space-y-5 rounded-b-2xl">{children}</div>
    </div>
  );
}

export function RecruiterTextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
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
        onBlur={onBlur}
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
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  hint,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const normalizedOptions = Array.isArray(options)
    ? options.map((opt) => {
        if (typeof opt === "string") {
          return { value: opt, label: opt };
        }
        return {
          value: opt.value ?? opt.label ?? "",
          label: opt.label ?? opt.value ?? "",
        };
      })
    : [];

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (val) => {
    if (disabled) return;
    if (onChange) {
      onChange({
        target: {
          name,
          value: val,
        },
      });
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (onChange) {
      onChange({
        target: {
          name,
          value: "",
        },
      });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <FormLabel label={label} required={required} />}

      {/* Main Trigger Button */}
      <div
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`w-full h-11 bg-white border ${
          isOpen
            ? "border-[#16730F] ring-2 ring-[#16730F]/20 shadow-sm"
            : "border-gray-200 hover:border-gray-300"
        } rounded-xl px-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
          disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""
        }`}
      >
        <span
          className={`text-sm truncate select-none ${
            selectedOption ? "text-gray-900 font-medium" : "text-gray-400"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Clear selection"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          )}
          <FaChevronDown
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#16730F]" : ""
            }`}
          />
        </div>
      </div>

      {/* Popover Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Live Search Input (shows if options >= 4) */}
          {normalizedOptions.length >= 4 && (
            <div className="px-3 pb-2 mb-1 border-b border-gray-100">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full h-9 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#16730F] focus:ring-1 focus:ring-[#16730F] transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FaTimes className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 divide-y divide-gray-50/50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-emerald-50 text-[#16730F] font-semibold"
                        : "text-gray-700 hover:bg-emerald-50/50 hover:text-[#16730F]"
                    }`}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    {isSelected && (
                      <FaCheck className="w-3.5 h-3.5 text-[#16730F] shrink-0" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-xs text-gray-400">
                {searchTerm
                  ? `No matches for "${searchTerm}"`
                  : "No options available"}
              </div>
            )}
          </div>
        </div>
      )}

      {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
  );
}

