import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";

export default function Pagination({
    page,
    totalPages,
    totalCount,
    onPageChange,
    itemName = "transactions",
}) {
    // Don't show pagination if there is only one page
    if (totalPages <= 1) return null;

    return (
        <div className="px-6 py-4 border-t border-slate-800/60 flex items-center justify-between flex-wrap gap-4 bg-slate-950/10">
            {/* Left Side */}
            <span className="text-xs text-slate-500 font-sans font-medium">
                Showing page{" "}
                <strong className="text-slate-300">{page}</strong> of{" "}
                <strong className="text-slate-300">{totalPages}</strong> (
                {totalCount} total {itemName})
            </span>

            {/* Right Side */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    variant="secondary"
                    size="sm"
                    className="px-3"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;

                        // Same logic as your original code
                        if (
                            totalPages > 5 &&
                            Math.abs(page - pageNumber) > 2 &&
                            pageNumber !== 1 &&
                            pageNumber !== totalPages
                        ) {
                            if (
                                pageNumber === 2 ||
                                pageNumber === totalPages - 1
                            ) {
                                return (
                                    <span
                                        key={pageNumber}
                                        className="text-slate-600 px-1 text-xs"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            return null;
                        }

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                className={`h-8 w-8 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${pageNumber === page
                                        ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                                        : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-900/40"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                </div>

                <Button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    variant="secondary"
                    size="sm"
                    className="px-3"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}