import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Card({ className, children, ...props }) {
  return (
    <div 
      className={cn("bg-white overflow-hidden shadow-sm border border-gray-200 rounded-lg", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-4 py-5 sm:px-6 border-b border-gray-200", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("px-4 py-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200", className)} {...props}>
      {children}
    </div>
  );
}
