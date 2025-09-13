import React from "react";

import Timer from "../Components/Timer";
import Sidebar from "../Components/Sidebar";
import DotGrid from "../Components/DotGrid";
import TodoListWidget from "../Components/TodoList";
import SpotifyModule from "../Components/Spotify";
import { useSidebar } from "../hooks/useSidebar";

const Productivity: React.FC = () => {
  const { collapsed } = useSidebar();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-950 relative overflow-hidden transition-colors duration-300">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 h-full w-full opacity-60 z-0">
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor="#312e81" // darker indigo-900
          activeColor="#6366f1"
          proximity={80}
        />
      </div>

      <div className="flex h-full">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content Area */}
        <div
          className={`flex-1 h-full overflow-hidden p-6 transition-all duration-500 delay-100 relative z-10 ${
            collapsed ? "md:ml-20" : "md:ml-72"
          }`}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 place-items-center">
              {/* Todo List (Left) */}
              <div className="order-2 md:order-1 flex flex-col items-center">
                <TodoListWidget />
              </div>
              {/* Pomodoro Timer (Top Center) */}
              <div className="order-1 md:order-2 flex flex-col items-center md:col-start-2 md:row-start-1">
                <div className="bg-white dark:bg-neutral-900 dark:text-gray-100 rounded-2xl shadow-xl p-8 w-full flex flex-col items-center">
                  <Timer />
                </div>
              </div>
              {/* Spotify Widget (Right) */}
              <div className="order-3 md:order-3 flex flex-col items-center">
                <div className="w-full max-w-md">
                  <SpotifyModule />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productivity;
