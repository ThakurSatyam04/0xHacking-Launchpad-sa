import React, { useRef } from "react";
import { useSelector } from "react-redux"; // Importing useSelector to access Redux store
import TeamCard from "../components/TeamCard";
import LeftArrow from "../assets/Left_arrow.svg";
import RightArrow from "../assets/Right_arrow.svg";

const TeamMembers = () => {
  const scrollRef = useRef(null);

  // Get team data from Redux store
  const teamData = useSelector((state) => state.profile.teamData || []);

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Default to 4 empty cards if no team data is available
  const teamMembersToDisplay = teamData.length > 0 ? teamData : Array.from({ length: 4 });

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
            <img src={LeftArrow} alt="Left Arrow" className="bg-white dark:bg-[#1E1E1E]" />
          </button>
          <button
            className="transform bg-white dark:bg-[#1E1E1E] border rounded-md p-0.5 dark:border-gray-600"
            onClick={scrollRight}
          >
            <img src={RightArrow} alt="Right Arrow" className="bg-white dark:bg-[#1E1E1E]" />
          </button>
        </div>
      </div>
      <hr className="border border-[#E6EAF0] dark:border-[#343434]" />
      {/* Horizontal Scroll Wrapper */}
      <div className="relative">
        {/* Scrollable Team Cards */}
        <div ref={scrollRef} className="w-full overflow-x-auto p-5 flex gap-4 custom-scrollbar">
          {teamMembersToDisplay.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
