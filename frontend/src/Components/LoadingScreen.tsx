import React from "react";
import logo from "../assets/icons/logo.png";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="StuVerse Logo"
            className="w-16 h-16 animate-pulse"
          />
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">StuVerse</h2>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
