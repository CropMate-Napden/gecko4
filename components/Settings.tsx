
import React from 'react';
import { User, AppState, Language } from '../types';
import { t } from '../i18n';

interface SettingsProps {
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onNavigate: (state: AppState) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onNavigate }) => {
  if (!user) return null;
  const lang = user.language || 'en';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdateUser({ ...user, [name]: value });
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6 animate-in space-y-10">
      <div className="mb-10">
        <h2 className="text-5xl font-black text-black tracking-tighter uppercase">{t('settings', lang)}</h2>
        <p className="text-emerald-600 font-bold uppercase tracking-widest">{t('identity', lang)} & {t('language', lang)}</p>
      </div>

      <div className="bg-white border-2 border-emerald-600/10 p-10 rounded-[3rem] space-y-12 shadow-xl">
        {/* Language Selection */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('language', lang)}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => onUpdateUser({ ...user, language: l.code })}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black uppercase text-xs transition-all border-2 ${
                  lang === l.code 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' 
                    : 'bg-white text-black border-emerald-600/10 hover:border-emerald-600/40'
                }`}
              >
                <span>{l.label}</span>
                {lang === l.code && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t-2 border-emerald-500/10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Full Name</label>
            <input 
              name="name" 
              value={user.name} 
              onChange={handleChange} 
              placeholder="Your name"
              className="w-full bg-white border-2 border-emerald-600/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-600 font-bold text-black transition-colors" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Professional Role</label>
            <div className="relative">
              <select 
                name="jobRole" 
                value={user.jobRole} 
                onChange={handleChange} 
                className="w-full bg-white border-2 border-emerald-600/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-600 font-bold text-black appearance-none transition-colors"
              >
                <option value="Farmer">Commercial Farmer</option>
                <option value="Gardener">Home Gardener</option>
                <option value="Hobbyist">Hobbyist</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={() => onNavigate(AppState.DASHBOARD)}
          className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase shadow-2xl hover:bg-emerald-700 active:scale-95 transition-all tracking-widest"
        >
          Update Identity
        </button>
      </div>
    </div>
  );
};

export default Settings;
