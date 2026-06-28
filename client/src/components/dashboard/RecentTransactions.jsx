import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Laptop, 
  Briefcase, 
  Utensils, 
  ShoppingBag, 
  Car, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2
} from 'lucide-react';

const categoryIconMap = {
  'Software': Laptop,
  'Software & Subscriptions': Laptop,
  'Freelance': Briefcase,
  'Freelance Retainer': Briefcase,
  'Meals & Groceries': Utensils,
  'Salary': DollarSign,
  'Transport': Car,
  'default': ShoppingBag
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

export default function RecentTransactions({ transactions = [], loading = false }) {
  return (
    <div className="relative group rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300 text-left">
      {/* Subtle radial glow in card background */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white font-sans">Recent Transactions</h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Your latest financial movements</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 text-left font-semibold font-sans">Description</th>
              <th className="py-3 text-left font-semibold font-sans">Category</th>
              <th className="py-3 text-left font-semibold font-sans">Date</th>
              <th className="py-3 text-left font-semibold font-sans">Status</th>
              <th className="py-3 text-right font-semibold font-sans">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {loading ? (
              // Loading spinner row
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                    <span className="text-xs">Fetching transactions...</span>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              // Empty state row
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500">
                    <span className="text-sm font-semibold text-slate-400">No Transactions Found</span>
                    <span className="text-xs">Add a new transaction or scan a receipt to get started.</span>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const IconComponent = categoryIconMap[tx.category] || categoryIconMap['default'];
                const isIncome = tx.type === 'INCOME';
                
                // Status Mapping
                let statusColors = 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                if (tx.status === 'COMPLETED') {
                  statusColors = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                } else if (tx.status === 'PENDING') {
                  statusColors = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                } else if (tx.status === 'FAILED') {
                  statusColors = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                }

                const displayStatus = tx.status ? tx.status.charAt(0) + tx.status.slice(1).toLowerCase() : 'Completed';

                return (
                  <tr 
                    key={tx._id} 
                    className="hover:bg-slate-800/20 transition-colors duration-150 group"
                  >
                    {/* Description / Merchant */}
                    <td className="py-4 text-left">
                      <div className="flex items-center gap-3">
                        {/* Icon Circle */}
                        <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors ${
                          isIncome 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20' 
                            : 'bg-slate-950/40 border-slate-800/60 text-slate-400 group-hover:bg-slate-800/40'
                        }`}>
                          <IconComponent className="h-4.5 w-4.5" />
                        </div>
                        <span className="font-semibold text-slate-200 text-sm font-sans block truncate max-w-[180px] sm:max-w-[240px]">
                          {tx.title}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 text-left text-sm text-slate-400 font-medium font-sans">
                      {tx.category}
                    </td>

                    {/* Date */}
                    <td className="py-4 text-left text-sm text-slate-500 font-sans">
                      {formatDate(tx.date)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 text-left">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusColors}`}>
                        {displayStatus}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className={`py-4 text-right text-sm font-bold font-sans ${
                      isIncome ? 'text-emerald-400' : 'text-slate-100'
                    }`}>
                      <div className="flex items-center justify-end gap-1">
                        <span>{isIncome ? '+' : '-'}{formatCurrency(tx.amount)}</span>
                        {isIncome ? (
                          <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer View All Link */}
      <div className="mt-4 pt-4 border-t border-slate-800/40 text-center">
        <Link to="/transactions" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-sans inline-block">
          View All Transactions
        </Link>
      </div>
    </div>
  );
}
