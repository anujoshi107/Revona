import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHero from '../components/dashboard/DashboardHero';
import StatCard from '../components/dashboard/StatCard';
import DashboardPlaceholderCard from '../components/dashboard/DashboardPlaceholderCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import AddTransactionModal from '../components/common/AddTransactionModal';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function Dashboard() {
  const [preset, setPreset] = useState('30days');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Dynamic metrics states
  const [statsData, setStatsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [extraChartData, setExtraChartData] = useState({});
  const [breakdownData, setBreakdownData] = useState({ totalSpent: 0, breakdown: [] });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [summaryRes, chartRes, breakdownRes, txRes] = await Promise.all([
          api.get(`/analytics/summary?preset=${preset}`),
          api.get(`/analytics/chart?preset=${preset}`),
          api.get(`/analytics/expense-breakdown?preset=${preset}`),
          api.get(`/transaction/all?pageSize=7&preset=${preset}`)
        ]);

        const summary = summaryRes.data.data || {};
        
        const newStats = [
          {
            id: 'balance',
            title: 'Available Balance',
            value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.availableBalance || 0),
            trend: `${summary.percentageChange?.balance >= 0 ? '+' : ''}${summary.percentageChange?.balance || 0}%`,
            trendType: summary.percentageChange?.balance >= 0 ? 'positive' : 'negative',
            subtext: 'vs Previous Period',
            glowColor: 'rgba(0, 82, 255, 0.15)',
          },
          {
            id: 'income',
            title: 'Total Income',
            value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalIncome || 0),
            trend: `${summary.percentageChange?.income >= 0 ? '+' : ''}${summary.percentageChange?.income || 0}%`,
            trendType: summary.percentageChange?.income >= 0 ? 'positive' : 'negative',
            subtext: 'vs Previous Period',
            glowColor: 'rgba(16, 185, 129, 0.15)',
          },
          {
            id: 'expenses',
            title: 'Total Expenses',
            value: `-${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalExpenses || 0)}`,
            trend: `${summary.percentageChange?.expenses >= 0 ? '+' : ''}${summary.percentageChange?.expenses || 0}%`,
            trendType: summary.percentageChange?.expenses >= 0 ? 'negative' : 'positive',
            subtext: 'vs Previous Period',
            glowColor: 'rgba(239, 68, 68, 0.15)',
          },
          {
            id: 'savings',
            title: 'Savings Rate',
            value: `${summary.savingRate?.percentage || 0}%`,
            trend: (summary.savingRate?.percentage || 0) > 20 ? 'High Savings' : 'High Spend',
            trendType: (summary.savingRate?.percentage || 0) > 20 ? 'positive' : 'neutral',
            subtext: `${summary.savingRate?.expenseRatio || 0}% spent of income`,
            glowColor: 'rgba(139, 92, 246, 0.15)',
          }
        ];

        setStatsData(newStats);
        setChartData(chartRes.data.data?.chartData || []);
        setExtraChartData({
          totalIncomeCount: chartRes.data.data?.totalIncomeCount || 0,
          totalExpenseCount: chartRes.data.data?.totalExpenseCount || 0,
          totalIncomeAmount: chartRes.data.data?.totalIncomeAmount || 0,
          totalExpenseAmount: chartRes.data.data?.totalExpenseAmount || 0,
        });
        setBreakdownData(breakdownRes.data.data || { totalSpent: 0, breakdown: [] });
        const recentTxs = (txRes.data.transactions || []).slice();
        recentTxs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentTransactions(recentTxs);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [preset, refreshTrigger]);

  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };

  const handleTransactionSuccess = (tx) => {
    setToastType('success');
    setToastMessage(`Transaction "${tx.title || ''}" saved!`);
    setShowToast(true);
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 flex flex-col gap-8">
        
        {/* Welcome Hero Component */}
        <DashboardHero 
          onAddTransaction={handleAddTransaction} 
          selectedRange={preset} 
          setSelectedRange={setPreset} 
        />
        
        {/* 4 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-36 rounded-2xl border border-slate-800/60 bg-slate-900/45 p-6 animate-pulse flex flex-col justify-between">
                <div className="h-4 w-1/3 bg-slate-850 rounded"></div>
                <div className="h-8 w-2/3 bg-slate-850 rounded"></div>
                <div className="h-4 w-1/2 bg-slate-850 rounded"></div>
              </div>
            ))
          ) : (
            statsData.map((card) => (
              <StatCard
                key={card.id}
                id={card.id}
                title={card.title}
                value={card.value}
                trend={card.trend}
                trendType={card.trendType}
                subtext={card.subtext}
                glowColor={card.glowColor}
              />
            ))
          )}
        </div>
        
        {/* Chart + Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
          <div className="lg:col-span-2">
            <DashboardPlaceholderCard 
              type="overview" 
              data={chartData} 
              loading={loading} 
              extraData={extraChartData} 
            />
          </div>
          <div className="lg:col-span-1">
            <DashboardPlaceholderCard 
              type="breakdown" 
              data={breakdownData} 
              loading={loading} 
            />
          </div>
        </div>

        {/* Recent Transactions List Section */}
        <RecentTransactions 
          transactions={recentTransactions} 
          loading={loading} 
        />

      </div>

      {/* Shared Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTransactionSuccess}
        mode="create"
        showReceiptScan={true}
      />



      {/* SUCCESS/ERROR TOAST */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 z-50 bg-slate-900 border ${
          toastType === 'success' ? 'border-emerald-500/30' : 'border-rose-500/30'
        } shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-slideIn max-w-md text-left`}>
          <div className={`p-1 ${
            toastType === 'success' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
          } rounded-lg flex-shrink-0`}>
            <CheckCircle2 className={`h-5 w-5 ${
              toastType === 'success' ? 'text-emerald-400' : 'text-rose-400'
            }`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {toastType === 'success' ? 'Transaction Logged' : 'Error Occurred'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="text-slate-500 hover:text-white p-1 rounded-lg ml-auto cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
