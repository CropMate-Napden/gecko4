
import React, { useState } from 'react';
import { AppState, User, Language } from '../types';
import { t } from '../i18n';

interface NavigationProps {
  currentTab: AppState;
  onNavigate: (state: AppState) => void;
  user: User | null;
  onLogout: () => void;
  onLanguageChange: (lang: Language) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onNavigate, user, onLogout, onLanguageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lang = user?.language || 'en';

  const navItems = [
    { label: t('home', lang), state: AppState.IDLE },
    { label: t('dashboard', lang), state: AppState.DASHBOARD },
    { label: t('chat', lang), state: AppState.CHAT },
    { label: t('resources', lang), state: AppState.RESOURCES },
    { label: t('pricing', lang), state: AppState.PRICING },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
    { code: 'hi', label: 'HI' },
    { code: 'zh', label: 'ZH' },
  ];

  const handleNavClick = (state: AppState) => {
    onNavigate(state);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="glass-nav sticky top-0 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => handleNavClick(AppState.IDLE)}
        >
          <div className="bg-emerald-600 p-2 rounded-xl transition-transform group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter text-black uppercase group-hover:text-emerald-600 transition-colors">AgroVision</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <button
              key={item.state}
              onClick={() => handleNavClick(item.state)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === item.state 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-black hover:bg-emerald-600/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Lang switcher */}
          <div className="flex items-center space-x-1 border-r border-emerald-500/10 pr-4">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => onLanguageChange(l.code)}
                className={`w-8 h-8 rounded-lg text-[10px] font-black uppercase transition-all ${
                  lang === l.code ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>

          <div className="group relative">
            <button className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-emerald-600/10 transition-colors">
              <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black">
                {user?.name.charAt(0)}
              </div>
            </button>
            <div className="absolute right-0 mt-4 w-56 glass-card rounded-2xl shadow-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
              <div className="px-4 py-3 border-b border-emerald-500/10 mb-2">
                <p className="text-sm font-black text-black truncate">{user?.name}</p>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{user?.plan} Membership</p>
              </div>
              <button onClick={() => handleNavClick(AppState.SETTINGS)} className="w-full text-left px-4 py-2.5 text-sm text-black hover:bg-emerald-600/10 rounded-xl transition-colors font-bold uppercase tracking-tight">{t('settings', lang)}</button>
              <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-black mt-1 uppercase tracking-tight">{t('logout', lang)}</button>
            </div>
          </div>
          <button 
            onClick={() => handleNavClick(AppState.CAPTURING)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg transition-all uppercase tracking-widest"
          >
            {t('scan', lang)}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-emerald-500/10 space-y-3 animate-in">
          {navItems.map((item) => (
            <button
              key={item.state}
              onClick={() => handleNavClick(item.state)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-lg font-black transition-all ${
                currentTab === item.state ? 'bg-emerald-600 text-white' : 'text-black hover:bg-emerald-600/10'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="grid grid-cols-5 gap-2 py-4 border-t border-emerald-500/10">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { onLanguageChange(l.code); setIsMobileMenuOpen(false); }}
                className={`py-3 rounded-xl text-xs font-black uppercase ${
                  lang === l.code ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>

          <button onClick={() => handleNavClick(AppState.CAPTURING)} className="w-full py-5 bg-emerald-600 text-white rounded-2xl text-xl font-black uppercase shadow-lg mb-2">{t('scan', lang)}</button>
          <button onClick={onLogout} className="w-full text-center py-4 text-red-600 font-black uppercase">{t('logout', lang)}</button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
