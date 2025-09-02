import React from "react";
import { CgProfile } from "react-icons/cg";

interface UserInfoSummaryProps {
  collapsed: boolean;
}

const UserInfoSummary: React.FC<UserInfoSummaryProps> = ({ collapsed }) => {
  return (
    <button className="mt-auto flex items-center justify-between w-full mb-10 border-2 border-gray-400 rounded-[3rem] h-14 p-2">
      <CgProfile className="size-10 font-bold self-center" />
      {!collapsed && (
        <div className="w-full px-4">
          <p className={`font-semibold text-sm`}>Example</p>
          <p className={`text-xs`}>Example@gmail.com</p>
        </div>
      )}
    </button>
  );
};

export default UserInfoSummary;
