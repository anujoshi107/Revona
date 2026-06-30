import React from "react";
import { Trash2 } from "lucide-react";
import Button from "../common/Button";

export default function BulkDeleteBar({
    selectedCount,
    onClearSelection,
    onDeleteSelected,
}) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 border border-blue-500/20 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 animate-slideIn backdrop-blur-xl">
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>

                <span className="text-sm font-semibold text-white">
                    {selectedCount} transaction{selectedCount > 1 ? "s" : ""} selected
                </span>
            </div>

            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onClearSelection}
                    className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                    Clear selection
                </button>

                <Button
                    onClick={onDeleteSelected}
                    variant="danger"
                    size="sm"
                    iconLeft={<Trash2 className="h-3.5 w-3.5" />}
                >
                    Delete Selected
                </Button>
            </div>
        </div>
    );
}