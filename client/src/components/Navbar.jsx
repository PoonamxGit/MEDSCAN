import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStethoscope, faInfoCircle, faEnvelope, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link as ScrollLink } from 'react-scroll';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isPredictPage =
    location.pathname === '/pneumonia' ||
    location.pathname === '/eyeDisease' ||
    location.pathname === '/skinDisease';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navLinks = [
    { to: 'home', icon: faHome, label: 'Home', offset: -78 },
    { to: 'services', icon: faStethoscope, label: 'Services', offset: -58 },
    { to: 'about', icon: faInfoCircle, label: 'About', offset: -58 },
    { to: 'contact', icon: faEnvelope, label: 'Contact', offset: -58 },
  ];

  const navItemClass =
    'flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-teal-300 transition-colors duration-200 cursor-pointer tracking-wide relative group';

  const underline =
    'absolute -bottom-1 left-0 w-0 h-px bg-teal-400 group-hover:w-full transition-all duration-300';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-md group-hover:bg-teal-400 transition-colors duration-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white text-lg font-semibold tracking-tight">
            Med<span className="text-teal-400">Scan</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!isPredictPage
            ? navLinks.map(({ to, icon, label, offset }) => (
                <ScrollLink
                  key={to}
                  to={to}
                  spy smooth
                  offset={offset}
                  duration={500}
                  className={navItemClass}
                >
                  <FontAwesomeIcon icon={icon} className="text-teal-400 text-xs" />
                  {label}
                  <span className={underline} />
                </ScrollLink>
              ))
            : navLinks.map(({ icon, label }) => (
                <Link key={label} to="/" className={navItemClass}>
                  <FontAwesomeIcon icon={icon} className="text-teal-400 text-xs" />
                  {label}
                  <span className={underline} />
                </Link>
              ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/pneumonia"
            className="px-4 py-1.5 rounded-full bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium transition-all duration-200 shadow-md hover:shadow-teal-500/30 hover:shadow-lg"
          >
            Try Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-200 hover:text-teal-300 transition-colors p-1"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        } bg-slate-800 border-t border-slate-700/60`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {!isPredictPage
            ? navLinks.map(({ to, icon, label, offset }) => (
                <ScrollLink
                  key={to}
                  to={to}
                  spy smooth
                  offset={offset}
                  duration={500}
                  className="flex items-center gap-3 text-sm text-slate-200 hover:text-teal-300 transition-colors cursor-pointer"
                  onClick={toggleMenu}
                >
                  <FontAwesomeIcon icon={icon} className="text-teal-400 w-4" />
                  {label}
                </ScrollLink>
              ))
            : navLinks.map(({ icon, label }) => (
                <Link
                  key={label}
                  to="/"
                  className="flex items-center gap-3 text-sm text-slate-200 hover:text-teal-300 transition-colors"
                  onClick={toggleMenu}
                >
                  <FontAwesomeIcon icon={icon} className="text-teal-400 w-4" />
                  {label}
                </Link>
              ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
