import React from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { IoIosLogOut } from "react-icons/io";

interface LogoutButtonProps {
  collapsed: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <button
      className="flex items-center w-full mb-2 border-2 border-gray-400 rounded-[3rem] h-14 p-2"
      onClick={handleLogout}
    >
      <IoIosLogOut className="size-10 font-bold self-center" />
      {!collapsed && <p className="font-semibold text-sm m-2">Log Out</p>}
    </button>
  );
};

export default LogoutButton;
