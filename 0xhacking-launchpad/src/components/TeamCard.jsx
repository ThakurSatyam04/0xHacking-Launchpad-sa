import React from "react";

const TeamCard = ({ member }) => {
  // Check if member data exists, otherwise render empty card
  if (!member) {
    return (
      <div className="min-w-[250px] border border-[#E6EAF0] dark:border-[#343434] p-2 rounded-lg flex flex-col gap-3">
        <div className="w-full flex justify-between">
          <p>
            Team <span className="text-[#06C270] font-semibold">No Team</span>
          </p>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-gray-500">Username</span>
            <span>-</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Full Name</span>
            <span>-</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[250px] border border-[#E6EAF0] dark:border-[#343434] p-2 rounded-lg flex flex-col gap-3">
      <div className="w-full flex justify-between">
        <p>
          Team <span className="text-[#06C270] font-semibold">{member.teamname || "No Team"}</span>
        </p>
        {member.isCaptain && (
          <button className="flex gap-1 items-center text-sm text-[#07C271] bg-[#F0F9F4] rounded-full pl-2 pr-2 pb-0.5">
            Captain{/* <img src={CrownIcon} alt="Crown Icon" /> */}
          </button>
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-gray-500">Username</span>
          <span>{member.username || "-"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Full Name</span>
          <span>{member.fullname || "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
