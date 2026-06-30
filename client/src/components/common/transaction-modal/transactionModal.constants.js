export const CATEGORIES = [
    "Meals & Groceries",
    "Shopping & Retail",
    "Utilities & Rent",
    "Software & Subscriptions",
    "Freelance Retainer",
    "Salary",
    "Transport",
    "Healthcare",
    "Entertainment",
    "Education",
    "Other",
];

export const PAYMENT_METHODS = [
    { value: "CASH", label: "Cash" },
    { value: "CARD", label: "Card" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "MOBILE_PAYMENT", label: "Mobile Payment" },
    { value: "AUTO_DEBIT", label: "Auto Debit" },
    { value: "UPI", label: "UPI" },
    { value: "OTHER", label: "Other" },
];

export const RECURRING_INTERVALS = [
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
];

export const inputClass =
    "w-full bg-slate-950/60 border border-slate-700/60 focus:border-blue-500/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all font-sans";

export const labelClass =
    "block text-xs font-semibold text-slate-400 mb-1.5 font-sans";

export function getTodayInputDate() {
    return new Date().toISOString().split("T")[0];
}

export function formatInputDate(dateValue) {
    if (!dateValue) return getTodayInputDate();

    try {
        return new Date(dateValue).toISOString().split("T")[0];
    } catch (error) {
        return getTodayInputDate();
    }
}