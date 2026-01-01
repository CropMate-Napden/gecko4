
import React from 'react';
import { PlanType, User } from '../types';
import { t } from '../i18n';

interface PricingProps {
  currentPlan: PlanType;
  onUpgrade: () => void;
  user: User | null;
}

const Pricing: React.FC<PricingProps> = ({ currentPlan, onUpgrade, user }) => {
  const lang = user?.language || 'en';
  
  const tiers = [
    { 
      name: 'Standard', 
      price: '$0', 
      desc: 'Essential diagnostics for home gardens and small hobby fields.',
      features: ['10 Scans / Week', 'Standard AI Analysis', 'Basic Chat Support']
    },
    { 
      name: 'Pro', 
      price: '$29', 
      desc: 'High-precision intelligence for commercial farms and agronomy labs.',
      features: ['Unlimited Scans', 'Priority Pro AI Processing', 'Expert Resources Access']
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-6 animate-in text-center">
      <h2 className="text-6xl font-black text-black mb-16 uppercase tracking-tighter">{t('pricing', lang)}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {tiers.map((tier) => (
          <div key={tier.name} className={`bg-white border-4 p-12 rounded-[3rem] transition-all flex flex-col ${
            tier.name === 'Pro' ? 'border-emerald-600 shadow-2xl scale-105' : 'border-emerald-600/10 shadow-sm'
          }`}>
            <h3 className="text-3xl font-black text-black mb-2 uppercase">{tier.name}</h3>
            <p className="text-5xl font-black text-emerald-600 mb-6">{tier.price}<span className="text-lg text-black/40">/mo</span></p>
            <p className="text-black/60 font-bold mb-10 min-h-[60px]">{tier.desc}</p>
            
            <ul className="space-y-4 mb-12 text-left flex-1">
              {tier.features.map(f => (
                <li key={f} className="flex items-center space-x-3 font-black text-sm uppercase">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={tier.name === 'Pro' && currentPlan !== 'Pro' ? onUpgrade : undefined}
              disabled={currentPlan === tier.name}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                currentPlan === tier.name 
                  ? 'bg-emerald-50 text-emerald-600 cursor-default border-2 border-emerald-600/20' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl'
              }`}
            >
              {currentPlan === tier.name ? 'Active Plan' : t('upgrade', lang)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
