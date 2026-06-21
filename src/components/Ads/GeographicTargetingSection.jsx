import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  getAllCountryNames,
  getStateOptionsForCountries,
  getCityOptionsForStates,
  stateKeyBelongsToCountry,
  cityKeyBelongsToState,
} from "../../utils/countryStateData";

const SearchableMultiSelect = ({
  label,
  placeholder,
  emptyMessage,
  options,
  selectedValues,
  onChange,
  getOptionValue,
  getOptionLabel,
}) => {
  const containerRef = useRef(null);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(query),
    );
  }, [options, search, getOptionLabel]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }
    onChange([...selectedValues, value]);
  };

  const openDropdown = () => setIsOpen(true);

  return (
    <div
      className={`mb-5 relative ${isOpen ? "z-[200]" : "z-0"}`}
      ref={containerRef}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedValues.map((value) => {
            const option = options.find((item) => getOptionValue(item) === value);
            const labelText = option
              ? getOptionLabel(option)
              : value.includes("|")
                ? value.split("|").pop()
                : value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleValue(value)}
                className="px-3 py-1.5 rounded-full text-xs sm:text-sm bg-[#1A3E32] text-white shadow-sm"
              >
                {labelText} ×
              </button>
            );
          })}
        </div>
      )}

      <div className={`relative ${isOpen ? "z-[200]" : ""}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={openDropdown}
          onClick={openDropdown}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent text-sm"
        />

        {isOpen && (
          <div className="absolute z-[9999] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl divide-y divide-gray-100">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">{emptyMessage}</p>
            ) : (
              filteredOptions.map((option) => {
                const value = getOptionValue(option);
                const checked = selectedValues.includes(value);

                return (
                  <label
                    key={value}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                      checked ? "bg-[#1A3E32]/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleValue(value)}
                      className="rounded border-gray-300 text-[#1A3E32] focus:ring-[#1A3E32]"
                    />
                    <span className="text-gray-700">{getOptionLabel(option)}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function GeographicTargetingSection({ audience, onUpdate }) {
  const countries = useMemo(
    () => audience.countries || [],
    [audience.countries],
  );
  const states = useMemo(() => audience.states || [], [audience.states]);
  const cities = useMemo(() => audience.cities || [], [audience.cities]);

  const countryOptions = useMemo(() => getAllCountryNames(), []);

  const stateOptions = useMemo(
    () => getStateOptionsForCountries(countries),
    [countries],
  );

  const cityOptions = useMemo(
    () => getCityOptionsForStates(states),
    [states],
  );

  const handleCountriesChange = (nextCountries) => {
    const nextStates = states.filter((stateKey) =>
      nextCountries.some((country) => stateKeyBelongsToCountry(stateKey, country)),
    );
    const nextCities = cities.filter((cityKey) =>
      nextStates.some((stateKey) => cityKeyBelongsToState(cityKey, stateKey)),
    );

    onUpdate("countries", nextCountries);
    if (nextStates.length !== states.length) {
      onUpdate("states", nextStates);
    }
    if (nextCities.length !== cities.length) {
      onUpdate("cities", nextCities);
    }
  };

  const handleStatesChange = (nextStates) => {
    const nextCities = cities.filter((cityKey) =>
      nextStates.some((stateKey) => cityKeyBelongsToState(cityKey, stateKey)),
    );

    onUpdate("states", nextStates);
    if (nextCities.length !== cities.length) {
      onUpdate("cities", nextCities);
    }
  };

  return (
    <>
      <SearchableMultiSelect
        label="Countries"
        placeholder="Search countries..."
        emptyMessage="No countries match your search."
        options={countryOptions}
        selectedValues={countries}
        onChange={handleCountriesChange}
        getOptionValue={(name) => name}
        getOptionLabel={(name) => name}
      />

      {countries.length > 0 ? (
        <SearchableMultiSelect
          label="States / Provinces"
          placeholder="Search states..."
          emptyMessage={
            stateOptions.length
              ? "No states match your search."
              : "No states available for the selected countries."
          }
          options={stateOptions}
          selectedValues={states}
          onChange={handleStatesChange}
          getOptionValue={(option) => option.key}
          getOptionLabel={(option) => option.label}
        />
      ) : (
        <p className="text-sm text-gray-500 mb-5">
          Select at least one country to choose states or provinces.
        </p>
      )}

      {states.length > 0 ? (
        <SearchableMultiSelect
          label="Cities / Areas"
          placeholder="Search cities..."
          emptyMessage={
            cityOptions.length
              ? "No cities match your search."
              : "No cities available for the selected states."
          }
          options={cityOptions}
          selectedValues={cities}
          onChange={(nextCities) => onUpdate("cities", nextCities)}
          getOptionValue={(option) => option.key}
          getOptionLabel={(option) => option.label}
        />
      ) : countries.length > 0 ? (
        <p className="text-sm text-gray-500">
          Select at least one state to choose cities or areas.
        </p>
      ) : null}
    </>
  );
}
