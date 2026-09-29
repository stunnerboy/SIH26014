import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { 
  Bot, X, Send, Globe, Info, Sparkles, RefreshCw, HelpCircle 
} from 'lucide-react';
import AssistantMessage from './AssistantMessage';
import { getPageGuide, getAnswerForQuery } from './assistantUtils';
import { getLandDetails } from '../../utils/getLandDetails';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function AssistantPanel({ isOpen, onClose }) {
  const location = useLocation();
  const params = useParams();
  const [lang, setLang] = useState('hi'); // Default: Hindi
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Parcel data if on /land/:id
  const parcelId = params.id || (location.pathname.startsWith('/land/') ? location.pathname.split('/land/')[1] : null);
  const parcelData = parcelId ? getLandDetails(parcelId) : null;

  // Initialize conversation when route or language changes
  useEffect(() => {
    const guide = getPageGuide(location.pathname, lang);
    const initialMsg = {
      id: 1,
      sender: 'assistant',
      text: guide.intro,
      quickActions: guide.quickActions
    };
    setMessages([initialMsg]);
  }, [location.pathname, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleGuideClick = () => {
    const guide = getPageGuide(location.pathname, lang);
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: lang === 'hi' ? "Is page ko kaise use karein? Guide me." : "Guide me on using this page."
    };
    const botMsg = {
      id: Date.now() + 1,
      sender: 'assistant',
      text: guide.intro,
      isGuide: true,
      title: guide.title,
      steps: guide.steps,
      quickActions: guide.quickActions.filter(qa => qa.type !== 'guide')
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleQuickAction = (qa) => {
    if (qa.type === 'guide') {
      handleGuideClick();
      return;
    }

    const userText = qa.text;
    const answer = getAnswerForQuery(qa.query, location.pathname, parcelData, lang);

    const userMsg = { id: Date.now(), sender: 'user', text: userText };
    const botMsg = {
      id: Date.now() + 1,
      sender: 'assistant',
      text: answer,
      quickActions: getPageGuide(location.pathname, lang).quickActions.filter(item => item.query !== qa.query)
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input.trim().toLowerCase();
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setInput('');

    let queryKey = 'what_is_bhusetu';
    if (query.includes('owner') || query.includes('malik') || query.includes('kiska')) queryKey = 'land_owner';
    else if (query.includes('area') || query.includes('kshetrafal') || query.includes('size')) queryKey = 'land_area';
    else if (query.includes('court') || query.includes('case') || query.includes('legal')) queryKey = 'land_court_case';
    else if (query.includes('encumbrance') || query.includes('mortgage') || query.includes('bank')) queryKey = 'land_encumbrance';
    else if (query.includes('use') || query.includes('type') || query.includes('kisi')) queryKey = 'land_use';
    else if (query.includes('ulpin')) queryKey = 'what_is_ulpin';
    else if (query.includes('khata') || query.includes('khasra')) queryKey = 'khata_vs_khasra';
    else if (query.includes('login')) queryKey = 'when_login_needed';
    else if (query.includes('impact') || query.includes('corridor')) queryKey = 'explain_impact_calc';

    const answer = getAnswerForQuery(queryKey, location.pathname, parcelData, lang);
    const botMsg = {
      id: Date.now() + 1,
      sender: 'assistant',
      text: answer,
      quickActions: getPageGuide(location.pathname, lang).quickActions
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-gray-900/40 backdrop-blur-xs transition-opacity">
      
      {/* Container / Drawer */}
      <div className="w-full sm:w-[420px] bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-in slide-in-from-right duration-200">
        
        {/* HEADER */}
        <div className="bg-emerald-800 text-white px-4 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-emerald-700 border border-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                BhuSetu Assistant <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              </h2>
              <p className="text-[11px] text-emerald-200 font-medium">Demo Guidance • Prototype</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(l => l === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1 text-xs font-bold bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 px-2.5 py-1 rounded-full border border-emerald-600 transition-colors"
              title="Change Language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* DISCLAIMER BANNER */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-[11px] text-amber-900 font-medium flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
            Prototype guidance using page demo data
          </span>
          <button onClick={handleGuideClick} className="font-bold text-amber-800 underline hover:text-amber-950">
            Guide me
          </button>
        </div>

        {/* CHAT MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {messages.map(msg => (
            <AssistantMessage
              key={msg.id}
              message={msg}
              onQuickAction={handleQuickAction}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* FOOTER INPUT */}
        <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={lang === 'hi' ? "Sawāl poochhein (e.g. Owner kaun hai?)..." : "Ask a question (e.g., Who is owner?)..."}
              className="flex-1 border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
