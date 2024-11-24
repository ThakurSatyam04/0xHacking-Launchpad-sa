import React, { useState } from "react";
import ResourceDropdown from "../components/ResourceDropdown";

const Resource = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index)); // Toggle the same dropdown, or open a new one
  };
  return (
    <div className="min-h-screen bg-white dark:bg-[#1E1E1E] rounded-xl p-5 border border-[#E6EAF0] dark:border-[#343434]">
      <div className="flex items-center justify-between mb-4 text-[#3A3A3C] dark:text-white">
        <h1 className="dark:text-white text-xl font-bold">
          Beyond Abstraction - A Router Protocol & Pivot Hacker House
        </h1>
        <div>
          <p className="text-xl">Saturday 30 November</p>
          <span className="text-sm text-[#9CA3AF]">8:00 - 1 Dec 18:30</span>
        </div>
      </div>
      <hr className="dark:border-gray-700"/>
      <div className="flex flex-col items-center">
        <ResourceDropdown
          label="BUIDL domain"
          items={["Option 1", "Option 2", "Option 3", "Option 4"]}
          isOpen={openDropdownIndex === 0}
          onToggle={() => toggleDropdown(0)}
          // onSelect={handleSelect}
        />
        <ResourceDropdown
          label="Problem Statement"
          items={["Option 1", "Option 2", "Option 3", "Option 4"]}
          isOpen={openDropdownIndex === 1}
          onToggle={() => toggleDropdown(1)}
          // onSelect={handleSelect}
        />
        <ResourceDropdown
          label="Rules & Guidelines"
          items={["Option 1", "Option 2", "Option 3", "Option 4"]}
          isOpen={openDropdownIndex === 2}
          onToggle={() => toggleDropdown(2)}
          // onSelect={handleSelect}
        />
        <ResourceDropdown
          label="Hackathon Timeline"
          items={["Option 1", "Option 2", "Option 3", "Option 4"]}
          isOpen={openDropdownIndex === 3}
          onToggle={() => toggleDropdown(3)}
          // onSelect={handleSelect}
        />
        <ResourceDropdown
          label="Hackathon Timeline"
          items={["Option 1", "Option 2", "Option 3", "Option 4"]}
          isOpen={openDropdownIndex === 4}
          onToggle={() => toggleDropdown(4)}
          // onSelect={handleSelect}
        />
      </div>
    </div>
  );
};

export default Resource;
