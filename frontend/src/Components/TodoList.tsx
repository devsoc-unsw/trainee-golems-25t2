import React, { useState, useRef, useEffect } from "react";
import styles from "./todo-animations.module.css";
import { FaTrash } from "react-icons/fa";
import { todoService, Task } from "../services/todoService";

const TodoListWidget: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [deleting, setDeleting] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevTasksRef = useRef<string[]>([]);

  // Load tasks from database on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTasks = await todoService.getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Track previous task ids for slide-in animation
  React.useEffect(() => {
    prevTasksRef.current = tasks.map((t) => t.id);
  }, [tasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const newTask = await todoService.createTask({
        title: input.trim(),
        description: undefined,
      });
      setTasks((prev) => [newTask, ...prev]);
      setInput("");
      setError(null);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Please try again.");
    }
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const updatedTask = await todoService.updateTask(id, {
        isCompleted: !task.isCompleted,
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      setError(null);
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting((prev) => [...prev, id]);

    try {
      await todoService.deleteTask(id);
      setTimeout(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        setDeleting((prev) => prev.filter((delId) => delId !== id));
      }, 300); // match slide-out duration
      setError(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task. Please try again.");
      setDeleting((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const sortedTasks = [
    ...tasks.filter((t) => !t.isCompleted),
    ...tasks.filter((t) => t.isCompleted),
  ];

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 dark:text-gray-100 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Today's Tasks</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading tasks...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 dark:text-gray-100 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Today's Tasks</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAddTask} className="flex mb-4 gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !input.trim()}
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {sortedTasks.map((task) => {
          // Animation logic
          const isNew = !prevTasksRef.current.includes(task.id);
          const isDeleting = deleting.includes(task.id);
          return (
            <li
              key={task.id}
              className={`flex items-center group bg-gray-50 rounded-lg px-3 py-2 transition-all duration-300 ${
                task.isCompleted ? "text-gray-400" : "hover:bg-blue-50"
              } ${isNew ? styles["slide-in"] : ""} ${
                isDeleting ? styles["slide-out"] : ""
              }`}
              style={{
                ...(isDeleting ? { pointerEvents: "none" } : {}),
              }}
            >
              <button
                onClick={() => handleToggle(task.id)}
                className={`w-6 h-6 mr-3 flex items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                  task.isCompleted
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-400"
                }`}
                aria-label={
                  task.isCompleted ? "Mark as incomplete" : "Mark as complete"
                }
              >
                {task.isCompleted && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 min-w-0 text-base font-medium select-none transition-all duration-200 truncate ${
                  task.isCompleted ? styles["completed-anim"] : ""
                }`}
                title={task.title}
              >
                {task.title}
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
