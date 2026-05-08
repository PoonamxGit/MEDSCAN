import React, { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are MedBot, a helpful medical assistant. When a user describes their symptoms, you should:
1. List 2-3 most possible conditions/diseases based on symptoms
2. Give simple first aid or immediate relief measures
3. Suggest OTC medicines for temporary relief (always mention "consult doctor before use")
4. Tell them if it's an emergency and they should go to hospital immediately

Always end with: "⚠️ This is AI-generated information only. Please consult a qualified doctor for proper diagnosis and treatment."

Keep responses concise, clear and in the same language the user writes in (English or Hindi).
Do not diagnose definitively — always say "possible" or "may indicate".`;

const MedicalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I am MedBot. Describe your symptoms and I will suggest possible conditions and first aid.\n\nExample: *"I have fever, headache and body pain since 2 days"*'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request. Please try again.';

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Groq API error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Something went wrong. Please check your connection and try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      content: '👋 Hi! I am MedBot. Describe your symptoms and I will suggest possible conditions and first aid.\n\nExample: *"I have fever, headache and body pain since 2 days"*'
    }]);
    setInput('');
  };

  // Format message — bold *text* and line breaks
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*([^*]+)\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} className="text-white">{part}</strong>
              : <span key={j}>{part}</span>
          )}
          <br />
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-400 shadow-lg hover:shadow-teal-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="MedBot — Symptom Checker"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.35 5.42 3.47 7.17L4 22l4.18-1.33C9.33 21.22 10.63 21.5 12 21.5c5.52 0 10-4.03 10-9s-4.48-9-10-9z" fill="white"/>
            <path d="M8 10h8M8 13h5" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Notification dot — when closed */}
      {!isOpen && (
        <span className="fixed bottom-[72px] right-6 z-50 w-3 h-3 rounded-full bg-red-500 border-2 border-slate-950 animate-pulse" />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-lg">
                🩺
              </div>
              <div>
                <p className="text-white text-sm font-semibold">MedBot</p>
                <p className="text-teal-400 text-xs">AI Symptom Checker</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Reset button */}
              <button
                onClick={handleReset}
                title="Clear chat"
                className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                    🩺
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-500 text-white rounded-tr-sm'
                    : 'bg-slate-800 text-slate-300 rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                  🩺
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-700 bg-slate-800/50">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms..."
                rows={1}
                className="flex-1 bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none resize-none transition-colors"
                style={{ maxHeight: '80px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p className="text-slate-600 text-[10px] mt-1.5 text-center">
              Press Enter to send • Not a substitute for medical advice
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalChatbot;