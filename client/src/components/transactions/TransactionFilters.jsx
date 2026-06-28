import React from "react";
import { ChevronDown, Clock, Filter, Search, X } from "lucide-react";

export default function TransactionFilters({
  keyword,
  setKeyword,
  typeFilter,
  setTypeFilter,
  recurringFilter,
  setRecurringFilter,
  pageSize,
  setPageSize,
  setPage,
}) {
  return (
    <div className="border-b border-slate-800/70 p-4 sm:p-5 bg-slate-950/20">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_170px_170px_120px] lg:items-center">
        <SearchBox keyword={keyword} setKeyword={setKeyword} />

        <SelectBox
          icon={<Filter className="h-4 w-4 text-slate-500" />}
          value={typeFilter}
          onChange={(value) => {
            setTypeFilter(value);
            setPage(1);
          }}
          options={[
            { label: "All Types", value: "" },
            { label: "Income", value: "INCOME" },
            { label: "Expense", value: "EXPENSE" },
          ]}
        />

        <SelectBox
          icon={<Clock className="h-4 w-4 text-slate-500" />}
          value={recurringFilter}
          onChange={(value) => {
            setRecurringFilter(value);
            setPage(1);
          }}
          options={[
            { label: "Frequently", value: "" },
            { label: "Recurring Only", value: "RECURRING" },
            { label: "One-time Only", value: "NON_RECURRING" },
          ]}
        />

        <SelectBox
          value={pageSize}
          onChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
          options={[
            { label: "Show 10", value: 10 },
            { label: "Show 20", value: 20 },
            { label: "Show 55", value: 55 },
          ]}
        />
      </div>
    </div>
  );
}

function SearchBox({ keyword, setKeyword }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />

      <input
        type="text"
        placeholder="Search transactions..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 pl-11 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/70 transition-all font-sans"
      />

      {keyword && (
        <button
          onClick={() => setKeyword("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function SelectBox({ icon, value, onChange, options }) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pr-8 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/70 transition-all appearance-none cursor-pointer font-sans ${
          icon ? "pl-10" : "px-4"
        }`}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
    </div>
  );
}