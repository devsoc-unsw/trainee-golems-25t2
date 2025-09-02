import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import stuverse from "../assets/stuverse-logo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { MdOutlineSell } from "react-icons/md";
import { LuHouse } from "react-icons/lu";
import UserInfoSummary from "./UserInfoSummary";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const widthClass = collapsed ? "md:w-16" : "md:w-64";

  const navItems = [
    { name: "Dashboard", icon: <MdOutlineDashboard className="size-6" /> },
    {
      name: "AI Notes Conversion",
      icon: <FaRegNoteSticky className="size-6" />,
    },
    { name: "Productivity", icon: <FaArrowUpRightDots className="size-6" /> },
    { name: "Marketplace", icon: <MdOutlineSell className="size-6" /> },
    { name: "Student Housing", icon: <LuHouse className="size-6" /> },
  ];

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "4rem px-2" : "16rem"
    );
  }, [collapsed]);

  return (
    <aside
      className={` md:flex ${widthClass} md:flex-col md:fixed md:inset-y-0 border-4 border-neutral-200 
								bg-white/70 supports-[backdrop-filter]:bg-white/60 backdrop-blur rounded-[3rem] 
								duration-500 delay-100 mt-3 ml-3 mr-3 mb-6 h-full 4rem`}
    >
      <div
        className={`w-full rounded-t-[3rem] py-4 ${
          collapsed ? "block self-center" : "flex justify-between"
        }`}
      >
        <div
          className={`inline-flex gap-2 p-2 mb-2 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <img
            src={stuverse}
            alt="logo"
            className={`size-10  ${
              collapsed ? "flex w-full justify-center" : ""
            }`}
          />
          {collapsed ? null : <p className="text-2xl mt-1.5">StuVerse</p>}
        </div>
        <button
          className={`mr-3 ${
            collapsed
              ? "flex w-full justify-center rotate-90 duration-500 delay-100"
              : "duration-500 delay-100"
          } `}
          onClick={() => setCollapsed(!collapsed)}
        >
          <RxHamburgerMenu className="size-6 font-bold self-center" />
        </button>
      </div>

      <div className="px-3 mt-2 text-sm">
        <p
          className={`${
            collapsed ? "hidden" : "block"
          } font-semibold mb-2 text-lg`}
        >
          Feature
        </p>
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`flex items-center gap-2 py-2 rounded-md hover:bg-blue-200 w-full ${
              collapsed ? "justify-center" : "justify-start"
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </button>
        ))}
        <div className="border-2 border-gray-400 rounded-lg my-2" />

        <div
          className={`flex items-center gap-2 py-2 rounded-md hover:bg-blue-200 ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <IoSettingsOutline className="size-6" />
          {!collapsed && <span>Settings</span>}
        </div>
      </div>

      <UserInfoSummary collapsed={collapsed} />
    </aside>
  );
};

export default Sidebar;
