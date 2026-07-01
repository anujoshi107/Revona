import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Calendar, Loader2 } from 'lucide-react';
import api from '../lib/api';
import ReportSettingsSidebar from '../components/reports/ReportSettingsSidebar';
import Pagination from '../components/transactions/Pagination';
import Toast from '../components/common/Toast';
import { format } from 'date-fns';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) setUser(storedUser);
    } catch (err) { }
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/report/all?pageNumber=${page}&pageSize=${pageSize}`);
      setReports(res.data.reports || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalCount(res.data.pagination?.totalCount || 0);
    } catch (err) {
      console.error('Failed to fetch reports', err);
      triggerToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, pageSize]);

  // const handleResend = async (reportId) => {
  //   // In a full implementation, you would hit an endpoint like /report/resend/:id
  //   // But since the backend doesn't have it explicitly mapped in report.route.js
  //   // We'll simulate a success toast for the UI functionality required by the prompt
  //   triggerToast('Report resent successfully to your email', 'success');
  // };

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 flex flex-col gap-8 text-left animate-fadeIn">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-sans">Report History</h1>
            <p className="text-sm text-slate-400 mt-1 font-medium font-sans">View and manage your financial reports</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center w-full sm:w-auto gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            <Calendar className="h-4 w-4" />
            Report Settings
          </button>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/50 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse relative whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none bg-slate-950/10">
                  <th className="py-4 px-6 text-left">Report Period</th>
                  <th className="py-4 px-6 text-left">Sent Date</th>
                  <th className="py-4 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
                        <h3 className="text-base font-semibold text-slate-300 font-sans">Fetching reports...</h3>
                      </div>
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                        <h3 className="text-base font-semibold text-slate-300 font-sans">No Reports Found</h3>
                        <p className="text-sm text-slate-500 font-sans font-medium">Your generated reports will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report._id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="py-4 px-6 text-sm text-slate-300 font-medium">
                        {report.period}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">
                        {format(new Date(report.sentDate), 'M/d/yyyy')}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${report.status === 'SENT'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : report.status === 'FAILED'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-slate-500/10 text-slate-400'
                          }`}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && reports.length > 0 && (
            <div className="border-t border-slate-800/70 p-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={setPage}
                itemName="reports"
              />
            </div>
          )}
        </div>
      </div>

      <ReportSettingsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onSaveSuccess={(enabled) => {
          triggerToast(`Monthly reports have been ${enabled ? 'enabled' : 'disabled'}`, 'success');
        }}
      />

      <Toast
        show={showToast}
        type={toastType}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </DashboardLayout>
  );
}
