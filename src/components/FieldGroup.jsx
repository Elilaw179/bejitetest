import React from 'react';

const fieldGroups = [
  [
    { name: "nickname", label: "NICKNAME", placeholder: "e.g ndcreations", width: "sm:w-[279px]" },
    { name: "phone", label: "PHONE NUMBER", placeholder: "e.g +234706004000", width: "sm:w-[226px]" },
  ],
  [
    { name: "gender", label: "GENDER", type: "select", options: ["male", "female", "other"], width: "sm:w-44" },
    { name: "maritalStatus", label: "MARITAL STATUS", type: "select", options: ["single", "married", "divorced", "widowed"], width: "sm:w-44" },
    { name: "age", label: "AGE", type: "date", width: "sm:w-32" },
  ],
  [
    { name: "country", label: "COUNTRY", type: "select", width: "sm:w-[179px]" },
    { name: "street", label: "STREET ADDRESS", placeholder: "e.g 11, Bawo street.", width: "sm:w-[322px]" },
  ],
  [
    { name: "city", label: "CITY/TOWN", placeholder: "e.g Calabar", width: "sm:w-[179px]" },
    { name: "tribe", label: "TRIBE", placeholder: "Enter your tribe", width: "sm:w-[179px]" },
    { name: "zip", label: "ZIP CODE", placeholder: "e.g 60094", width: "sm:w-[126px]" },
  ],
];

const FieldGroup = ({ formData, handleChange, countries }) => (
  <div className=" bg-[#F5F5F5] w-full">
    {fieldGroups.map((group, i) => (
      <div key={i} className="flex flex-wrap gap-4 p-2 rounded-2xl mb-2 bg-[#82828280] items-center justify-center ">
        {group.map((f) => (
          <div key={f.name} className={`text-[12px] w-full ${f.width}`}>
            <p className="mb-1">{f.label}</p>
            {f.type === "select" ? (
              <select
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm"
              >
                <option value="">{f.placeholder || "Select"}</option>
                {(f.options || countries).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                type={f.type || "text"}
                placeholder={f.placeholder}
                className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
              />
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default FieldGroup;
