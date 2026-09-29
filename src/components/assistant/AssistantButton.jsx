import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import AssistantPanel from './AssistantPanel';

export default function AssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-800 hover:bg-emerald-900 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2 border border-emerald-600 group"
          title="Ask BhuSetu Assistant"
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-emerald-100" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>

          <span className="hidden sm:inline font-bold text-xs sm:text-sm tracking-wide text-white">
            Ask BhuSetu Assistant
          </span>
        </button>
      </div>

      {/* Assistant Modal / Drawer Panel */}
      <AssistantPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
