import React, { useMemo } from 'react';

const FieldGroup = ({ formData, handleChange, countries }) => {
  const bioAges = useMemo(() => {
    const ages = [];
    for (let i = 18; i <= 70; i++) {
      ages.push(i.toString());
    }
    return ages;
  }, []);

  const fieldGroups = [
    [
      { name: "nickname", label: "NICKNAME", placeholder: "e.g ndcreations", width: "sm:w-[279px]" },
      { name: "phone", label: "PHONE NUMBER", type: "Number", placeholder: "e.g +234706004000", width: "sm:w-[226px]" },
    ],
    [
      { name: "gender", label: "GENDER", type: "select", options: ["Male", "Female", "Other"], width: "sm:w-44" },
      { name: "maritalStatus", label: "MARITAL STATUS", type: "select", options: ["Single", "Married", "Divorced", "Widowed"], width: "sm:w-44" },
      { name: "age", label: "AGE", type: "select", options: bioAges, width: "sm:w-32" },
    ],
    [
      { name: "country", label: "COUNTRY OF ORIGIN", type: "select", options: countries, width: "sm:w-[179px]" },
      { name: "street", label: "STREET ADDRESS", placeholder: "e.g 11, Bawo street.", width: "sm:w-[322px]" },
    ],
    [
      { name: "city", label: "CITY/TOWN", placeholder: "e.g Calabar", width: "sm:w-[179px]" },
      {
        name: "tribe",
        label: "TRIBE",
        type: "datalist",
        options: ["Yoruba", "Hausa", "Igbo", "Ibibio"],
        placeholder: "Enter or select your tribe",
        width: "sm:w-[179px]"
      },
      { name: "zip", label: "ZIP CODE", placeholder: "e.g 60094", width: "sm:w-[126px]" },
    ],
  ];

  return (
    <div className="bg-[#F5F5F5] w-full">
      {fieldGroups.map((group, i) => (
        <div
          key={i}
          className="flex flex-wrap gap-4 p-2 rounded-2xl mb-2 bg-[#82828280] items-center justify-center"
        >
          {group.map((f) => (
            <div key={f.name} className={`text-[12px] w-full ${f.width}`}>
              <p className="mb-1 text-xs font-semibold">{f.label}</p>
              {f.type === "select" ? (
                <select
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-2 text-[#828282] text-sm focus:outline-1 focus:outline-[#1A3E32]"
                >
                  <option value="">{f.placeholder || "Select"}</option>
                  {(f.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : f.type === "datalist" ? (
                <>
                  <input
                    list={`${f.name}-list`}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3 focus:outline-2 focus:outline-[#1A3E32]"
                  />
                  <datalist id={`${f.name}-list`}>
                    {(f.options || []).map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </>
              ) : (
                <input
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3 focus:outline-2 focus:outline-[#1A3E32]"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FieldGroup;
