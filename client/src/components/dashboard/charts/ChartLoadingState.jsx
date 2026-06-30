import React from "react";
import { Loader2 } from "lucide-react";

export default function ChartLoadingState() {
    return (
        <div className="h-full min-h-[360px] rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />

            <p className="text-xs text-slate-400">Loading analytics...</p>
        </div>
    );
}