import { FaChevronDown, FaCheck } from "react-icons/fa";


export default function SelectWithIcon({ value, onChange, options, placeholder }) {
    return (
        <div className="relative w-full">
            <select
                value={value}
                onChange={onChange}
                className={`w-full h-12 border-2  pl-4 rounded-[10px] pr-10 appearance-none focus:outline-1 focus:outline-[#1A3E32] ${
                value ? "border-[#828282]" : "border-[#F5F5F5]"
            }`}
            >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                {opt}
                </option>
            ))}
            </select>
                {value ? (
                <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
            ) : (
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            )}
        </div>
    )
}
