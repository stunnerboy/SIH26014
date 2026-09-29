import React from 'react';
import { FileQuestion } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Button from './Button';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function EmptyState({ 
  title = "No data found", 
  description, 
  icon: Icon = FileQuestion,
  actionLabel,
  onAction,
  className 
}) {
  return (
    <div className={cn("text-center p-8 bg-white border border-gray-200 rounded-lg", className)}>
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
