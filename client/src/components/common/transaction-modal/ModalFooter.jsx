import React from "react";
import { Loader2 } from "lucide-react";

export default function ModalFooter({ saving, scanning }) {
    return (
        <div className="px-6 pb-6 pt-4 border-t border-slate-800/70">
            <button
                type="submit"
                form="add-tx-form"
                disabled={saving || scanning}
                className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}