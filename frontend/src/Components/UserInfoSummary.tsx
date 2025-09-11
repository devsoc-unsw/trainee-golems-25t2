import React from "react";
import { CgProfile } from "react-icons/cg";
import { useUser } from "@clerk/clerk-react";

interface UserInfoSummaryProps {
  collapsed: boolean;
}

const UserInfoSummary: React.FC<UserInfoSummaryProps> = ({ collapsed }) => {
  const { user, isLoaded } = useUser();
  return (
    <div className="mt-auto mb-2 mx-auto">
      {collapsed ? (
        // Just the profile picture when collapsed
        <div className="flex justify-center">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <CgProfile className="size-10 font-bold" />
          )}
        </div>
      ) : (
        // Full profile container when expanded
        <button className="mt-auto flex items-center justify-between w-full mb-1 border-2 border-gray-400 rounded-[3rem] h-14 p-2">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="size-10 rounded-full object-cover self-center"
            />
          ) : (
            <CgProfile className="size-10 font-bold self-center" />
          )}
          <div className="w-full px-4">
            {!isLoaded ? (
              <p className="text-xs">Loading...</p>
            ) : user ? (
              <>
                <p className={`font-semibold text-sm`}>
                  {user.fullName ||
                    user.firstName ||
                    user.username ||
                    "No Name"}
                </p>
                <p className={`text-xs`}>
                  {user.primaryEmailAddress?.emailAddress || "No Email"}
                </p>
              </>
            ) : (
              <p className="text-xs text-red-500">Failed to load user info</p>
            )}
          </div>
        </button>
      )}
    </div>
  );
};

export default UserInfoSummary;
