import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaGithub } from 'react-icons/fa';

function ContactUs() {
  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-slate-400 max-w-md mx-auto text-base">
            Have questions, feedback, or collaboration ideas? We'd love to hear from you.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <a
            href={`tel:+91-${import.meta.env.VITE_PHONE}`}
            className="group bg-slate-800 border border-slate-700 hover:border-teal-500/40 rounded-2xl p-6 flex items-center gap-5 transition-all duration-200 hover:bg-slate-800/80"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
              <FaPhoneAlt size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Phone</p>
              <p className="text-white font-semibold text-base">
                +91 {import.meta.env.VITE_PHONE}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">Available Mon–Fri</p>
            </div>
          </a>

          <a
            href={`mailto:${import.meta.env.VITE_EMAIL}`}
            className="group bg-slate-800 border border-slate-700 hover:border-cyan-500/40 rounded-2xl p-6 flex items-center gap-5 transition-all duration-200 hover:bg-slate-800/80"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
              <FaEnvelope size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
              <p className="text-white font-semibold text-base truncate">
                {import.meta.env.VITE_EMAIL}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">We reply within 24h</p>
            </div>
          </a>
        </div>

        {/* Quick message box */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-base mb-4">Send a Quick Message</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your name"
                className="bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none transition-colors w-full"
              />
              <input
                type="email"
                placeholder="Email address"
                className="bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none transition-colors w-full"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none transition-colors resize-none"
            />
            <button className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5">
              Send Message
            </button>
          </div>
          <p className="text-slate-600 text-xs text-center mt-3">
            This form is for demo purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;