import React, { useRef } from "react";
import TeamCard from "../components/TeamCard";
import LeftArrow from "../assets/Left_arrow.svg"
import RightArrow from "../assets/Right_arrow.svg"

const TeamMembers = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    // Scroll the container left by 300px (adjust as needed)
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    // Scroll the container right by 300px (adjust as needed)
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  return (
    <div className="content-area bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6EAF0] dark:border-[#343434]">
      <div className="flex items-center justify-between">
      <h2 className="font-semibold text-2xl text-gray-700 dark:text-white p-5">Team Members</h2>
      <div className="p-5 flex gap-4">
        {/* Scroll Buttons */}
        <button
          className="transform bg-white dark:bg-[#1E1E1E] border rounded-md p-0.5 dark:border-gray-600"
          onClick={scrollLeft}
        >
          <img src={LeftArrow} alt="" className="bg-white dark:bg-[#1E1E1E] "/>
        </button>
        <button
          className="transform bg-white dark:bg-[#1E1E1E] border rounded-md p-0.5 dark:border-gray-600"
          onClick={scrollRight}
        >
          <img src={RightArrow} alt=""  className="bg-white dark:bg-[#1E1E1E]"/>
        </button>
      </div>

      </div>
      <hr className="border border-[#E6EAF0] dark:border-[#343434]"/>
      {/* Horizontal Scroll Wrapper */}
      <div className="relative">

        {/* Scrollable Team Cards */} 
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto p-5 flex gap-4 custom-scrollbar"
        >
          <TeamCard />
          <TeamCard />
          <TeamCard />
          <TeamCard />
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
