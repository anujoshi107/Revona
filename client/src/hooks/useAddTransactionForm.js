import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { formatInputDate, getTodayInputDate } from "../components/common/transaction-modal/transactionModal.constants";

function getInitialFormData(initialData) {
    return {
        type: initialData?.type || "INCOME",
        title: initialData?.title || "",
        amount: initialData?.amount != null ? String(initialData.amount) : "",
        category: initialData?.category || "Meals & Groceries",
        txDate: initialData?.date
            ? formatInputDate(initialData.date)
            : getTodayInputDate(),
        paymentMethod: initialData?.paymentMethod || "CASH",
        isRecurring: initialData?.isRecurring || false,
        recurringInterval: initialData?.recurringInterval || "MONTHLY",
    };
}

export default function useAddTransactionForm({
    isOpen,
    mode,
    initialData,
    onSuccess,
    onClose,
}) {
    const fileInputRef = useRef(null);

    const [type, setType] = useState("INCOME");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Meals & Groceries");
    const [txDate, setTxDate] = useState(getTodayInputDate());
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringInterval, setRecurringInterval] = useState("MONTHLY");

    const [saving, setSaving] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        const formData = getInitialFormData(initialData);

        setType(formData.type);
        setTitle(formData.title);
        setAmount(formData.amount);
        setCategory(formData.category);
        setTxDate(formData.txDate);
        setPaymentMethod(formData.paymentMethod);
        setIsRecurring(formData.isRecurring);
        setRecurringInterval(formData.recurringInterval);

        setError("");
        setScanError("");
    }, [isOpen, initialData]);

    async function handleScanFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        setScanError("");
        setScanning(true);

        const formData = new FormData();
        formData.append("receipt", file);

        try {
            const res = await api.post("/transaction/scan-receipt", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = res.data.data;

            if (data.error) {
                setScanError(data.error);
            } else {
                if (data.title) setTitle(data.title);
                if (data.amount) setAmount(String(data.amount));
                if (data.type) setType(data.type.toUpperCase());
                if (data.category) setCategory(data.category);
                if (data.paymentMethod) {
                    setPaymentMethod(data.paymentMethod.toUpperCase());
                }

                if (data.date) {
                    try {
                        setTxDate(new Date(data.date).toISOString().split("T")[0]);
                    } catch (error) {
                        // Keep current date if scanned date is invalid
                    }
                }
            }
        } catch (err) {
            setScanError(err.message || "Scan failed");
        } finally {
            setScanning(false);
            e.target.value = null;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim() || !amount) {
            setError("Title and Amount are required.");
            return;
        }

        setError("");
        setSaving(true);

        const body = {
            title: title.trim(),
            amount: Number(amount),
            type,
            category,
            paymentMethod,
            date: new Date(txDate).toISOString(),
            isRecurring,
            recurringInterval: isRecurring ? recurringInterval : null,
        };

        try {
            let res;

            if (mode === "edit" && initialData?._id) {
                res = await api.put(`/transaction/update/${initialData._id}`, body);
            } else {
                res = await api.post("/transaction/create", body);
            }

            if (onSuccess) {
                onSuccess(res.data.transaction || body);
            }

            if (onClose) {
                onClose();
            }
        } catch (err) {
            setError(err.message || "Failed to save transaction");
        } finally {
            setSaving(false);
        }
    }

    function handleBackdropClick() {
        if (!saving && !scanning && onClose) {
            onClose();
        }
    }

    return {
        type,
        setType,
        title,
        setTitle,
        amount,
        setAmount,
        category,
        setCategory,
        txDate,
        setTxDate,
        paymentMethod,
        setPaymentMethod,
        isRecurring,
        setIsRecurring,
        recurringInterval,
        setRecurringInterval,

        saving,
        scanning,
        scanError,
        error,

        fileInputRef,
        handleScanFile,
        handleSubmit,
        handleBackdropClick,
    };
}