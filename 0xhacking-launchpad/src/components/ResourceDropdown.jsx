import React from "react";

const ResourceDropdown = ({ label, items, onSelect, isOpen, onToggle }) => {
  const handleSelect = (item) => {
    onSelect && onSelect(item); // Notify the parent of the selected item
    onToggle(); // Close the dropdown after selection
  };

  return (
    <div className="relative w-full mt-6 "> {/* Add spacing */}
      {/* Dropdown Header */}
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full px-4 py-2 text-gray-700 dark:text-[#7A7A7A] border border-[#E6EAF0] dark:border-[#343434] rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 dark:bg-[#1E1E1E]"
      >
        <span>{label}</span>
        {/* Icon toggles based on `isOpen` */}
        <span className="text-gray-500 text-xl font-bold">{isOpen ? "-" : "+"}</span>
      </button>

      {/* Dropdown Items */}
      {isOpen && (
        <ul className="w-full bg-white border border-[#E6EAF0] dark:border-[#343434] rounded-lg shadow-lg mt-2 max-h-40 overflow-y-auto dark:bg-[#1E1E1E]">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 text-gray-700 dark:text-[#7A7A7A] hover:bg-gray-100 dark:hover:bg-gray-700  cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResourceDropdown;
