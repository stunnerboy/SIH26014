import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function LoadingState({ message = "Loading...", className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-gray-500", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-4" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
