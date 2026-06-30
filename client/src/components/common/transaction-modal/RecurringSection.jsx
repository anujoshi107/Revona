import React from "react";
import { Repeat } from "lucide-react";
import FormSelect from "./FormSelect";
import { RECURRING_INTERVALS } from "./transactionModal.constants";

export default function RecurringSection({
    saving,
    isRecurring,
    setIsRecurring,
    recurringInterval,
    setRecurringInterval,
}) {
    return (
        <>
            <div className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <div>
                    <p className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                        <Repeat className="h-3.5 w-3.5 text-slate-400" />
                        Recurring Transaction
                    </p>

                    <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                        Set recurring to repeat this transaction
                    </p>
                </div>

                <button
                    type="button"
                    disabled={saving}
                    onClick={() => setIsRecurring((prev) => !prev)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${isRecurring ? "bg-emerald-500" : "bg-slate-700"
                        }`}
                >
                    <span
                        className={`inline-block rounded-full bg-white shadow-md transition-transform ${isRecurring ? "translate-x-6" : "translate-x-1"
                            }`}
                        style={{ width: "18px", height: "18px" }}
                    />
                </button>
            </div>

            {isRecurring && (
                <FormSelect
                    label="Repeat Interval"
                    value={recurringInterval}
                    disabled={saving}
                    onChange={(e) => setRecurringInterval(e.target.value)}
                    options={RECURRING_INTERVALS}
                />
            )}
        </>
    );
}