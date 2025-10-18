import React from 'react';
import type { Task } from '../types';

interface TaskPopoverProps {
  task: Task;
  position: { top: number; left: number };
  onClose: () => void;
  onEdit: (task: Task) => void;
}

const colorClasses: Record<Task['color'], string> = {
    red:    'bg-red-500',
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    yellow: 'bg-amber-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    pink:   'bg-pink-500',
};

export const TaskPopover: React.FC<TaskPopoverProps> = ({ task, position, onClose, onEdit }) => {
  return (
    <div 
      className="fixed inset-0 z-40" 
      onClick={onClose}
      aria-hidden="true"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full border border-gray-200 dark:border-gray-700 transform transition-all
                   fixed bottom-4 left-4 right-4 z-50 p-4 animate-slide-in-up 
                   sm:absolute sm:max-w-xs sm:w-full sm:bottom-auto sm:left-auto sm:right-auto sm:animate-fade-in-up" 
        style={position.top === 0 && position.left === 0 ? {} : { top: position.top, left: position.left }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="popover-title"
      >
        <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3 pr-2">
                <span className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${colorClasses[task.color]}`} aria-hidden="true"></span>
                <div>
                    <h3 id="popover-title" className="text-lg font-medium text-gray-800 dark:text-gray-100 break-words">{task.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 break-words">{task.description || 'No description provided.'}</p>
                </div>
            </div>
          <button onClick={onClose} className="-mt-2 -mr-2 p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors" aria-label="Close popover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4 flex justify-end">
            <button 
                onClick={() => onEdit(task)} 
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-md transition-colors uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
                Edit Task
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.15s ease-out forwards;
        }
        @keyframes slide-in-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-in-up {
            animation: slide-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};