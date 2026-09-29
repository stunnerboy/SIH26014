import React from 'react';
import { AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Button from './Button';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while loading this content.", 
  onRetry,
  className 
}) {
  return (
    <div className={cn("rounded-md bg-red-50 p-4 border border-red-200", className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <Button variant="danger" size="sm" onClick={onRetry}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
