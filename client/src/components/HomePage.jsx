import React, { useEffect, useRef } from 'react';
import { Link as ScrollLink } from 'react-scroll';

function HomePage() {
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '94%', label: 'Diagnostic Accuracy' },
    { value: '3', label: 'Disease Modules' },
    { value: '<2s', label: 'Avg. Prediction Time' },
    { value: 'AI', label: 'Powered Analysis' },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero content */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        {/* Badge */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          AI-Powered Medical Diagnostics
        </div>

        {/* Headline */}
        <h1
          className="reveal opacity-0 translate-y-4 transition-all duration-700 delay-100 text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          style={{ transitionDelay: '100ms' }}
        >
          Diagnose Smarter
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
            with AI Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="reveal opacity-0 translate-y-4 transition-all duration-700 text-slate-400 text-lg md:text-xl max-w-xl mb-10"
          style={{ transitionDelay: '200ms' }}
        >
          Upload a medical image. Get instant AI-powered analysis for pneumonia,
          eye diseases, and skin conditions.
        </p>

        {/* CTA Buttons */}
        <div
          className="reveal opacity-0 translate-y-4 transition-all duration-700 flex flex-wrap gap-4 justify-center"
          style={{ transitionDelay: '300ms' }}
        >
          <ScrollLink
            to="services"
            smooth
            offset={-58}
            duration={500}
            className="cursor-pointer px-8 py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-teal-500/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            Explore Services
          </ScrollLink>
          <ScrollLink
            to="about"
            smooth
            offset={-58}
            duration={500}
            className="cursor-pointer px-8 py-3 rounded-full border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
          >
            Learn More
          </ScrollLink>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Stats bar */}
      <div
        ref={statsRef}
        className="relative border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className="reveal opacity-0 translate-y-4 transition-all duration-700 text-center"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}

export default HomePage;