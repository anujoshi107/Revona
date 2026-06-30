import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import ChartTooltip from "./ChartTooltip";

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount || 0);
}

function formatChartData(data) {
    return data
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((item) => {
            let formattedDate = item.date;

            try {
                const date = new Date(item.date);

                if (!Number.isNaN(date.getTime())) {
                    formattedDate = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    });
                }
            } catch (error) {
                formattedDate = item.date;
            }

            return {
                ...item,
                date: formattedDate,
                expense: item.expenses || 0,
            };
        });
}

export default function OverviewChart({ data = [], extraData = {} }) {
    const formattedChartData = formatChartData(data);

    return (
        <div className="h-full min-h-[360px] rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 text-left backdrop-blur-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white">
                        Transaction Overview
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Showing total transactions for the selected range
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Total Income
                        </p>

                        <p className="mt-1 flex items-center justify-end text-base font-bold text-white">
                            <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                            {formatCurrency(extraData.totalIncomeAmount || 0)}
                        </p>

                        <p className="text-[10px] text-slate-500 mt-0.5">
                            {extraData.totalIncomeCount || 0} transactions
                        </p>
                    </div>

                    <div className="h-12 w-px bg-slate-800" />

                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Total Expenses
                        </p>

                        <p className="mt-1 flex items-center justify-end text-base font-bold text-white">
                            <TrendingDown className="mr-1.5 h-3.5 w-3.5 text-rose-400" />
                            {formatCurrency(extraData.totalExpenseAmount || 0)}
                        </p>

                        <p className="text-[10px] text-slate-500 mt-0.5">
                            {extraData.totalExpenseCount || 0} transactions
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-[260px] w-full">
                {formattedChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">
                        No transactions in this period
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={formattedChartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>

                                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                stroke="#1e293b"
                                strokeOpacity={0.8}
                            />

                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                                dy={10}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 11 }}
                                tickFormatter={(value) => `$${value}`}
                            />

                            <Tooltip content={<ChartTooltip />} />

                            <Area
                                type="monotone"
                                dataKey="income"
                                name="Income"
                                stroke="#10b981"
                                strokeWidth={3}
                                fill="url(#incomeFill)"
                                dot={false}
                                activeDot={{ r: 5 }}
                            />

                            <Area
                                type="monotone"
                                dataKey="expense"
                                name="Expense"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fill="url(#expenseFill)"
                                dot={false}
                                activeDot={{ r: 5 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}