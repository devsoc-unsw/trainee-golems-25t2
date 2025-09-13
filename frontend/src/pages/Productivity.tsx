import React from 'react';

import Timer from '../Components/Timer';
import Sidebar from '../Components/Sidebar';
import DotGrid from '../Components/DotGrid';
import TodoListWidget from '../Components/TodoList';
import MusicPlayer from '../Components/MusicPlayer';
import { useSidebar } from '../hooks/useSidebar';

const Productivity: React.FC = () => {
	const { collapsed } = useSidebar();

	return (
		<div className="min-h-screen h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-950 relative overflow-hidden transition-colors duration-300">
			{/* Dot Grid Background */}
			   <div className="absolute inset-0 min-h-screen h-full w-full opacity-60 z-0">
				   <DotGrid
					   dotSize={3}
					   gap={24}
					   baseColor="#312e81"  // darker indigo-900
					   activeColor="#6366f1"
					   proximity={80}
				   />
			   </div>

			   <div className="flex min-h-screen h-full">
				{/* Sidebar Component */}
				<Sidebar />

				{/* Main Content Area */}
				   <div
					   className={`flex-1 min-h-screen h-full overflow-auto p-6 transition-all duration-500 delay-100 relative z-10 ${collapsed ? "md:ml-20" : "md:ml-72"}`}
				   >
					   <div className="w-full h-full min-h-screen flex flex-col items-start">
						   <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start mt-0">
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
							{/* Music Player (Right) */}
							<div className="order-3 md:order-3 flex flex-col items-center">
								<MusicPlayer />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Productivity;
