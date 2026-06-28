import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Loader2, Calendar, Sparkles, ChevronDown, Repeat
} from 'lucide-react';
import api from '../../lib/api';

const CATEGORIES = [
  'Meals & Groceries',
  'Shopping & Retail',
  'Utilities & Rent',
  'Software & Subscriptions',
  'Freelance Retainer',
  'Salary',
  'Transport',
  'Healthcare',
  'Entertainment',
  'Education',
  'Other',
];

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'MOBILE_PAYMENT', label: 'Mobile Payment' },
  { value: 'AUTO_DEBIT', label: 'Auto Debit' },
  { value: 'UPI', label: 'UPI' },
  { value: 'OTHER', label: 'Other' },
];

/**
 * AddTransactionModal - Shared modal used on both Dashboard and Transactions pages.
 *
 * Props:
 *   isOpen          - boolean
 *   onClose         - () => void
 *   onSuccess       - (transaction) => void
 *   mode            - 'create' | 'edit'
 *   initialData     - prefill object for edit mode (optional)
 *   showReceiptScan - boolean (default true)
 */
export default function AddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
  mode = 'create',
  initialData = null,
  showReceiptScan = true,
}) {
  const today = new Date().toISOString().split('T')[0];

  // ── All hooks must be called unconditionally ──────────────────────────────
  const [type, setType]                       = useState(initialData?.type || 'INCOME');
  const [title, setTitle]                     = useState(initialData?.title || '');
  const [amount, setAmount]                   = useState(
    initialData?.amount != null ? String(initialData.amount) : ''
  );
  const [category, setCategory]               = useState(initialData?.category || 'Meals & Groceries');
  const [txDate, setTxDate]                   = useState(
    initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : today
  );
  const [paymentMethod, setPaymentMethod]     = useState(initialData?.paymentMethod || 'CASH');
  const [isRecurring, setIsRecurring]         = useState(initialData?.isRecurring || false);
  const [recurringInterval, setRecurringInterval] = useState(
    initialData?.recurringInterval || 'MONTHLY'
  );
  const [saving, setSaving]     = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [error, setError]       = useState('');

  const fileInputRef = useRef(null);

  // ── Handlers (all BEFORE the conditional return) ──────────────────────────
  const handleScanFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanError('');
    setScanning(true);
    const formData = new FormData();
    formData.append('receipt', file);
    try {
      const res = await api.post('/transaction/scan-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const d = res.data.data;
      if (d.error) {
        setScanError(d.error);
      } else {
        if (d.title)         setTitle(d.title);
        if (d.amount)        setAmount(String(d.amount));
        if (d.type)          setType(d.type.toUpperCase());
        if (d.category)      setCategory(d.category);
        if (d.paymentMethod) setPaymentMethod(d.paymentMethod.toUpperCase());
        if (d.date) {
          try { setTxDate(new Date(d.date).toISOString().split('T')[0]); } catch (_) {}
        }
      }
    } catch (err) {
      setScanError(err.message || 'Scan failed');
    } finally {
      setScanning(false);
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      setError('Title and Amount are required.');
      return;
    }
    setError('');
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
      if (mode === 'edit' && initialData?._id) {
        res = await api.put(`/transaction/update/${initialData._id}`, body);
      } else {
        res = await api.post('/transaction/create', body);
      }
      onSuccess && onSuccess(res.data.transaction || body);
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = () => {
    if (!saving && !scanning) onClose && onClose();
  };

  const inputCls =
    'w-full bg-slate-950/60 border border-slate-700/60 focus:border-blue-500/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all font-sans';
  const labelCls = 'block text-xs font-semibold text-slate-400 mb-1.5 font-sans';

  // ── Conditional render AFTER all hooks + handlers ─────────────────────────
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/60 z-10 animate-scaleUp overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-800/70">
          <div>
            <h2 className="text-lg font-bold text-white font-sans">
              {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              {mode === 'edit'
                ? 'Update the details of this transaction'
                : 'Add a new transaction to track your finances'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving || scanning}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-xl transition-all cursor-pointer ml-4 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[75vh] px-6 py-5 space-y-5">

          {/* AI Scan Receipt */}
          {showReceiptScan && mode === 'create' && (
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
                    className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      scanning
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-500 text-white cursor-pointer'
                    }`}
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      'Choose File'
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    disabled={scanning}
                    onChange={handleScanFile}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-500 font-sans">No file chosen</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 font-sans">JPG, PNG up to 2MB</p>
              {scanError && (
                <p className="text-xs text-rose-400 mt-1 font-sans">{scanError}</p>
              )}
            </div>
          )}

          {/* Transaction Type */}
          <div>
            <label className={labelCls}>Transaction Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('INCOME')}
                disabled={saving}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  type === 'INCOME'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-950/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    type === 'INCOME' ? 'border-emerald-500' : 'border-slate-600'
                  }`}
                >
                  {type === 'INCOME' && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 block" />
                  )}
                </span>
                Income
              </button>

              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                disabled={saving}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  type === 'EXPENSE'
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                    : 'bg-slate-950/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    type === 'EXPENSE' ? 'border-rose-500' : 'border-slate-600'
                  }`}
                >
                  {type === 'EXPENSE' && (
                    <span className="h-2 w-2 rounded-full bg-rose-500 block" />
                  )}
                </span>
                Expense
              </button>
            </div>
          </div>

          <form id="add-tx-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className={labelCls}>Title</label>
              <input
                type="text"
                required
                disabled={saving}
                placeholder="Transaction title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${inputCls} px-4 py-3`}
              />
            </div>

            {/* Amount */}
            <div>
              <label className={labelCls}>Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold pointer-events-none">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  disabled={saving}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`${inputCls} pl-8 pr-4 py-3`}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>Category</label>
              <div className="relative">
                <select
                  value={category}
                  disabled={saving}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`${inputCls} pl-4 pr-9 py-3 appearance-none cursor-pointer text-slate-300`}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className={labelCls}>Date</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  disabled={saving}
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className={`${inputCls} pl-4 pr-11 py-3`}
                  style={{ colorScheme: 'dark' }}
                />
                <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className={labelCls}>Payment Method</label>
              <div className="relative">
                <select
                  value={paymentMethod}
                  disabled={saving}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={`${inputCls} pl-4 pr-9 py-3 appearance-none cursor-pointer text-slate-300`}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-slate-900">{m.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Recurring Transaction toggle */}
            <div className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <p className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                  <Repeat className="h-3.5 w-3.5 text-slate-400" />
                  Recurring Transaction
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                  Set recurring to repeat this transaction
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => setIsRecurring((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                  isRecurring ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block rounded-full bg-white shadow-md transition-transform ${
                    isRecurring ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{ width: '18px', height: '18px' }}
                />
              </button>
            </div>

            {/* Recurring interval */}
            {isRecurring && (
              <div>
                <label className={labelCls}>Repeat Interval</label>
                <div className="relative">
                  <select
                    value={recurringInterval}
                    disabled={saving}
                    onChange={(e) => setRecurringInterval(e.target.value)}
                    className={`${inputCls} pl-4 pr-9 py-3 appearance-none cursor-pointer text-slate-300`}
                  >
                    <option value="DAILY" className="bg-slate-900">Daily</option>
                    <option value="WEEKLY" className="bg-slate-900">Weekly</option>
                    <option value="MONTHLY" className="bg-slate-900">Monthly</option>
                    <option value="YEARLY" className="bg-slate-900">Yearly</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <p className="text-xs text-rose-400 font-sans">{error}</p>
            )}

          </form>
        </div>

        {/* Footer — Save button */}
        <div className="px-6 pb-6 pt-4 border-t border-slate-800/70">
          <button
            type="submit"
            form="add-tx-form"
            disabled={saving || scanning}
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
