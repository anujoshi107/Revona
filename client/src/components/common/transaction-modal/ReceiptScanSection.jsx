import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export default function ReceiptScanSection({
    showReceiptScan,
    mode,
    scanning,
    scanError,
    fileInputRef,
    onScanFile,
}) {
    if (!showReceiptScan || mode !== "create") return null;

    return (
        <div>
            <p className="text-xs font-semibold text-slate-400 mb-2 font-sans flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                AI Scan Receipt
            </p>

            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-slate-400">
                    <Sparkles className="h-4 w-4" />
                </div>

                <label className="flex-1 cursor-pointer">
                    <div
                        className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-xs font-semibold transition-all ${scanning
                                ? "bg-blue-500/10 border-blue-500/40 text-blue-400 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-400 border-emerald-500 text-white cursor-pointer"
                            }`}
                    >
                        {scanning ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Scanning...
                            </>
                        ) : (
                            "Choose File"
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        disabled={scanning}
                        onChange={onScanFile}
                        className="hidden"
                    />
                </label>

                <span className="text-xs text-slate-500 font-sans">
                    No file chosen
                </span>
            </div>

            <p className="text-[10px] text-slate-500 mt-1.5 font-sans">
                JPG, PNG up to 2MB
            </p>

            {scanError && (
                <p className="text-xs text-rose-400 mt-1 font-sans">
                    {scanError}
                </p>
            )}
        </div>
    );
}