import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { fetchUserProfile } from "../Fetchers/LoginFetch";

interface UserInfoSummaryProps {
  collapsed: boolean;
}

const UserInfoSummary: React.FC<UserInfoSummaryProps> = ({ collapsed }) => {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load user info");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="mt-auto mb-10 mx-auto">
      {collapsed ? (
        // Just the profile icon when collapsed
        <div className="flex justify-center">
          <CgProfile className="size-10 font-bold" />
        </div>
      ) : (
        // Full profile container when expanded
        <button className="mt-auto flex items-center justify-between w-full mb-3 border-2 border-gray-400 rounded-[3rem] h-14 p-2">
          <CgProfile className="size-10 font-bold self-center" />
          <div className="w-full px-4">
            {loading ? (
              <p className="text-xs">Loading...</p>
            ) : error ? (
              <p className="text-xs text-red-500">{error}</p>
            ) : user ? (
              <>
                <p className={`font-semibold text-sm`}>
                  {user.name || "No Name"}
                </p>
                <p className={`text-xs`}>{user.email || "No Email"}</p>
              </>
            ) : null}
          </div>
        </button>
      )}
    </div>
  );
};

export default UserInfoSummary;
