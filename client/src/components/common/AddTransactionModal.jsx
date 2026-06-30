import React from "react";
import { createPortal } from "react-dom";
import { Calendar } from "lucide-react";

import useAddTransactionForm from "../../hooks/useAddTransactionForm";

import ModalHeader from "./transaction-modal/ModalHeader";
import ReceiptScanSection from "./transaction-modal/ReceiptScanSection";
import TransactionTypeSelector from "./transaction-modal/TransactionTypeSelector";
import FormInput from "./transaction-modal/FormInput";
import FormSelect from "./transaction-modal/FormSelect";
import RecurringSection from "./transaction-modal/RecurringSection";
import ModalFooter from "./transaction-modal/ModalFooter";

import {
  CATEGORIES,
  PAYMENT_METHODS,
} from "./transaction-modal/transactionModal.constants";

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  initialData = null,
  showReceiptScan = true,
}) {
  const {
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
  } = useAddTransactionForm({
    isOpen,
    mode,
    initialData,
    onSuccess,
    onClose,
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/60 z-10 animate-scaleUp overflow-hidden">
        <ModalHeader
          mode={mode}
          saving={saving}
          scanning={scanning}
          onClose={onClose}
        />

        <div className="overflow-y-auto max-h-[75vh] px-6 py-5 space-y-5">
          <ReceiptScanSection
            showReceiptScan={showReceiptScan}
            mode={mode}
            scanning={scanning}
            scanError={scanError}
            fileInputRef={fileInputRef}
            onScanFile={handleScanFile}
          />

          <TransactionTypeSelector
            type={type}
            setType={setType}
            saving={saving}
          />

          <form
            id="add-tx-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <FormInput
              label="Title"
              type="text"
              required
              disabled={saving}
              placeholder="Transaction title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              inputClassName="px-4 py-3"
            />

            <FormInput
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              required
              disabled={saving}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftText="$"
              inputClassName="pl-8 pr-4 py-3"
            />

            <FormSelect
              label="Category"
              value={category}
              disabled={saving}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES}
            />

            <FormInput
              label="Date"
              type="date"
              required
              disabled={saving}
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              rightIcon={<Calendar className="h-4 w-4" />}
              inputClassName="pl-4 pr-11 py-3"
              style={{ colorScheme: "dark" }}
            />

            <FormSelect
              label="Payment Method"
              value={paymentMethod}
              disabled={saving}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={PAYMENT_METHODS}
            />

            <RecurringSection
              saving={saving}
              isRecurring={isRecurring}
              setIsRecurring={setIsRecurring}
              recurringInterval={recurringInterval}
              setRecurringInterval={setRecurringInterval}
            />

            {error && (
              <p className="text-xs text-rose-400 font-sans">
                {error}
              </p>
            )}
          </form>
        </div>

        <ModalFooter saving={saving} scanning={scanning} />
      </div>
    </div>,
    document.body
  );
}