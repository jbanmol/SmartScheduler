import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 p-4 mt-4 rounded-lg flex items-start space-x-3" role="alert">
       <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-bold">An error occurred</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
