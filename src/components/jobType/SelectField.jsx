import { FaCheck } from "react-icons/fa";


export default function SelectField({ name, label, value, onChange, options, placeholder = "Select" }) {

    return (
        <div className="w-full md:w-[48%] lg:w-[30%]">
            <p className="text-[12px] font-semibold mb-1">{label}</p>
            <div className="relative w-full">
                <select
                    className={`select-with-check appearance-none focus:outline-1 focus:outline-[#1A3E32] ${value ? "filled" : ""} w-full text-[#33333380] text-sm p-3 pr-10 rounded-[10px] border-[#F5F5F5] border-2`}
                    value={value}
                    name={name}
                    onChange={onChange}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                    ))}
                </select>
                {value && <FaCheck className="absolute right-3 top-3 text-green-500 text-lg pointer-events-none" />}
            </div>
        </div>
    );
}