import React from "react";

interface GetStartedButtonProps {
  className?: string;
  onClick?: () => void;
}

export const GetStartedButton: React.FC<GetStartedButtonProps> = ({
  className = "",
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 rounded-2xl bg-black focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ${className}`}
    >
      <span className="relative flex items-center gap-2">Get Started</span>
    </button>
  );
};

export default GetStartedButton;
