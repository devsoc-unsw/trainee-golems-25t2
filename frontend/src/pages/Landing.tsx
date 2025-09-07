import FloatingIcon from "../Components/FloatingIcon";
import { Navbar } from "../Components/Navbar";
import productivity from "../assets/icons/productivity.png";
import marketplace from "../assets/icons/marketplace.png";
import accomodation from "../assets/icons/accomodation.png";
import aiLectureSlide from "../assets/icons/ai-lecture-slides.png";
import DotGrid from "../Components/DotGrid";
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
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          zIndex: "1",
        }}
      >
        <Ballpit
          count={100}
          gravity={0.1}
		  colors={[0x8b5cf6, 0xffffff, 0x374151]}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
        />
      </div>

      <Navbar brandName="StuVerse" className="relative z-50" />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Your Student Assistant
          </h1>
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
}

export default Landing;
