
import React from 'react';
import { AnalysisResult, User } from '../types';
import { t } from '../i18n';

interface AnalysisViewProps {
  result: AnalysisResult;
  image: string;
  onReset: () => void;
  user: User | null;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, image, onReset, user }) => {
  const isHealthy = result.healthStatus === 'Healthy';
  const lang = user?.language || 'en';

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-emerald-600/10 rounded-[3rem] p-4 shadow-xl">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden">
              <img 
                src={`data:image/jpeg;base64,${image}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={onReset}
              className="mt-8 w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest"
            >
              {t('scan', lang)}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-emerald-600/10 pb-10">
            <div>
              <h2 className="text-6xl font-black text-black tracking-tighter uppercase">{result.cropName}</h2>
              <div className="mt-4 flex items-center space-x-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>AI Confidence: {(result.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
            <span className={`px-10 py-4 rounded-full text-sm font-black uppercase tracking-widest shadow-lg ${
              isHealthy ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {isHealthy ? t('healthy', lang) : t('alerts', lang)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-emerald-600/10 p-10 rounded-[3rem]">
              <h4 className="text-xl font-black text-black mb-8 uppercase tracking-tighter">Procedures</h4>
              <ul className="space-y-6">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start text-black font-bold text-sm leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mr-4 mt-1.5 shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border-2 border-emerald-600/10 p-10 rounded-[3rem]">
              <h4 className="text-xl font-black text-black mb-8 uppercase tracking-tighter">Prevention</h4>
              <ul className="space-y-6">
                {result.preventativeMeasures.map((measure, i) => (
                  <li key={i} className="flex items-start text-black font-bold text-sm leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mr-4 mt-1.5 shrink-0"></span>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
