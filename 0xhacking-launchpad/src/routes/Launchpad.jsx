import React from "react";
import LaunchPadForm from "../components/forms/LaunchPadForm";
import RightSidebar from "../components/sidebars/RightSidebar";
import TeamMembers from "./TeamMembers";

const Launchpad = () => {
  return (
    <div className="flex justify-between gap-5">
      {/* Team Details */}
      <div className="w-full flex flex-col gap-4">
        <TeamMembers />
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl min-h-screen border border-[#E6EAF0] dark:border-[#343434]">
          <h2 className="w-full font-semibold text-2xl text-[#3A3A3C] dark:text-white p-5">
            Launch Pad
          </h2>
          <hr className=" dark:border-[#343434]"/>
          {/* Launchpad Form */}
          <div className="p-5">
            <LaunchPadForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Launchpad;
