// Footer.jsx
import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-teal-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white text-base font-semibold">
            Med<span className="text-teal-400">Scan</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-slate-500 text-sm">
          {['home', 'services', 'about', 'contact'].map((section) => (
            <ScrollLink
              key={section}
              to={section}
              smooth
              offset={-58}
              duration={500}
              className="capitalize hover:text-teal-400 cursor-pointer transition-colors"
            >
              {section === 'contact' ? 'Contact' : section.charAt(0).toUpperCase() + section.slice(1)}
            </ScrollLink>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} MedScan. For research use only.
        </p>
      </div>
    </footer>
  );
}

export default Footer;