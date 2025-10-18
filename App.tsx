import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { TaskInput } from './components/TaskInput';
import { TaskModal } from './components/TaskModal';
import { generateTasksFromPrompt } from './services/geminiService';
import { Task } from './types';
import { Header } from './components/Header';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { TaskPopover } from './components/TaskPopover';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('ai-calendar-tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (e) {
      console.error("Could not load tasks from local storage", e);
      return [];
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  const [popoverTask, setPopoverTask] = useState<Task | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('ai-calendar-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  // --- HANDLERS ---
  const handleGenerateTasks = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTasks = await generateTasksFromPrompt(prompt, currentDate);
      const tasksWithIds = newTasks.map((task) => ({
        ...task,
        id: crypto.randomUUID(),
      }));
      setTasks((prevTasks) => [...prevTasks, ...tasksWithIds]);
    } catch (e) {
      console.error(e);
      setError('Failed to generate tasks. The AI might be having trouble. Please try rephrasing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleGoToToday = () => setCurrentDate(new Date());
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleOpenModalForNew = (date: Date) => {
    setSelectedTask(null);
    setModalDate(date);
    setIsModalOpen(true);
  };
  
  const handleOpenModalForEdit = (task: Task) => {
    setSelectedTask(task);
    setModalDate(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setModalDate(null);
  };

  const handleOpenPopover = (task: Task, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    
    // For mobile, we don't need complex positioning as it will be a bottom sheet.
    if (window.innerWidth < 640) {
        setPopoverPosition({ top: 0, left: 0 });
        setPopoverTask(task);
        return;
    }

    const popoverWidth = 320; // Corresponds to max-w-xs
    const popoverHeight = 160; // Approximate height
    const margin = 8;

    let top = rect.bottom + margin;
    let left = rect.left;

    if (left + popoverWidth > window.innerWidth) {
        left = window.innerWidth - popoverWidth - margin;
    }
    if (top + popoverHeight > window.innerHeight) {
        top = rect.top - popoverHeight - margin;
    }
    if (left < margin) left = margin;
    if (top < margin) top = margin;


    setPopoverPosition({ top, left });
    setPopoverTask(task);
  };

  const handleClosePopover = () => {
    setPopoverTask(null);
    setPopoverPosition(null);
  };

  const handleEditFromPopover = (taskToEdit: Task) => {
    handleClosePopover();
    // Use a short timeout to allow the popover to animate out before the modal appears
    setTimeout(() => {
        handleOpenModalForEdit(taskToEdit);
    }, 150);
  };

  const handleSaveTask = (taskToSave: Omit<Task, 'id'> & { id?: string }) => {
    if (taskToSave.id) {
      setTasks(tasks.map(t => t.id === taskToSave.id ? { ...t, ...taskToSave } as Task : t));
    } else {
      // FIX: Corrected typo from `taskTosave` to `taskToSave`.
      setTasks([...tasks, { ...taskToSave, id: crypto.randomUUID() }]);
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
      handleCloseModal();
    }
  };


  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center p-4 relative transition-colors duration-300">
      <LoadingOverlay isLoading={isLoading} />
      <div className="w-full max-w-7xl mx-auto">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <TaskInput onGenerate={handleGenerateTasks} isLoading={isLoading} />
            {error && <ErrorDisplay message={error} />}
          </div>
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Calendar
              currentDate={currentDate}
              tasks={tasks}
              onNextMonth={handleNextMonth}
              onPrevMonth={handlePrevMonth}
              onGoToToday={handleGoToToday}
              onSelectTask={handleOpenPopover}
              onAddManualTask={handleOpenModalForNew}
            />
          </div>
        </main>
      </div>
       {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          task={selectedTask}
          date={modalDate}
        />
      )}
      {popoverTask && popoverPosition && (
        <TaskPopover
            task={popoverTask}
            position={popoverPosition}
            onClose={handleClosePopover}
            onEdit={handleEditFromPopover}
        />
      )}
    </div>
  );
};

export default App;