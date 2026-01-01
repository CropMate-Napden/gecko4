
import React, { useState, useCallback, useEffect } from 'react';
import Navigation from './components/Navigation';
import CameraView from './components/CameraView';
import AnalysisView from './components/AnalysisView';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Resources from './components/Resources';
import Chat from './components/Chat';
import Pricing from './components/Pricing';
import Settings from './components/Settings';
import { analyzeCropImage } from './services/geminiService';
import { AnalysisResult, AppState, HistoryItem, User, Language } from './types';
import { t } from './i18n';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.AUTH);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const lang = user?.language || 'en';

  useEffect(() => {
    const storedUser = localStorage.getItem('agrovision_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setState(AppState.IDLE);
    }
    const storedHistory = localStorage.getItem('agrovision_history');
    if (storedHistory) {
      try { setHistory(JSON.parse(storedHistory)); } catch (e) {}
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    let mockUser: User;
    if (email === 'user@pro.com') {
      mockUser = {
        name: 'Pro Grower',
        email: 'user@pro.com',
        joinedDate: new Date().toISOString(),
        plan: 'Pro',
        scanCount: 99,
        maxScans: Infinity,
        jobRole: 'Farmer',
        primaryCrop: 'Maize',
        language: 'en'
      };
    } else {
      mockUser = {
        name: 'Standard Farmer',
        email: 'user@standard.com',
        joinedDate: new Date().toISOString(),
        plan: 'Standard',
        scanCount: 0,
        maxScans: 10,
        jobRole: 'Hobbyist',
        primaryCrop: 'Tomato',
        language: 'en'
      };
    }
    
    setUser(mockUser);
    localStorage.setItem('agrovision_user', JSON.stringify(mockUser));
    setState(AppState.IDLE);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('agrovision_user');
    setState(AppState.AUTH);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('agrovision_user', JSON.stringify(updatedUser));
  };

  const handleLanguageChange = (newLang: Language) => {
    if (!user) return;
    const updatedUser = { ...user, language: newLang };
    handleUpdateUser(updatedUser);
  };

  const updateUsage = () => {
    if (!user) return;
    const updatedUser = { ...user, scanCount: user.scanCount + 1 };
    setUser(updatedUser);
    localStorage.setItem('agrovision_user', JSON.stringify(updatedUser));
  };

  const saveToHistory = (image: string, result: AnalysisResult) => {
    const newItem: HistoryItem = { id: Date.now().toString(), timestamp: Date.now(), image, result };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('agrovision_history', JSON.stringify(updatedHistory));
  };

  const handleCapture = useCallback(async (base64: string) => {
    if (user && user.plan === 'Standard' && user.scanCount >= user.maxScans) {
      setError("Weekly scan limit reached. Please upgrade to Pro.");
      setState(AppState.ERROR);
      return;
    }

    setCapturedImage(base64);
    setState(AppState.ANALYZING);
    setError(null);
    try {
      const result = await analyzeCropImage(base64, lang);
      setAnalysis(result);
      setState(AppState.RESULT);
      saveToHistory(base64, result);
      updateUsage();
    } catch (err: any) {
      setError(err.message || "Analysis failed.");
      setState(AppState.ERROR);
    }
  }, [user, history, lang]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        handleCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => { setState(AppState.IDLE); setCapturedImage(null); setAnalysis(null); setError(null); };

  const renderContent = () => {
    switch (state) {
      case AppState.IDLE:
        return (
          <div className="max-w-5xl w-full text-center py-24 px-6 animate-in">
            <h1 className="text-6xl md:text-9xl font-black text-black mb-8 tracking-tighter leading-none uppercase">
              {t('welcome', lang).split(',')[0]}<br/>
              <span className="text-emerald-600">{t('welcome', lang).split(',')[1]}</span>
            </h1>
            <p className="text-xl md:text-2xl text-black/60 mb-12 max-w-2xl mx-auto font-bold leading-relaxed">
              {t('heroDesc', lang)}
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button onClick={() => setState(AppState.CAPTURING)} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">
                {t('camera', lang)}
              </button>
              <label className="w-full md:w-auto flex items-center justify-center bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-12 py-6 rounded-2xl font-black text-xl cursor-pointer active:scale-95 transition-all uppercase tracking-widest">
                {t('upload', lang)}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        );
      case AppState.DASHBOARD: return <Dashboard history={history} onSelectHistory={(item) => { setAnalysis(item.result); setCapturedImage(item.image); setState(AppState.RESULT); }} onNavigate={setState} user={user} />;
      case AppState.HISTORY: return <History history={history} onSelectItem={(item) => { setAnalysis(item.result); setCapturedImage(item.image); setState(AppState.RESULT); }} />;
      case AppState.CHAT: return <Chat user={user} />;
      case AppState.RESOURCES: return <Resources user={user} />;
      case AppState.PRICING: return <Pricing currentPlan={user?.plan || 'Standard'} onUpgrade={() => { if(user) handleUpdateUser({...user, plan: 'Pro', maxScans: Infinity}); setState(AppState.DASHBOARD); }} user={user} />;
      case AppState.SETTINGS: return user ? <Settings user={user} onUpdateUser={handleUpdateUser} onNavigate={setState} /> : null;
      case AppState.CAPTURING: return <CameraView onCapture={handleCapture} onCancel={reset} />;
      case AppState.ANALYZING:
        return (
          <div className="text-center py-24 px-6 animate-in">
            <div className="relative w-64 h-64 mx-auto mb-10 overflow-hidden rounded-[3rem] shadow-2xl border-2 border-emerald-600/20">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600 shadow-[0_0_20px_#059669] animate-[scan_2s_infinite]"></div>
              {capturedImage && <img src={`data:image/jpeg;base64,${capturedImage}`} className="w-full h-full object-cover grayscale opacity-30" />}
            </div>
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Analyzing...</h2>
          </div>
        );
      case AppState.RESULT: return analysis && capturedImage ? <AnalysisView result={analysis} image={capturedImage} onReset={reset} user={user} /> : null;
      case AppState.ERROR:
        return (
          <div className="max-w-md w-full bg-white p-12 rounded-[3rem] text-center shadow-2xl animate-in border-2 border-red-500/20">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">{t('alerts', lang)}</h2>
            <p className="text-black/60 mb-8 font-bold leading-relaxed">{error}</p>
            <button onClick={reset} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest">OK</button>
          </div>
        );
      default: return null;
    }
  };

  if (state === AppState.AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-emerald-950/5">
        <div className="max-w-md w-full glass-card rounded-[3rem] p-12 animate-in shadow-2xl">
          <h2 className="text-3xl font-black text-black text-center mb-10 uppercase tracking-tighter">AgroVision</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input name="email" type="email" placeholder="Email Address" required defaultValue="user@standard.com" className="w-full px-6 py-4 bg-white border-2 border-emerald-500/10 rounded-2xl outline-none focus:border-emerald-600 transition-all font-bold text-black" />
            <input name="password" type="password" placeholder="Password" required defaultValue="password" className="w-full px-6 py-4 bg-white border-2 border-emerald-500/10 rounded-2xl outline-none focus:border-emerald-600 transition-all font-bold text-black" />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black shadow-lg transition-transform active:scale-95 uppercase tracking-widest">Sign In</button>
          </form>
          <div className="mt-8 text-center text-[10px] text-emerald-600 font-black uppercase tracking-widest opacity-60">Standard: user@standard.com | Pro: user@pro.com</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation 
        currentTab={state} 
        onNavigate={setState} 
        user={user} 
        onLogout={handleLogout} 
        onLanguageChange={handleLanguageChange}
      />
      <main className="flex-1 flex flex-col items-center overflow-y-auto custom-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
