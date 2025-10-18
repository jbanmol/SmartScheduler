import React from 'react';
import type { Task } from '../types';

interface CalendarProps {
  currentDate: Date;
  tasks: Task[];
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onGoToToday: () => void;
  onSelectTask: (task: Task) => void;
  onAddManualTask: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const taskColorClasses: Record<Task['color'], string> = {
    red:    'bg-red-500 text-white hover:bg-red-600',
    blue:   'bg-blue-500 text-white hover:bg-blue-600',
    green:  'bg-green-500 text-white hover:bg-green-600',
    yellow: 'bg-amber-500 text-white hover:bg-amber-600',
    purple: 'bg-purple-500 text-white hover:bg-purple-600',
    indigo: 'bg-indigo-500 text-white hover:bg-indigo-600',
    pink:   'bg-pink-500 text-white hover:bg-pink-600',
};

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  tasks,
  onNextMonth,
  onPrevMonth,
  onGoToToday,
  onSelectTask,
  onAddManualTask,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
         <button onClick={onGoToToday} className="px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-500 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
          Today
        </button>
      </div>
      <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">
        {currentDate.toLocaleString('default', { month: 'long' })} {year}
      </h2>
    </div>
  );

  const renderDaysOfWeek = () => (
    <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
      {WEEKDAYS.map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  );
  
  const renderCells = () => {
    const cells = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < startingDayOfWeek; i++) {
      cells.push(<div key={`empty-start-${i}`} className="border rounded-lg border-transparent"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const dateString = cellDate.toISOString().split('T')[0];
      const dayTasks = tasks.filter((task) => task.date === dateString);
      const isToday = cellDate.getTime() === today.getTime();

      cells.push(
        <div key={day} className={`border rounded-lg p-2 min-h-[120px] flex flex-col relative group transition-colors duration-200 ${isToday ? 'border-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
          <div className="flex justify-between items-center">
             <span className={`text-sm font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300'}`}>{day}</span>
             <button onClick={() => onAddManualTask(cellDate)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
             </button>
          </div>
          <div className="mt-1 flex-grow overflow-y-auto space-y-1">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`${taskColorClasses[task.color] || taskColorClasses.blue} text-xs font-medium p-1.5 rounded cursor-pointer truncate transition-colors`}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    const totalCells = startingDayOfWeek + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for(let i=0; i<remainingCells; i++) {
        cells.push(<div key={`empty-end-${i}`} className="border rounded-lg border-transparent"></div>);
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {cells}
      </div>
    );
  };

  return (
    <div>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};
