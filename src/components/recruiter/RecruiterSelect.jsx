import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaChevronDown, FaSearch, FaCheck } from "react-icons/fa";

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
  className = "",
  id,
  closeBtn = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const normalizedOptions = Array.isArray(options)
    ? options.map((opt) => {
        if (typeof opt === "string" || typeof opt === "number") {
          return { value: opt, label: String(opt) };
        }
        return {
          value: opt.value ?? opt.label ?? "",
          label: String(opt.label ?? opt.value ?? ""),
        };
      })
    : [];

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value),
  );

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim()),
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
    <div className={`relative ${className}`.trim()} ref={dropdownRef} id={id}>
      {label &&
        (typeof label === "string" ? (
          <label className="block mb-1.5 text-xs font-bold text-gray-700 tracking-wide">
            {label} {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        ) : (
          label
        ))}

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
        className={`w-full h-10 bg-white border ${
          isOpen
            ? "border-[#16730F] ring-2 ring-[#16730F]/20 shadow-sm"
            : "border-gray-200 hover:border-gray-300"
        } rounded-xl px-3 flex items-center justify-between cursor-pointer transition-all duration-200 ${
          disabled
            ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-75"
            : ""
        }`}
      >
        <span
          className={`text-xs sm:text-sm truncate select-none ${
            selectedOption || (value !== null && value !== undefined && String(value).trim() !== "")
              ? "text-gray-900 font-semibold"
              : "text-gray-400 font-normal"
          }`}
        >
          {selectedOption
            ? selectedOption.label
            : (value !== null && value !== undefined && String(value).trim() !== "")
              ? String(value)
              : placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {Boolean(closeBtn) &&
            value !== "" &&
            value !== null &&
            value !== undefined &&
            !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Clear selection"
              >
                <FaTimes className="w-2.5 h-2.5" />
              </button>
            )}
          <FaChevronDown
            className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#16730F]" : ""
            }`}
          />
        </div>
      </div>

      {/* Popover Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 min-w-[140px]">
          {/* Live Search Input (shows if options >= 4) */}
          {normalizedOptions.length >= 4 && (
            <div className="px-3 pb-2 mb-1 border-b border-gray-100">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 w-3 h-3 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-8 pl-8 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#16730F] focus:ring-1 focus:ring-[#16730F] transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FaTimes className="w-2 h-2" />
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
                    className={`px-3.5 py-2 text-xs sm:text-sm cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-emerald-50 text-[#16730F] font-semibold"
                        : "text-gray-700 hover:bg-emerald-50/50 hover:text-[#16730F]"
                    }`}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    {isSelected && (
                      <FaCheck className="w-3 h-3 text-[#16730F] shrink-0" />
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

export default RecruiterSelect;
