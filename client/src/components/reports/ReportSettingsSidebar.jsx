import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, ChevronDown, Info } from 'lucide-react';
import api from '../../lib/api';

export default function ReportSettingsSidebar({ isOpen, onClose, user, onSaveSuccess }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.reportSetting) {
        setIsEnabled(storedUser.reportSetting.isEnabled);
      } else {
        setIsEnabled(true);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/report/update-setting', { isEnabled });

      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          storedUser.reportSetting = { ...storedUser.reportSetting, isEnabled };
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
      } catch (err) { }

      onSaveSuccess(isEnabled);
      onClose();
    } catch (err) {
      console.error('Failed to update report settings', err);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9990] animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-[9999] w-full sm:w-[400px] bg-slate-950 border-l border-slate-800/60 shadow-2xl animate-slideInRight flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/60">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Report Settings</h2>
            <p className="text-sm text-slate-400 mt-1">Enable or disable monthly financial report emails</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5">
            <div>
              <h3 className="text-base font-semibold text-white">Monthly Reports</h3>
              <p className="text-sm text-slate-400 mt-0.5">{isEnabled ? 'Reports activated' : 'Reports deactivated'}</p>
            </div>

            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-900/50 border border-slate-800/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-400 opacity-70 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Repeat On</label>
            <div className="relative">
              <input
                type="text"
                disabled
                value="Monthly"
                className="w-full bg-slate-900/50 border border-slate-800/60 rounded-xl py-3 px-4 text-sm text-slate-400 opacity-70 cursor-not-allowed focus:outline-none appearance-none"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              Schedule Summary
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Report will be sent once a month on the 1st day of the next month
            </p>
          </div>

        </div>

        <div className="p-6 border-t border-slate-800/60 bg-slate-950">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
