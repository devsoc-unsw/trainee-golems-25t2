import React from "react";

interface HeadersProps {
  className?: string;
}

export const Headers: React.FC<HeadersProps> = ({ className = "" }) => {
  return (
    <div className={`space-y-6 text-center ${className}`}>
      <div className="relative inline-block">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Your Student
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
            Assistance Tool
          </span>
        </h1>
        </div>

      <div className="relative">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-600 tracking-wide">
          <span className="relative">All-In-One Place</span>
        </p>
      </div>
    </div>
  );
};

export default Headers;
