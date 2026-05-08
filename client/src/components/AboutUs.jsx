import React from 'react';

const team = [
  {
    name: 'Pragya',
    role: 'Team Member',
    initials: 'PR',
    envKey: 'VITE_PRAGYA',
    color: 'teal',
  },
  {
    name: 'Poonam',
    role: 'Team Member',
    initials: 'PO',
    envKey: 'VITE_POONAM',
    color: 'cyan',
  },
  {
    name: 'Charu',
    role: 'Team Member',
    initials: 'CH',
    envKey: 'VITE_CHARU',
    color: 'indigo',
  },
];

const colorMap = {
  teal: {
    avatar: 'bg-teal-500/20 text-teal-300',
    role: 'text-teal-400',
    border: 'hover:border-teal-500/40',
  },
  cyan: {
    avatar: 'bg-cyan-500/20 text-cyan-300',
    role: 'text-cyan-400',
    border: 'hover:border-cyan-500/40',
  },
  indigo: {
    avatar: 'bg-indigo-500/20 text-indigo-300',
    role: 'text-indigo-400',
    border: 'hover:border-indigo-500/40',
  },
};

function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-950 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">
            The Team
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">About Us</h2>
          <p className="text-slate-400 max-w-lg mx-auto text-base">
            A multidisciplinary student team building AI tools to make medical
            diagnostics more accessible.
          </p>
        </div>

        {/* Cards — 3 columns on md+, centered */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {team.map(({ name, role, contribution, initials, envKey, color }) => {
            const c = colorMap[color];
            return (
              <a
                key={name}
                href={import.meta.env[envKey]}
                target="_blank"
                rel="noreferrer"
                className={`group bg-slate-900 border border-slate-800 ${c.border} rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-200 hover:bg-slate-800/80`}
              >
                {/* Avatar */}
                <div
                  className={`w-14 h-14 rounded-xl ${c.avatar} flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}
                >
                  {initials}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-base truncate">{name}</h3>
                  <p className={`text-xs font-medium ${c.role} mt-1`}>{role}</p>
                  {contribution && (
                    <p className="text-slate-500 text-xs leading-relaxed mt-2">{contribution}</p>
                  )}
                </div>

                {/* Link arrow */}
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  className="text-slate-600 group-hover:text-slate-300 transition-colors"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-500 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Built as part of an Minor project
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
