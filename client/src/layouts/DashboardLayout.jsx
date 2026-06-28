import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-height-screen bg-revona-glow text-slate-100 flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Decorative radial glows for premium fintech feel matching the FinanceFlow theme */}
      <div className="absolute top-[5%] right-[-15%] w-[650px] h-[650px] bg-blue-600/12 rounded-full blur-[130px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[15%] left-[-10%] w-[450px] h-[450px] bg-emerald-500/4 rounded-full blur-[110px] -z-10 pointer-events-none"></div>
      
      {/* Top Header */}
      <DashboardHeader />
      
      {/* Main Content Area */}
      <main className="flex-grow z-10 flex flex-col">
        {children}
      </main>
      
      {/* Subtle Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-800/40 text-center text-xs text-slate-500 z-10">
        <div>&copy; 2026 Revona Technologies Inc. All rights reserved.</div>
      </footer>
    </div>
  );
}
