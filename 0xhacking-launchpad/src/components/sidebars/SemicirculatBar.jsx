import React from "react";

const SemiCircularProgressBar = ({ elapsedPercentage }) => {
  const radius = 40; // Radius of the semi-circle
  const circumference = Math.PI * radius; // Circumference of the circle
  const offset = circumference - (elapsedPercentage / 100) * circumference; // Calculate offset based on percentage

  return (
    <div style={{ position: "relative", width: "150px", height: "75px" }}>
      {/* SVG for Semi-Circular Progress Bar */}
      <svg
        viewBox="0 0 100 50"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%", // Make the SVG responsive
          height: "100%",
        }}
      >
        {/* Background Arc */}
        <path
          d="M 10 50 A 40 40 0 1 1 90 50" // Top semi-circle path
          fill="none"
          stroke="#06C270"
          strokeWidth="3"
        />

        {/* Progress Arc */}
        <path
          d="M 10 50 A 40 40 0 1 1 90 50" // Top semi-circle path
          fill="none"
          stroke="#F2F4F5"
          strokeWidth="3"
          strokeDasharray={circumference} // Full arc length
          strokeDashoffset={offset} // Dynamically update the offset
          style={{
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>
    </div>
  );
};

export default SemiCircularProgressBar;
