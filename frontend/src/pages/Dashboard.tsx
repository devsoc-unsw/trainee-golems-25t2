import React from "react";
import DotGrid from "../Components/DotGrid";
import Sidebar from "../Components/Sidebar";
import { useSidebar } from "../hooks/useSidebar";

const Dashboard: React.FC = () => {
  const { collapsed } = useSidebar();
  const currentTime = new Date();
  const hour = currentTime.getHours();

  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-950 relative overflow-hidden transition-colors duration-300">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 opacity-10 z-0">
        <DotGrid
          dotSize={3}
          gap={30}
          baseColor="#6366f1"
          activeColor="#8b5cf6"
          proximity={80}
        />
      </div>

      <div className="flex h-screen">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content Area */}
        <div
          className={`flex-1 overflow-auto p-6 transition-all duration-500 delay-100 relative z-10 ${
            collapsed ? "md:ml-20" : "md:ml-72"
          }`}
        >
          {/* Greeting Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
              {greeting}, User
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Notes Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-neutral-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">
                  Recent Notes
                </h3>
                <div className="flex space-x-3">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Upload New Note
                  </button>
                  <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
                    View All Notes
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* COMP1511 Note */}
                <div className="border border-slate-200 dark:border-neutral-700 rounded-lg p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                      COMP1511
                    </h4>
                    <span className="text-sm text-slate-500 dark:text-neutral-400">
                      30 min ago
                    </span>
                  </div>
                  
                  {/* Thumbnail and Content Row */}
                  <div className="flex space-x-4 mb-4">
                    {/* Thumbnail Placeholder */}
                    <div className="w-20 h-20 bg-slate-200 dark:bg-neutral-700 rounded-lg flex-shrink-0"></div>
                    
                    {/* Note Content */}
                    <div className="flex-1 bg-slate-100 dark:bg-neutral-900 rounded p-4 text-sm font-mono text-slate-700 dark:text-neutral-300 transition-colors duration-300">
                      #include &lt;template&gt;<br/>
                      Hello World
                    </div>
                  </div>
                  
                  {/* Audio Player Component */}
                  <div className="bg-slate-50 dark:bg-neutral-800 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <button className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors group-hover:scale-105">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Lecture 5: Object-Oriented Programming</div>
                        <div className="text-xs text-slate-500 dark:text-neutral-400">15:32 / 45:18</div>
                      </div>
                    </div>
                    
                    {/* Waveform Visual */}
                    <div className="flex items-end space-x-1 h-8">
                      {[2, 4, 6, 8, 12, 16, 14, 10, 8, 6, 4, 3, 5, 7, 9, 11, 13, 15, 12, 8].map((height, index) => (
                        <div 
                          key={index}
                          className="bg-purple-400 rounded-sm flex-1 hover:bg-purple-500 transition-colors"
                          style={{ height: `${height}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COMP1521 Note */}
                <div className="border border-slate-200 dark:border-neutral-700 rounded-lg p-6 hover:shadow-lg hover:border-yellow-300 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                      COMP1521
                    </h4>
                    <span className="text-sm text-slate-500 dark:text-neutral-400">
                      2 h ago
                    </span>
                  </div>
                  
                  {/* Thumbnail and Content Row */}
                  <div className="flex space-x-4 mb-4">
                    {/* Thumbnail Placeholder */}
                    <div className="w-20 h-20 bg-slate-200 dark:bg-neutral-700 rounded-lg flex-shrink-0"></div>
                    
                    {/* Note Content */}
                    <div className="flex-1 bg-slate-100 dark:bg-neutral-900 rounded p-4 text-sm font-mono text-slate-700 dark:text-neutral-300 transition-colors duration-300">
                      Level Language<br/>
                      Compiler<br/>
                      MIPS Assembly
                    </div>
                  </div>
                  
                  {/* Audio Player Component */}
                  <div className="bg-slate-50 dark:bg-neutral-800 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <button className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors group-hover:scale-105">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Tutorial 3: Assembly Basics</div>
                        <div className="text-xs text-slate-500 dark:text-neutral-400">8:15 / 32:45</div>
                      </div>
                    </div>
                    
                    {/* Waveform Visual */}
                    <div className="flex items-end space-x-1 h-8">
                      {[3, 5, 7, 9, 11, 13, 15, 17, 19, 16, 14, 12, 10, 8, 6, 4, 6, 8, 10, 12].map((height, index) => (
                        <div 
                          key={index}
                          className="bg-yellow-400 rounded-sm flex-1 hover:bg-yellow-500 transition-colors"
                          style={{ height: `${height}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COMP2521 Note */}
                <div className="border border-slate-200 dark:border-neutral-700 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                      COMP2521
                    </h4>
                    <span className="text-sm text-slate-500 dark:text-neutral-400">
                      1 day ago
                    </span>
                  </div>
                  
                  {/* Thumbnail and Content Row */}
                  <div className="flex space-x-4 mb-4">
                    {/* Thumbnail Placeholder */}
                    <div className="w-20 h-20 bg-slate-200 dark:bg-neutral-700 rounded-lg flex-shrink-0"></div>
                    
                    {/* Note Content */}
                    <div className="flex-1 bg-slate-100 dark:bg-neutral-900 rounded p-4 text-sm font-mono text-slate-700 dark:text-neutral-300 transition-colors duration-300">
                      Binary Tree Structure<br/>
                      Nodes: 1-15
                    </div>
                  </div>
                  
                  {/* Audio Player Component */}
                  <div className="bg-slate-50 dark:bg-neutral-800 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group-hover:scale-105">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Lecture 8: Tree Data Structures</div>
                        <div className="text-xs text-slate-500 dark:text-neutral-400">22:18 / 52:30</div>
                      </div>
                    </div>
                    
                    {/* Waveform Visual */}
                    <div className="flex items-end space-x-1 h-8">
                      {[4, 6, 8, 10, 12, 14, 16, 18, 20, 18, 16, 14, 12, 10, 8, 6, 8, 10, 12, 14].map((height, index) => (
                        <div 
                          key={index}
                          className="bg-blue-400 rounded-sm flex-1 hover:bg-blue-500 transition-colors"
                          style={{ height: `${height}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Overview Button */}
              <div className="mt-8">
                <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-lg">Listen AI Overview</span>
                </button>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-neutral-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base font-medium text-slate-700 dark:text-neutral-300">
                      7 days streak
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-6 h-6 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-base font-medium text-slate-700 dark:text-neutral-300">
                      12 hours best
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-base font-medium text-slate-700 dark:text-neutral-300">
                      Last session: 7 h
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
                Your Weekly Progress
              </h3>
              <p className="text-base text-slate-600 dark:text-neutral-400 mb-6">
                Focus time per day (h)
              </p>

              <div className="space-y-4">
                {[
                  { day: "Monday", width: "100%", value: 12 },
                  { day: "Tuesday", width: "67%", value: 8 },
                  { day: "Wednesday", width: "92%", value: 11 },
                  { day: "Thursday", width: "83%", value: 10 },
                  { day: "Friday", width: "58%", value: 7 },
                ].map(({ day, width, value }) => (
                  <div
                    key={day}
                    className="flex items-center space-x-4 transition-colors duration-300"
                  >
                    <span className="text-base text-slate-600 dark:text-neutral-400 w-20">
                      {day}
                    </span>
                    <div className="flex-1 bg-slate-200 dark:bg-neutral-700 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width }}
                      ></div>
                    </div>
                    <span className="text-base font-medium text-slate-800 dark:text-white w-10">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-neutral-400">
                  Study
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
