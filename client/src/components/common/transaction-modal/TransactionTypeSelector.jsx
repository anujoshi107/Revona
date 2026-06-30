import React from "react";
import { labelClass } from "./transactionModal.constants";

export default function TransactionTypeSelector({
    type,
    setType,
    saving,
}) {
    return (
        <div>
            <label className={labelClass}>Transaction Type</label>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setType("INCOME")}
                    disabled={saving}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${type === "INCOME"
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                            : "bg-slate-950/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                        }`}
                >
                    <span
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${type === "INCOME" ? "border-emerald-500" : "border-slate-600"
                            }`}
                    >
                        {type === "INCOME" && (
                            <span className="h-2 w-2 rounded-full bg-emerald-500 block" />
                        )}
                    </span>

                    Income
                </button>

                <button
                    type="button"
                    onClick={() => setType("EXPENSE")}
                    disabled={saving}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${type === "EXPENSE"
                            ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                            : "bg-slate-950/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                        }`}
                >
                    <span
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${type === "EXPENSE" ? "border-rose-500" : "border-slate-600"
                            }`}
                    >
                        {type === "EXPENSE" && (
                            <span className="h-2 w-2 rounded-full bg-rose-500 block" />
                        )}
                    </span>

                    Expense
                </button>
            </div>
        </div>
    );
}