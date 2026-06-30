import React from "react";
import { inputClass, labelClass } from "./transactionModal.constants";

export default function FormInput({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    leftText,
    rightIcon,
    inputClassName = "",
    ...rest
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>

            <div className="relative">
                {leftText && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold pointer-events-none">
                        {leftText}
                    </span>
                )}

                <input
                    type={type}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`${inputClass} ${inputClassName}`}
                    {...rest}
                />

                {rightIcon && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>
        </div>
    );
}