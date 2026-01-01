
import React, { useState } from 'react';
import { HistoryItem, AppState, User } from '../types';
import { t } from '../i18n';

interface DashboardProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onNavigate: (state: AppState) => void;
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onSelectHistory, onNavigate, user }) => {
  const [showAllHistory, setShowAllHistory] = useState(false);
  const lang = user?.language || 'en';
  
  const stats = {
    totalScans: history.length,
    healthyCount: history.filter(h => h.result.healthStatus === 'Healthy').length,
    diseaseCount: history.filter(h => h.result.healthStatus === 'Diseased').length,
  };

  const displayedScans = showAllHistory ? history : history.slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6 space-y-12 animate-in">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border-2 border-emerald-600/10 p-10 rounded-[2.5rem] shadow-sm">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t('diagnostics', lang)}</p>
          <p className="text-6xl font-black text-black tracking-tighter">{stats.totalScans}</p>
        </div>
        <div className="bg-emerald-600 p-10 rounded-[2.5rem] shadow-xl shadow-emerald-600/10">
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{t('healthy', lang)}</p>
          <p className="text-6xl font-black text-white tracking-tighter">{stats.healthyCount}</p>
        </div>
        <div className="bg-white border-2 border-red-600/10 p-10 rounded-[2.5rem] shadow-sm">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{t('alerts', lang)}</p>
          <p className="text-6xl font-black text-black tracking-tighter">{stats.diseaseCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-black tracking-tighter uppercase">{t('records', lang)}</h2>
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{t('plan', lang)}: {user?.plan}</p>
            </div>
            {history.length > 4 && (
              <button 
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="text-xs font-black text-emerald-600 hover:underline uppercase tracking-widest"
              >
                {showAllHistory ? 'Show Less' : 'Full History'}
              </button>
            )}
          </div>
          <div className="grid gap-4">
            {displayedScans.length > 0 ? displayedScans.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectHistory(item)}
                className="bg-white border-2 border-emerald-600/5 p-5 rounded-3xl flex items-center space-x-6 cursor-pointer hover:border-emerald-600 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md">
                  <img src={`data:image/jpeg;base64,${item.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-black text-xl uppercase tracking-tighter">{item.result.cropName}</h3>
                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString(lang)}</p>
                </div>
                <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                  item.result.healthStatus === 'Healthy' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {item.result.healthStatus === 'Healthy' ? t('healthy', lang) : t('alerts', lang)}
                </span>
              </div>
            )) : (
              <div className="p-20 text-center glass-card rounded-[3rem] border-dashed border-2 border-emerald-600/20">
                <p className="text-black/30 font-black text-lg uppercase tracking-widest">No diagnostics yet</p>
              </div>
            )}
          </div>
        </div>

        {/* bio Logic Info */}
        <div className="space-y-8">
          <div className="bg-black p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black text-emerald-500 mb-4 uppercase tracking-tighter">Bio Logic</h3>
            <p className="text-white/70 text-sm font-bold leading-relaxed mb-6">Implementing precision pathology scanners ensures a 40% increase in sustainable yields across all tested regions.</p>
            <button onClick={() => onNavigate(AppState.RESOURCES)} className="text-xs font-black text-emerald-500 hover:text-white transition-colors uppercase tracking-widest">
              {t('resources', lang)} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
