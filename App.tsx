import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { TaskInput } from './components/TaskInput';
import { TaskModal } from './components/TaskModal';
import { generateTasksFromPrompt } from './services/geminiService';
import { Task } from './types';
import { Header } from './components/Header';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ErrorDisplay } from './components/ErrorDisplay';

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

  const handleSaveTask = (taskToSave: Omit<Task, 'id'> & { id?: string }) => {
    if (taskToSave.id) {
      setTasks(tasks.map(t => t.id === taskToSave.id ? { ...t, ...taskToSave } as Task : t));
    } else {
      setTasks([...tasks, { ...taskToSave, id: crypto.randomUUID() }]);
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    handleCloseModal();
  };


  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 relative transition-colors duration-300">
      <LoadingOverlay isLoading={isLoading} />
      <div className="w-full max-w-7xl mx-auto">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <TaskInput onGenerate={handleGenerateTasks} isLoading={isLoading} />
            {error && <ErrorDisplay message={error} />}
          </div>
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Calendar
              currentDate={currentDate}
              tasks={tasks}
              onNextMonth={handleNextMonth}
              onPrevMonth={handlePrevMonth}
              onGoToToday={handleGoToToday}
              onSelectTask={handleOpenModalForEdit}
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
    </div>
  );
};

export default App;
