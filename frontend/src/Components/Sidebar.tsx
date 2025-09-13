import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import stuverse from "../assets/stuverse-logo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { MdOutlineSell } from "react-icons/md";
import { LuHouse } from "react-icons/lu";
import UserInfoSummary from "./UserInfoSummary";
import { useSidebar } from "../hooks/useSidebar";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogOutButton";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { collapsed, toggleCollapsed } = useSidebar();
  const widthClass = collapsed ? "md:w-16" : "md:w-64";
  const navigate = useNavigate();

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
      collapsed ? "4rem" : "16rem"
    );
  }, [collapsed]);

  return (
    <>
      {/* Floating Theme Toggle - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <aside
        className={`md:flex ${widthClass} md:flex-col md:fixed md:inset-y-0 
          border-4 border-neutral-200 bg-white/70 dark:bg-neutral-900 
          supports-[backdrop-filter]:bg-white/60 backdrop-blur rounded-[3rem] 
          duration-300 mt-3 ml-3 mb-6`}
      >
        {/* Header with logo + hamburger */}
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
              className={`size-10 ${
                collapsed ? "flex w-full justify-center" : ""
              }`}
            />
            {!collapsed && <p className="text-2xl mt-1.5">StuVerse</p>}
          </div>
          <button
            className={`mr-3 ${
              collapsed
                ? "flex w-full justify-center rotate-90 duration-300"
                : "duration-300"
            }`}
            onClick={toggleCollapsed}
          >
            <RxHamburgerMenu className="size-6 font-bold self-center" />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-3 mt-2 text-sm">
          {!collapsed && <p className="font-semibold mb-2 text-lg">Feature</p>}
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`flex items-center gap-2 py-2 rounded-md
              hover:bg-blue-200 dark:hover:bg-blue-800 w-full 
              ${collapsed ? "justify-center" : "justify-start"}`}
              onClick={() => {
                if (item.name === "Productivity") {
                  navigate("/productivity");
                } else if (item.name === "Dashboard") {
                  navigate("/dashboard");
                } else if (item.name === "Marketplace") {
                  navigate("/marketplace");
                }
              }}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </button>
          ))}
          <div className="border-2 border-gray-400 rounded-lg my-2" />

          <div
            className={`flex items-center gap-2 py-2 rounded-md 
            hover:bg-blue-200 dark:hover:bg-blue-800 
            ${collapsed ? "justify-center" : "justify-start"}`}
          >
            <IoSettingsOutline className="size-6" />
            {!collapsed && <span>Settings</span>}
          </div>
        </div>

        {/* User info */}
        <div className="m-auto mb-1">
          <UserInfoSummary collapsed={collapsed} />
          <LogoutButton collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
