import React from "react";
import CrownIcon from "../assets/Crown_Icons.svg";

const TeamCard = () => {
  return (
    <div className="min-w-[250px] border border-[#E6EAF0] dark:border-[#343434]  p-2 rounded-lg flex flex-col gap-3">
      <div className="w-full flex justify-between">
        <p>
          Team <span className="text-[#06C270] font-semibold">Harpoon</span>
        </p>
        {/* If he is the captain */}
        {/* <button className="flex gap-1 items-center text-sm text-[#07C271] bg-[#F0F9F4] rounded-full pl-2 pr-2 pb-0.5 ">
          Captain <img src={CrownIcon} alt="" />
        </button> */}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col">
            <span className="text-gray-500">Username</span>
            <span>Jinx_007</span>
        </div>
        <div className="flex flex-col">
            <span className="text-gray-500">Full Name</span>
            <span>Vikas Moduri</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
