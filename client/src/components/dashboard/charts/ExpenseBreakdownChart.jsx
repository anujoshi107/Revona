import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { HelpCircle } from "lucide-react";

const donutColors = [
    "#f97316",
    "#0052ff",
    "#eab308",
    "#8b5cf6",
    "#10b981",
    "#8b5cf6",
];

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount || 0);
}

function formatBreakdownData(breakdownList) {
    return breakdownList.map((item) => ({
        name: item.name === "others" ? "Others" : item.name,
        value: item.value,
        percentage: item.percentage,
    }));
}

export default function ExpenseBreakdownChart({ data = {} }) {
    const breakdownList = data.breakdown || [];
    const totalSpent = data.totalSpent || 0;

    const pieData = formatBreakdownData(breakdownList);

    return (
        <div className="h-full min-h-[360px] rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 text-left backdrop-blur-sm">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">
                        Expenses Breakdown
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Total expenses for the selected range
                    </p>
                </div>

                <HelpCircle className="h-4 w-4 text-slate-500" />
            </div>

            {breakdownList.length === 0 ? (
                <div className="h-[240px] flex items-center justify-center text-xs text-slate-500">
                    No expenses recorded in this period
                </div>
            ) : (
                <>
                    <div className="mx-auto relative h-[160px] w-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={48}
                                    outerRadius={72}
                                    stroke="none"
                                >
                                    {pieData.map((item, index) => (
                                        <Cell
                                            key={item.name}
                                            fill={donutColors[index % donutColors.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-extrabold text-white truncate max-w-[120px]">
                                {formatCurrency(totalSpent)}
                            </span>

                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Total Spent
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3 max-h-[140px] overflow-y-auto pr-1">
                        {pieData.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-2.5">
                                <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{
                                        backgroundColor:
                                            donutColors[index % donutColors.length],
                                    }}
                                />

                                <span className="text-sm text-slate-300 truncate max-w-[120px]">
                                    {item.name}
                                </span>

                                <span className="ml-auto text-sm font-bold text-white">
                                    {formatCurrency(item.value)}
                                </span>

                                <span className="text-xs text-slate-500 w-10 text-right">
                                    ({item.percentage}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}