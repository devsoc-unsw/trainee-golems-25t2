import { Navbar } from "../Components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Welcome to MyApp
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            A full-stack application built with React, TypeScript, Tailwind CSS,
            and Node.js
          </p>
          <div className="mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
