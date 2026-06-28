import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";

export default function useTransactions({
    page,
    pageSize,
    debouncedKeyword,
    typeFilter,
    recurringFilter,
    setPage,
    triggerToast,
}) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedIds, setSelectedIds] = useState([]);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);

        try {
            const params = {
                pageNumber: page,
                pageSize,
                keyword: debouncedKeyword || undefined,
                type: typeFilter || undefined,
                recurringStatus: recurringFilter || undefined,
            };

            const res = await api.get("/transaction/all", { params });

            setTransactions(res.data.transactions || []);
            setTotalCount(res.data.pagination?.totalCount || 0);
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch (err) {
            console.error(err);
            triggerToast(err.message || "Failed to fetch transactions", "error");
        } finally {
            setLoading(false);
        }
    }, [
        page,
        pageSize,
        debouncedKeyword,
        typeFilter,
        recurringFilter,
        triggerToast,
    ]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    function handleSelectOne(id) {
        setSelectedIds((prevIds) => {
            if (prevIds.includes(id)) {
                return prevIds.filter((item) => item !== id);
            }

            return [...prevIds, id];
        });
    }

    function clearSelection() {
        setSelectedIds([]);
    }

    async function handleDeleteOne(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/transaction/delete/${id}`);

            triggerToast("Transaction deleted successfully");

            setSelectedIds((prevIds) => prevIds.filter((item) => item !== id));

            if (transactions.length === 1 && page > 1) {
                setPage((prevPage) => prevPage - 1);
            } else {
                fetchTransactions();
            }
        } catch (err) {
            triggerToast(err.message || "Deletion failed", "error");
        }
    }

    async function handleBulkDelete() {
        if (selectedIds.length === 0) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete all ${selectedIds.length} selected transactions?`
        );

        if (!confirmDelete) return;

        try {
            await api.delete("/transaction/bulk-delete", {
                data: { transactionIds: selectedIds },
            });

            triggerToast(`${selectedIds.length} transactions deleted successfully`);

            setSelectedIds([]);
            setPage(1);
            fetchTransactions();
        } catch (err) {
            triggerToast(err.message || "Bulk deletion failed", "error");
        }
    }

    return {
        transactions,
        loading,
        totalCount,
        totalPages,

        selectedIds,
        setSelectedIds,
        handleSelectOne,
        clearSelection,

        fetchTransactions,
        handleDeleteOne,
        handleBulkDelete,
    };
}