import React, { useState } from 'react';
import DotGrid from '../Components/DotGrid';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentTime = new Date();
  const hour = currentTime.getHours();
  
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <DotGrid 
          dotSize={6} 
          gap={40} 
          baseColor="#6366f1" 
          activeColor="#8b5cf6"
          proximity={100}
        />
      </div>
      
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className={`relative flex flex-col bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          {/* Logo and Collapse Button */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h1 className={`font-bold text-xl text-slate-800 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                StuVerse
              </h1>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Feature Navigation */}
          <div className="p-4">
            <h3 className={`font-semibold text-slate-600 mb-4 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              Feature
            </h3>
            <nav className="space-y-2">
              {/* Dashboard - Active */}
              <div className="bg-purple-100 text-purple-700 rounded-lg p-3 flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className={sidebarCollapsed ? 'hidden' : 'block'}>Dashboard</span>
              </div>

              {/* AI Notes Conversion */}
              <div className="text-slate-600 hover:bg-slate-100 rounded-lg p-3 flex items-center space-x-3 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={sidebarCollapsed ? 'hidden' : 'block'}>AI notes conversion</span>
              </div>

              {/* Productivity */}
              <div className="text-slate-600 hover:bg-slate-100 rounded-lg p-3 flex items-center space-x-3 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={sidebarCollapsed ? 'hidden' : 'block'}>Productivity</span>
              </div>

              {/* Setting */}
              <div className="text-slate-600 hover:bg-slate-100 rounded-lg p-3 flex items-center space-x-3 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={sidebarCollapsed ? 'hidden' : 'block'}>Setting</span>
              </div>
            </nav>
          </div>

          {/* User Profile - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <div className={sidebarCollapsed ? 'hidden' : 'block'}>
                <p className="text-sm font-medium text-slate-800">USERNAME</p>
                <p className="text-xs text-slate-500">Example@gmail.com</p>
              </div>
              <button className={`ml-auto p-1 rounded hover:bg-slate-100 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Greeting Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
              {greeting}, User
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Notes Section - Made Bigger */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-slate-800">Recent Notes</h3>
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
                <div className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-800">COMP1511</h4>
                    <span className="text-sm text-slate-500">30 min ago</span>
                  </div>
                  <div className="bg-slate-100 rounded p-4 text-sm font-mono text-slate-700">
                    #include &lt;template&gt;<br/>
                    class Business &#123; ... &#125;
                  </div>
                </div>

                {/* COMP1521 Note */}
                <div className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-800">COMP1521</h4>
                    <span className="text-sm text-slate-500">2 h ago</span>
                  </div>
                  <div className="bg-slate-100 rounded p-4 text-sm font-mono text-slate-700">
                    Level Language<br/>
                    Compiler<br/>
                    MIPS Assem
                  </div>
                </div>

                {/* COMP2521 Note */}
                <div className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-800">COMP2521</h4>
                    <span className="text-sm text-slate-500">1 day ago</span>
                  </div>
                  <div className="bg-slate-100 rounded p-4 text-sm font-mono text-slate-700">
                    Binary Tree Structure<br/>
                    Nodes: 1-15
                  </div>
                </div>
              </div>

              {/* AI Overview Button */}
              <div className="mt-8">
                <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">Listen AI Overview</span>
                </button>
              </div>
            </div>

            {/* Weekly Progress - Made Bigger */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium text-slate-700">7 days streak</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-base font-medium text-slate-700">12 hours best</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base font-medium text-slate-700">Last session: 7 h</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">Your Weekly Progress</h3>
              <p className="text-base text-slate-600 mb-6">Focus time per day (h)</p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-base text-slate-600 w-20">Monday</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-base font-medium text-slate-800 w-10">12</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-base text-slate-600 w-20">Tuesday</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  <span className="text-base font-medium text-slate-800 w-10">8</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-base text-slate-600 w-20">Wednesday</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-base font-medium text-slate-800 w-10">11</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-base text-slate-600 w-20">Thursday</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                  <span className="text-base font-medium text-slate-800 w-10">10</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-base text-slate-600 w-20">Friday</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                  <span className="text-base font-medium text-slate-800 w-10">7</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Study</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
