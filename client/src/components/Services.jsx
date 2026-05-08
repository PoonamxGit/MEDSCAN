import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Pneumonia Detection',
    description:
      'Analyze chest X-ray images using deep learning to detect pneumonia with high accuracy.',
    path: '/pneumonia',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M12 3C7 3 4 7 4 11c0 3 1.5 5.5 3 7l1 2h8l1-2c1.5-1.5 3-4 3-7 0-4-3-8-8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 11h6M12 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    accent: 'teal',
    badge: 'X-Ray Analysis',
    accuracy: '92%',
  },
  {
    title: 'Eye Disease Detection',
    description:
      'Identify retinal abnormalities and eye conditions from fundus images using AI models.',
    path: '/eyeDisease',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <ellipse cx="12" cy="12" rx="9" ry="5.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    accent: 'cyan',
    badge: 'Fundus Imaging',
    accuracy: '94%',
  },
  {
    title: 'Skin Disease Detection',
    description:
      'Classify skin conditions from dermoscopy images with AI trained on diverse datasets.',
    path: '/skinDisease',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M12 2C6.5 2 3 6 3 10c0 5 4 9 9 9s9-4 9-9c0-4-3.5-8-9-8z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    accent: 'indigo',
    badge: 'Dermoscopy',
    accuracy: '89%',
  },
];

const accentMap = {
  teal: {
    iconBg: 'bg-teal-500/10',
    iconText: 'text-teal-400',
    badge: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    btn: 'bg-teal-500 hover:bg-teal-400 shadow-teal-500/20',
    bar: 'bg-teal-500',
    border: 'hover:border-teal-500/40',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10',
    iconText: 'text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    btn: 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20',
    bar: 'bg-cyan-500',
    border: 'hover:border-cyan-500/40',
  },
  indigo: {
    iconBg: 'bg-indigo-500/10',
    iconText: 'text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    btn: 'bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/20',
    bar: 'bg-indigo-500',
    border: 'hover:border-indigo-500/40',
  },
};

function Services() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-card').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Our Services
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-base">
            Three specialized AI models trained to assist with early-stage medical diagnostics.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(({ title, description, path, icon, accent, badge, accuracy }, i) => {
            const a = accentMap[accent];
            return (
              <div
                key={path}
                className={`reveal-card opacity-0 translate-y-8 transition-all duration-700 group relative bg-slate-800/60 border border-slate-700/50 ${a.border} rounded-2xl p-6 flex flex-col hover:bg-slate-800 transition-colors`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${a.iconBg} ${a.iconText} flex items-center justify-center`}>
                    {icon}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${a.badge}`}>
                    {badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{description}</p>

                {/* Accuracy bar */}
                <div className="mt-5 mb-5">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Model Accuracy</span>
                    <span className="text-slate-300 font-medium">{accuracy}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${a.bar} rounded-full transition-all duration-1000`}
                      style={{ width: accuracy }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to={path}
                  className={`mt-auto w-full text-center py-2.5 rounded-xl ${a.btn} text-white text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                >
                  Start Analysis →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-slate-600 text-xs mt-10">
          For informational and research purposes only. Always consult a licensed medical professional.
        </p>
      </div>

      <style>{`
        .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </div>
  );
}

export default Services;