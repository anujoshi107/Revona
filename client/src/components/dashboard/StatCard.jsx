import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent, PiggyBank } from 'lucide-react';

const iconMap = {
  balance: Wallet,
  income: TrendingUp,
  expenses: TrendingDown,
  savings: PiggyBank,
};

export default function StatCard({ title, value, trend, trendType, subtext, id, glowColor }) {
  const Icon = iconMap[id] || Wallet;

  // Set trend badge styling
  let trendStyles = '';
  let trendIcon = null;

  if (trendType === 'positive') {
    trendStyles = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    trendIcon = <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />;
  } else if (trendType === 'negative') {
    trendStyles = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    trendIcon = <TrendingDown className="h-3 w-3 mr-1 flex-shrink-0" />;
  } else {
    trendStyles = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    trendIcon = <Percent className="h-3 w-3 mr-1 flex-shrink-0" />;
  }

  return (
    <div className="relative group rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300 overflow-hidden">

      {/* Premium backdrop radial glow tailored to the card type */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-40 group-hover:scale-125 transition-transform duration-500 -z-10"
        style={{ backgroundColor: glowColor.replace('0.15', '0.25') }}
      ></div>

      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Metric Title */}
        <span className="text-sm font-medium text-slate-400 font-sans">
          {title}
        </span>

        {/* Metric Icon Container */}
        <div
          className="flex items-center justify-center p-2.5 rounded-xl border transition-colors duration-300"
          style={{
            backgroundColor: glowColor,
            borderColor: glowColor.replace('0.15', '0.25')
          }}
        >
          <Icon
            className="h-4 w-4"
            style={{
              color: id === 'balance' ? '#3B82F6' : id === 'income' ? '#10B981' : id === 'expenses' ? '#EF4444' : '#8B5CF6'
            }}
          />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="flex flex-col text-left gap-2">
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none font-sans">
          {value}
        </h3>

        {/* Trend Indicator and Subtext */}
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${trendStyles}`}>
            {trendIcon}
            {trend}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {subtext}
          </span>
        </div>
      </div>
    </div>
  );
}
