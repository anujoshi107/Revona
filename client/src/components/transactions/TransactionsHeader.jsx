import React from "react";
import { Plus } from "lucide-react";

export default function TransactionsHeader({ onAddTransaction }) {
    return (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
                    All Transactions
                </h1>

                <p className="text-sm text-slate-400 font-sans mt-1">
                    Showing all transactions
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onAddTransaction}
                    className="h-11 rounded-xl px-5 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all duration-205 cursor-pointer flex items-center justify-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Transaction</span>
                </button>
            </div>
        </div>
    );
}