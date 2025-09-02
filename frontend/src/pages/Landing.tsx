import React from "react";
import { useNavigate } from "react-router-dom";
import Ballpit from "../Components/Ballpit";
import logo from "../assets/logo.png";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Ball Pit animation */}
      <Ballpit />

      {/* Overlayed Heading and Subheading */}
      <div className="relative z-10 flex flex-col items-center pt-20">
        <img src={logo} alt="Logo" className="w-16 h-16 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-2 drop-shadow-lg">
          Your Student Assistance Tool
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-blue-300 drop-shadow-lg">
          All-In-One Place
        </h2>

        {/* Enter Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl shadow-lg transition"
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Landing;