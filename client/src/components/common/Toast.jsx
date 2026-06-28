import React from "react";
import { CheckCircle2, X } from "lucide-react";

export default function Toast({ show, type, message, onClose }) {
    if (!show) return null;

    const isSuccess = type === "success";

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 bg-slate-900 border ${isSuccess ? "border-emerald-500/30" : "border-rose-500/30"
                } shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-slideIn max-w-md text-left`}
        >
            <div
                className={`p-1 ${isSuccess ? "bg-emerald-500/10" : "bg-rose-500/10"
                    } rounded-lg flex-shrink-0`}
            >
                <CheckCircle2
                    className={`h-5 w-5 ${isSuccess ? "text-emerald-400" : "text-rose-400"
                        }`}
                />
            </div>

            <div>
                <h4 className="text-sm font-bold text-white">
                    {isSuccess ? "Action Completed" : "Error Occurred"}
                </h4>

                <p className="text-xs text-slate-400 mt-0.5">{message}</p>
            </div>

            <button
                onClick={onClose}
                className="text-slate-500 hover:text-white p-1 rounded-lg ml-auto cursor-pointer"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}