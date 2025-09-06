import React from "react";
import { IoIosLogOut } from "react-icons/io";
import { logoutUser } from "../Fetchers/LoginFetch";

interface LogoutButtonProps {
  collapsed: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ collapsed }) => {
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <button className="flex items-center w-full mb-5 border-2 border-[#8B5CF6] rounded-[3rem] h-14 p-2" onClick={handleLogout}>
      <IoIosLogOut size={30} />
      {!collapsed && <p className="font-semibold text-sm m-2">Log Out</p>}
    </button>
  );
};

export default LogoutButton;