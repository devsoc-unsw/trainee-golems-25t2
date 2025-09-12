import React from 'react';

import Timer from '../Components/Timer';
import Sidebar from '../Components/Sidebar';
import DotGrid from '../Components/DotGrid';
import TodoListWidget from '../Components/TodoList';
import { useSidebar } from '../hooks/useSidebar';

const Productivity: React.FC = () => {
	const { collapsed } = useSidebar();

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
						className={`flex-1 overflow-auto p-6 transition-all duration-500 delay-100 relative z-10 ${collapsed ? "md:ml-20" : "md:ml-72"}`}
					>
						<div className="w-full h-full flex flex-col items-center justify-center">
							<div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
								{/* Todo List (Left) */}
								<div className="order-2 md:order-1">
									<TodoListWidget />
								</div>
								{/* Pomodoro Timer (Center) */}
								<div className="order-1 md:order-2 flex flex-col items-center">
									<div className="bg-white rounded-2xl shadow-xl p-8 w-full flex flex-col items-center">
										<Timer />
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
