import React from "react";
import { X } from "lucide-react";

export default function ModalHeader({
    mode,
    saving,
    scanning,
    onClose,
}) {
    return (
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-800/70">
            <div>
                <h2 className="text-lg font-bold text-white font-sans">
                    {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
                </h2>

                <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    {mode === "edit"
                        ? "Update the details of this transaction"
                        : "Add a new transaction to track your finances"}
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                disabled={saving || scanning}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-xl transition-all cursor-pointer ml-4 flex-shrink-0"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}