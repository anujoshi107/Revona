import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import { Plus, Calendar, ChevronDown, Check } from 'lucide-react';

const DATE_RANGES = [
  { label: 'Last 30 Days', value: '30days' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last 3 Months', value: 'last3Months' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'All Time', value: 'allTime' },
];

function DateRangeDropdown({ selectedRange, setSelectedRange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLabel = DATE_RANGES.find(r => r.value === selectedRange)?.label || 'Last 30 Days';

  function handleSelectRange(value) {
    setSelectedRange(value);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex-grow sm:flex-grow-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2.5 w-full sm:w-48 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer backdrop-blur-sm animate-fadeIn"
      >
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-400 flex-shrink-0" />
          <span>{selectedLabel}</span>
        </span>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full sm:w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1 z-30 animate-fadeIn backdrop-blur-md">
          {DATE_RANGES.map((range) => {
            const isSelected = selectedRange === range.value;

            return (
              <button
                key={range.value}
                type="button"
                onClick={() => handleSelectRange(range.value)}
                className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${isSelected
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
              >
                <span>{range.label}</span>

                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardHero({ onAddTransaction, selectedRange, setSelectedRange }) {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; }
    catch { return {}; }
  })();
  const firstName = user?.name ? user.name.split(' ')[0].toUpperCase() : 'USER';

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1 font-sans">
          Welcome back,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            {firstName}
          </span>
        </h1>

        <p className="text-sm text-slate-400 font-sans">
          This is your financial overview report for the selected period.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto w-full sm:w-auto">
        <DateRangeDropdown selectedRange={selectedRange} setSelectedRange={setSelectedRange} />

        <Button
          onClick={onAddTransaction}
          variant="success"
          iconLeft={<Plus className="h-4 w-4" />}
          className="flex-grow sm:flex-grow-0"
        >
          Add Transaction
        </Button>
      </div>
    </div>
  );
}