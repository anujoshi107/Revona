import { useMemo, useState } from "react";

export default function useSortedTransactions(transactions) {
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    function handleSort(field) {
        if (sortBy === field) {
            setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    }

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => {
            const valA = getSortValue(a, sortBy);
            const valB = getSortValue(b, sortBy);

            if (valA < valB) {
                if (sortOrder === "asc") {
                    return -1;
                } else {
                    return 1;
                }
            }

            if (valA > valB) {
                if (sortOrder === "asc") {
                    return 1;
                } else {
                    return -1;
                }
            }

            return 0;
        });
    }, [transactions, sortBy, sortOrder]);

    return {
        sortedTransactions,
        sortBy,
        sortOrder,
        handleSort,
    };
}

function getSortValue(transaction, sortBy) {
    if (sortBy === "createdAt") {
        return new Date(transaction.createdAt || 0);
    }

    if (sortBy === "date") {
        return new Date(transaction.date || 0);
    }

    if (sortBy === "category") {
        return (transaction.category || "").toLowerCase();
    }

    if (sortBy === "type") {
        return (transaction.type || "").toLowerCase();
    }

    if (sortBy === "isRecurring") {
        return transaction.isRecurring ? 1 : 0;
    }

    return transaction[sortBy];
}