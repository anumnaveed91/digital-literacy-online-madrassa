import React, { useState } from 'react';
import { WifiOff, RefreshCw, Database, Check } from 'lucide-react';
import { Language } from '../types';

interface OfflineSyncManagerProps {
  points: number;
  completedCount: number;
  unlockedBadgeCount: number;
  lang: Language;
}

export default function OfflineSyncManager({ points, completedCount, unlockedBadgeCount, lang }: OfflineSyncManagerProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const handleSyncSimulate = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const time = new Date().toLocaleTimeString();
      setLastSynced(time);
    }, 1800);
  };

  const text = {
    offlineStatus: lang === 'ur' ? 'آف لائن تعلیمی موڈ چالو ہے' : 'Active Offline Learning',
    noInternetRequired: lang === 'ur' ? 'اس سبق کو پڑھنے کے لیے انٹرنیٹ کی ضرورت نہیں!' : 'No internet required to learn!',
    storageUsed: lang === 'ur' ? 'محفوظ کردہ مقامی میموری:' : 'Local Storage Savings:',
    storedTitle: lang === 'ur' ? 'آپ کی ڈیوائس میں محفوظ' : 'Stored in this Device',
    syncButton: lang === 'ur' ? 'استاد کے بورڈ پر ڈیٹا بھیجیں' : 'Sync to Teacher Hub',
    syncingText: lang === 'ur' ? 'رابطہ قائم کیا جا رہا ہے...' : 'Establishing Connection...',
    syncedSuccess: lang === 'ur' ? 'سبق ریکارڈ کامیابی سے سینک ہو گیا!' : 'Successfully Synced Database!',
    lastSyncLabel: lang === 'ur' ? 'آخری بار سینک ہوا:' : 'Last Synced:',
    notSyncedYet: lang === 'ur' ? 'ابھی سینک نہیں ہوا (قریبی سکول لنک کریں)' : 'Not Synced Yet (Awaiting connection)',
    exportTitle: lang === 'ur' ? 'پروفائل بیک اپ بکس ڈاؤن لوڈ کریں' : 'Download Profile Card',
    pointsCount: lang === 'ur' ? 'کل پوائنٹس حاصل کردہ' : 'Total points earned'
  };

  return (
    <div className="vibrant-card bg-amber-50 rounded-[24px] p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-16 h-16 bg-amber-200/40 rounded-full" />
      <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-12 h-12 bg-amber-200/40 rounded-full" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400 border-2 border-slate-900 rounded-2xl text-slate-950 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)]">
            <WifiOff className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg text-amber-950 tracking-tight leading-none">{text.offlineStatus}</span>
              <span className="bg-emerald-100 text-emerald-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-slate-900">
                <Check className="w-3 h-3 stroke-[3]" /> SECURE
              </span>
            </div>
            <p className="text-xs text-amber-900 font-bold mt-1">{text.noInternetRequired}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleSyncSimulate}
            disabled={isSyncing}
            id="sync-btn"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-3.5 rounded-2xl shadow-sm cursor-pointer disabled:opacity-75 vibrant-button text-sm"
          >
            <RefreshCw className={`w-4 h-4 stroke-[2.5] ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? text.syncingText : text.syncButton}
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t-2 border-slate-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 relative z-10 font-sans">
        <div className="flex items-center gap-2 font-bold">
          <Database className="w-4 h-4 text-amber-700 stroke-[2.2]" />
          <span>
            <strong>{text.storageUsed}</strong> {text.storedTitle} ({completedCount} lessons, {unlockedBadgeCount} badges, {points} pts)
          </span>
        </div>

        <div className="font-mono bg-amber-200 border border-slate-900/20 px-2 py-1 rounded-lg font-black">
          {text.lastSyncLabel}{' '}
          <span className="text-amber-950">
            {lastSynced ? lastSynced : text.notSyncedYet}
          </span>
        </div>
      </div>
    </div>
  );
}
