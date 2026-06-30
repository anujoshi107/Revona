import React from "react";
import { ChevronDown } from "lucide-react";
import { inputClass, labelClass } from "./transactionModal.constants";

export default function FormSelect({
    label,
    value,
    onChange,
    options,
    disabled = false,
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>

            <div className="relative">
                <select
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    className={`${inputClass} pl-4 pr-9 py-3 appearance-none cursor-pointer text-slate-300`}
                >
                    {options.map((option) => (
                        <option
                            key={option.value || option}
                            value={option.value || option}
                            className="bg-slate-900"
                        >
                            {option.label || option}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
        </div>
    );
}