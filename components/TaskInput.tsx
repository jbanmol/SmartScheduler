import React, { useState } from 'react';

interface TaskInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  const placeholderText = `Try something like...\n- "Schedule a team sync every Monday at 10am."\n- "Add 'Go to the gym' on Mon, Wed, Fri next week."\n- "Doctor's appointment on July 25th at 2 PM."`;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">Add with AI</h3>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholderText}
          className="w-full h-48 p-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-200 dark:placeholder-gray-400 transition-shadow flex-grow resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="mt-4 w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 uppercase text-sm tracking-wider flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Tasks'
          )}
        </button>
      </form>
    </div>
  );
};
