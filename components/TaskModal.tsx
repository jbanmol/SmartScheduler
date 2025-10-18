import React, { useState, useEffect } from 'react';
import type { Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> & { id?: string }) => void;
  onDelete: (taskId: string) => void;
  task: Task | null;
  date: Date | null;
}

const colors: Task['color'][] = ['blue', 'green', 'red', 'yellow', 'purple', 'indigo', 'pink'];
const colorClasses: Record<Task['color'], string> = {
    red:    'bg-red-500',
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    yellow: 'bg-amber-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    pink:   'bg-pink-500',
};

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, task, date }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [color, setColor] = useState<Task['color']>('blue');
  
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setTaskDate(task.date);
      setColor(task.color);
    } else if (date) {
      setTitle('');
      setDescription('');
      setTaskDate(date.toISOString().split('T')[0]);
      setColor('blue');
    }
  }, [task, date, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !taskDate) return;
    onSave({ id: task?.id, title, description, date: taskDate, color });
  };

  // Add a class to the body to prevent scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto' };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 transform transition-transform duration-300 scale-100" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">{task ? 'Edit Task' : 'Add Task'}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" id="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} required className="w-full px-3 py-2 bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:[color-scheme:dark]"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
              <div className="flex space-x-2">
                {colors.map(c => (
                  <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full ${colorClasses[c]} transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800' : ''}`}></button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-end space-x-4">
             {task && (
              <button type="button" onClick={() => onDelete(task.id)} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors uppercase tracking-wider">
                Delete
              </button>
            )}
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md uppercase text-sm tracking-wider">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
