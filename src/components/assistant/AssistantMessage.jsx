import React from 'react';
import { Bot, User, CheckCircle, ChevronRight, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function AssistantMessage({ message, onQuickAction }) {
  const { sender, text, steps, title, quickActions, isGuide } = message;
  const isUser = sender === 'user';

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}>
      
      {/* Avatar */}
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm",
        isUser ? "bg-primary-600 text-white" : "bg-emerald-700 text-white"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className={cn("max-w-[85%] text-xs sm:text-sm space-y-2", isUser ? "items-end" : "items-start")}>
        
        {/* Bubble */}
        <div className={cn(
          "p-3.5 rounded-2xl shadow-sm border leading-relaxed",
          isUser 
            ? "bg-primary-600 text-white border-primary-600 rounded-tr-none" 
            : "bg-white text-gray-800 border-gray-200 rounded-tl-none"
        )}>
          {text}
        </div>

        {/* Step-by-Step Guide Card */}
        {isGuide && steps && steps.length > 0 && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 space-y-2.5 text-xs text-emerald-950">
            {title && (
              <div className="font-bold text-emerald-900 border-b border-emerald-200 pb-1.5 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-emerald-700" /> {title}
              </div>
            )}
            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-emerald-100 shadow-2xs">
                  <span className="h-5 w-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-800 font-medium leading-tight">{step.replace(/^Step \d+:\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Action Pills */}
        {!isUser && quickActions && quickActions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                onClick={() => onQuickAction(qa)}
                className="text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                {qa.text} <ChevronRight className="h-3 w-3 opacity-60" />
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
