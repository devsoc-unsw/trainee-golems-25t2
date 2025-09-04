import React from "react";
import { useNavigate } from "react-router-dom";
import Ballpit from "../Components/Ballpit";
import logo from "../assets/logo.png";
import productivity from "../assets/icons/productivity.png";
import marketplace from "../assets/icons/marketplace.png";
import accomodation from "../assets/icons/accomodation.png";
import aiLectureSlide from "../assets/icons/ai-lecture-slides.png";
import DotGrid from "../Components/DotGrid";
import FloatingIcon from "../Components/FloatingIcon";

const Landing: React.FC = () => {
  const icons = [
    {
      src: productivity,
      posx: "top-44",
      posy: "left-16",
      rotate: "rotate-12",
    },
    {
      src: marketplace,
      posx: "bottom-44",
      posy: "right-20",
      rotate: "rotate-6",
    },
    {
      src: accomodation,
      posx: "bottom-60",
      posy: "left-36",
      rotate: "-rotate-6",
    },
    {
      src: aiLectureSlide,
      posx: "top-44",
      posy: "right-16",
      rotate: "-rotate-12",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-white relative overflow-hidden">
      {/* Ball Pit animation - absolutely positioned at bottom, behind overlay */}
      <div className="absolute bottom-0 left-0 w-full h-full z-0 pointer-events-none">
        <Ballpit
          count={100}
          gravity={0.7}
          friction={0.954}
          wallBounce={0.95}
          followCursor={false}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-full z-0 pointer-events-none">
        <DotGrid
          dotSize={2}
          gap={28}
          baseColor="#111"
          activeColor="#111"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      {/* Overlayed Heading and Subheading */}
      <div className="relative z-10 flex flex-col items-center pt-20">
        <img src={logo} alt="Logo" className="w-16 h-16 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-2 drop-shadow-lg text-black">
          Your Student Assistance Tool
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-blue-300 drop-shadow-lg">
          All-In-One Place
        </h2>

        {/* Enter Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-6 py-3 bg-white hover:bg-black text-black hover:text-white text-lg 
										font-semibold rounded-2xl shadow-xl transition duration-300 delay-150"
        >
          Get Started
        </button>
      </div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {icons.map(({ src, posx, posy, rotate }, index) => (
            <FloatingIcon
              key={index}
              image={src}
              posx={posx}
              posy={posy}
              rotate={rotate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
