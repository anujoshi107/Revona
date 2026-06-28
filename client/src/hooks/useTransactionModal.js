import { useState } from "react";

const DEFAULT_TRANSACTION_FORM = {
    title: "",
    amount: "",
    type: "EXPENSE",
    category: "Meals & Groceries",
    paymentMethod: "CASH",
    date: new Date().toISOString().split("T")[0],
    isRecurring: false,
    recurringInterval: "MONTHLY",
};

export default function useTransactionModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [activeTransactionId, setActiveTransactionId] = useState(null);
    const [initialData, setInitialData] = useState(null);

    function openCreateModal() {
        setModalMode("create");
        setActiveTransactionId(null);
        setInitialData(null);
        setIsModalOpen(true);
    }

    function openEditModal(transaction) {
        setModalMode("edit");
        setActiveTransactionId(transaction._id);

        setInitialData({
            _id: transaction._id,
            title: transaction.title || "",
            amount: String(transaction.amount ?? ""),
            type: transaction.type || DEFAULT_TRANSACTION_FORM.type,
            category: transaction.category || DEFAULT_TRANSACTION_FORM.category,
            paymentMethod:
                transaction.paymentMethod || DEFAULT_TRANSACTION_FORM.paymentMethod,
            date: formatInputDate(transaction.date),
            isRecurring: transaction.isRecurring || false,
            recurringInterval:
                transaction.recurringInterval || DEFAULT_TRANSACTION_FORM.recurringInterval,
        });

        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return {
        isModalOpen,
        modalMode,
        activeTransactionId,
        initialData,
        openCreateModal,
        openEditModal,
        closeModal,
        setIsModalOpen,
    };
}

function formatInputDate(date) {
    if (!date) return DEFAULT_TRANSACTION_FORM.date;

    try {
        return new Date(date).toISOString().split("T")[0];
    } catch (error) {
        return "";
    }
}