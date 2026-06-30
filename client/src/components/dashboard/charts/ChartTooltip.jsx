import React from "react";

export default function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    let displayLabel = label;

    try {
        const date = new Date(label);

        if (!Number.isNaN(date.getTime())) {
            displayLabel = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    } catch (error) {
        displayLabel = label;
    }

    return (
        <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 shadow-xl">
            <p className="mb-2 text-xs font-semibold text-slate-400">
                {displayLabel}
            </p>

            {payload.map((item) => (
                <div
                    key={item.dataKey}
                    className="flex justify-between gap-6 text-xs mt-1"
                >
                    <span
                        className={
                            item.dataKey === "income"
                                ? "text-emerald-400"
                                : "text-rose-400"
                        }
                    >
                        {item.name}
                    </span>

                    <span className="font-bold text-white">
                        ${Number(item.value).toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
}