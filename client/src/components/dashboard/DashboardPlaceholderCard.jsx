import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { TrendingUp, TrendingDown, HelpCircle, Loader2 } from "lucide-react";

const donutColors = ["#f97316", "#0052ff", "#eab308", "#8b5cf6", "#10b981", "#8b5cf6"];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  // Format date label if valid
  let displayLabel = label;
  try {
    const d = new Date(label);
    if (!isNaN(d.getTime())) {
      displayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } catch (e) {}

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-semibold text-slate-400">{displayLabel}</p>

      {payload.map((item) => (
        <div key={item.dataKey} className="flex justify-between gap-6 text-xs mt-1">
          <span
            className={
              item.dataKey === "income" ? "text-emerald-400" : "text-rose-400"
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

export default function DashboardPlaceholderCard({ type, data = [], loading = false, extraData = {} }) {
  if (loading) {
    return (
      <div className="h-full min-h-[360px] rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="text-xs text-slate-400">Loading analytics...</p>
      </div>
    );
  }

  if (type === "overview") {
    // Ensure chart data is sorted by date before rendering
    const formattedChartData = data
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => {
        let formattedDate = item.date;
        try {
          const d = new Date(item.date);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        } catch (e) {}

        return {
          ...item,
          date: formattedDate,
          // Ensure backend "expenses" maps to "expense" for the chart keys
          expense: item.expenses || 0,
        };
      });

    return (
      <div className="h-full min-h-[360px] rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 text-left backdrop-blur-sm">
        {/* Header */}
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

        {/* Chart */}
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

  if (type === "breakdown") {
    // data is { totalSpent, breakdown: [ { name, value, percentage } ] }
    const breakdownList = data.breakdown || [];
    const totalSpent = data.totalSpent || 0;

    const pieData = breakdownList.map((item) => ({
      name: item.name === 'others' ? 'Others' : item.name,
      value: item.value,
      percentage: item.percentage,
    }));

    return (
      <div className="h-full min-h-[360px] rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 text-left backdrop-blur-sm">
        {/* Header */}
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
            {/* Donut Chart - centered */}
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
                <span className="text-lg font-extrabold text-white truncate max-w-[120px]">{formatCurrency(totalSpent)}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Spent
                </span>
              </div>
            </div>

            {/* Legend list */}
            <div className="mt-5 space-y-3 max-h-[140px] overflow-y-auto pr-1">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: donutColors[index % donutColors.length] }}
                  />
                  <span className="text-sm text-slate-300 truncate max-w-[120px]">{item.name}</span>
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

  return null;
}