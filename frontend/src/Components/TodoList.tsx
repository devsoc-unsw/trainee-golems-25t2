import React, { useState, useRef, useEffect } from 'react';
import styles from './todo-animations.module.css';
import { FaTrash } from 'react-icons/fa';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}



const LOCAL_STORAGE_KEY = 'todos-auto-save';

const TodoListWidget: React.FC = () => {
  // Load tasks from localStorage on mount
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as Task[];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [deleting, setDeleting] = useState<number[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const nextId = useRef(1);
  const prevTasksRef = useRef<number[]>([]);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    const savedNextId = localStorage.getItem('todoNextId');
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
      }
    }
    
    if (savedNextId) {
      try {
        nextId.current = parseInt(savedNextId, 10);
      } catch (error) {
        console.error('Error parsing saved nextId:', error);
      }
    }
    
    setIsInitialLoadComplete(true);
  }, []);

  // Save tasks to localStorage whenever tasks change (but only after initial load)
  useEffect(() => {
    if (isInitialLoadComplete) {
      localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }
  }, [tasks, isInitialLoadComplete]);

  // Save nextId to localStorage whenever it changes
  const saveNextId = () => {
    localStorage.setItem('todoNextId', nextId.current.toString());
  };

  // Track previous task ids for slide-in animation
  useEffect(() => {
    prevTasksRef.current = tasks.map(t => t.id);
  }, [tasks]);

  // Auto-save tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks(prev => [
      { id: nextId.current++, text: input.trim(), completed: false },
      ...prev
    ]);
    saveNextId(); // Save the updated nextId to localStorage
    setInput('');
  };

  const handleToggle = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id: number) => {
    setDeleting(prev => [...prev, id]);
    setTimeout(() => {
      setTasks(prev => prev.filter(task => task.id !== id));
      setDeleting(prev => prev.filter(delId => delId !== id));
    }, 300); // match slide-out duration
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const sortedTasks = [
    ...tasks.filter(t => !t.completed),
    ...tasks.filter(t => t.completed)
  ];

  return (
  <div className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 dark:text-gray-100 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Today's Tasks</h2>
      <form onSubmit={handleAddTask} className="flex mb-4 gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {sortedTasks.map(task => {
          // Animation logic
          const isNew = !prevTasksRef.current.includes(task.id);
          const isDeleting = deleting.includes(task.id);
          return (
            <li
              key={task.id}
              className={`flex items-center group bg-gray-50 rounded-lg px-3 py-2 transition-all duration-300 ${
                task.completed ? 'text-gray-400' : 'hover:bg-blue-50'
              } ${
                isNew ? styles['slide-in'] : ''
              } ${
                isDeleting ? styles['slide-out'] : ''
              }`}
              style={{
                ...(isDeleting ? { pointerEvents: 'none' } : {})
              }}
            >
              <button
                onClick={() => handleToggle(task.id)}
                className={`w-6 h-6 mr-3 flex items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                  task.completed
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
                aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 min-w-0 text-base font-medium select-none transition-all duration-200 truncate ${task.completed ? styles['completed-anim'] : ''}`}
                title={task.text}
              >
                {task.text}
              </span>
              <div className="flex-shrink-0 flex items-center justify-center ml-2">
                <button
                  onClick={() => handleDelete(task.id)}
                  className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 rounded-full"
                  aria-label="Delete task"
                  tabIndex={0}
                  disabled={isDeleting}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 text-sm text-gray-500 text-right">
        {completedCount} of {tasks.length} tasks completed
      </div>
    </div>
  );
};

export default TodoListWidget;
