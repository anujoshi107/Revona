import React from "react";
import {
  Clock,
  Edit2,
  MoreHorizontal,
  Repeat,
  Trash2,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
} from "../../utils/formatters";

export default function TransactionRow({
  transaction,
  isSelected,
  activeMenuId,
  setActiveMenuId,
  menuRef,
  onSelect,
  onEdit,
  onDelete,
}) {
  const isIncome = transaction.type === "INCOME";
  const isMenuOpen = activeMenuId === transaction._id;

  const typeBadgeClass = isIncome
    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
    : "text-rose-400 bg-rose-500/10 border-rose-500/20";

  const amountClass = isIncome ? "text-emerald-400" : "text-rose-400";

  return (
    <tr
      className={`hover:bg-slate-850/20 transition-colors duration-150 relative ${isSelected ? "bg-blue-600/5" : ""
        } border-b border-slate-800/50`}
    >
      <td className="py-4 pl-6 text-left">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(transaction._id)}
          className="rounded border-slate-800 text-blue-600 focus:ring-blue-500/40 bg-slate-950/80 cursor-pointer h-4 w-4"
        />
      </td>

      <td className="py-4 px-5 text-left text-sm text-slate-300 font-sans font-medium">
        {formatDate(transaction.createdAt || transaction.date)}
      </td>

      <td className="py-4 px-5 text-left">
        <span className="font-semibold text-slate-100 text-sm font-sans block truncate max-w-[220px]">
          {transaction.title}
        </span>
      </td>

      <td className="py-4 px-5 text-left text-sm text-slate-300 font-medium font-sans">
        {transaction.category}
      </td>

      <td className="py-4 px-5 text-left">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeBadgeClass}`}
        >
          {transaction.type}
        </span>
      </td>

      <td className={`py-4 px-5 text-left text-sm font-bold font-sans ${amountClass}`}>
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </td>

      <td className="py-4 px-5 text-left text-sm text-slate-300 font-sans">
        {formatDate(transaction.date)}
      </td>

      <td className="py-4 px-5 text-left text-sm text-slate-300 font-sans">
        {formatPaymentMethod(transaction.paymentMethod)}
      </td>

      <td className="py-4 px-5 text-left">
        {transaction.isRecurring ? (
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5 font-sans">
              <Repeat className="h-3.5 w-3.5 text-blue-400" />
              {transaction.recurringInterval?.charAt(0) +
                transaction.recurringInterval?.slice(1).toLowerCase()}
            </span>

            {transaction.nextRecurringDate && (
              <span className="text-[10px] text-slate-500 mt-0.5 font-sans">
                Next: {formatDate(transaction.nextRecurringDate)}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-sans">
            <Clock className="h-3.5 w-3.5 text-slate-600" />
            One-time
          </span>
        )}
      </td>

      <td className="py-4 text-center pr-6 relative">
        <button
          onClick={() =>
            setActiveMenuId(isMenuOpen ? null : transaction._id)
          }
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-6 mt-1 w-28 rounded-xl border border-slate-800/80 bg-slate-950/95 shadow-2xl backdrop-blur-xl z-50 p-1 flex flex-col animate-fadeIn"
          >
            <button
              onClick={() => {
                onEdit(transaction);
                setActiveMenuId(null);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </button>

            <button
              onClick={() => {
                onDelete(transaction._id);
                setActiveMenuId(null);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}