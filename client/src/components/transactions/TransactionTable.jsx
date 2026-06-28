import React from "react";
import { ArrowUpDown, Loader2 } from "lucide-react";
import TransactionRow from "./TransactionRow";

export default function TransactionTable({
  transactions,
  loading,
  selectedIds,
  activeMenuId,
  setActiveMenuId,
  menuRef,
  onSelect,
  onEdit,
  onDelete,
  onSort,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse relative">
        <thead>
          <tr className="border-b border-slate-800/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none bg-slate-950/10">
            <th className="py-4 pl-6 text-left w-12"></th>

            <SortableHeader label="Date Created" field="createdAt" onSort={onSort} />
            <th className="py-4 px-5 text-left font-semibold font-sans text-slate-400">
              Title
            </th>
            <SortableHeader label="Category" field="category" onSort={onSort} />
            <SortableHeader label="Type" field="type" onSort={onSort} />

            <th className="py-4 px-5 text-left font-semibold font-sans w-[120px] text-slate-400">
              Amount
            </th>

            <SortableHeader label="Transaction Date" field="date" onSort={onSort} />

            <th className="py-4 px-5 text-left font-semibold font-sans w-[150px] text-slate-400">
              Payment Method
            </th>

            <SortableHeader label="Frequently" field="isRecurring" onSort={onSort} />

            <th className="py-4 text-center font-semibold font-sans w-16"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800/40">
          {loading ? (
            <TableMessage
              icon={<Loader2 className="h-7 w-7 animate-spin text-blue-400" />}
              title="Fetching transactions..."
            />
          ) : transactions.length === 0 ? (
            <TableMessage
              title="No Transactions Found"
              description="Add a new transaction or adjust your filters."
            />
          ) : (
            transactions.map((transaction) => (
              <TransactionRow
                key={transaction._id}
                transaction={transaction}
                isSelected={selectedIds.includes(transaction._id)}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                menuRef={menuRef}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({ label, field, onSort }) {
  return (
    <th
      onClick={() => onSort(field)}
      className="py-4 px-5 text-left font-semibold font-sans cursor-pointer hover:text-slate-300 transition-colors text-slate-400"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  );
}

function TableMessage({ icon, title, description }) {
  return (
    <tr>
      <td colSpan={10} className="py-20 text-center">
        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
          {icon}
          <h3 className="text-base font-semibold text-slate-300 font-sans">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-500 font-sans font-medium">
              {description}
            </p>
          )}
        </div>
      </td>
    </tr>
  );
}