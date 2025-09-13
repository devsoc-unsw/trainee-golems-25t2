import FloatingIcon from "../Components/FloatingIcon";
import { Navbar } from "../Components/Navbar";
import Headers from "../Components/Headers";
import GetStartedButton from "../Components/GetStartedButton";
import productivity from "../assets/icons/productivity.png";
import marketplace from "../assets/icons/marketplace.png";
import accomodation from "../assets/icons/accomodation.png";
import aiLectureSlide from "../assets/icons/ai-lecture-slides.png";
import Ballpit from "../Components/Ballpit";

function Landing() {
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Ballpit */}
      <div className="w-full h-full fixed z-0">
        <Ballpit
          count={100}
          gravity={0.05}
          colors={[
            0x8b5cf6, // Original Purple
            0xffffff, // White
            0xa855f7, // Purple-500
            0x9333ea, // Violet-600
            0x7c3aed, // Violet-700
            0x6d28d9, // Violet-800
            0xc084fc, // Purple-400 (lighter)
            0xd8b4fe, // Purple-300 (pastel)
            0x5b21b6, // Purple-900 (deep)
            0xddd6fe, // Purple-200 (very light)
            0x4c1d95, // Purple-950 (darkest)
          ]}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
        />
      </div>

      {/* Navbar */}
      <Navbar brandName="StuVerse" className="relative z-50" />

      {/* Centered Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <GetStartedButton />
      </div>

      {/* Headers + Floating Icons */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <Headers className="mx-auto" />
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
  );
}

export default Landing;
