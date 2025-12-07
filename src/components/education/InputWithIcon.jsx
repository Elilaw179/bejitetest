import { FaCheck } from "react-icons/fa";

export default function InputWithIcon ({ value, onChange, placeholder, type = "text" }) {
    return (
        <div className="relative w-full">
            <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full h-12 border-2 rounded-[10px] text-sm p-2 pr-10 focus:outline-1 focus:outline-[#1A3E32] ${
                value ? "border-[#828282]" : "border-[#F5F5F5]"
            } ${type === "date" && value ? "hide-calendar-icon" : ""}`}
            />
            {value && (
            <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
            )}
        </div>
    );
}

