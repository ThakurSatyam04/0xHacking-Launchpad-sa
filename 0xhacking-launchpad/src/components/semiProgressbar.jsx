import React, { useEffect, useState } from "react";

const SemiCircularProgressBar = ({ startTime, endTime }) => {
  const [progress, setProgress] = useState(0); // Start with no progress
  const [elapsedTime, setElapsedTime] = useState(0); // Time passed since start

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();

      if (now >= endTime) {
        setElapsedTime(endTime - startTime); // Set elapsed to total duration
        setProgress(100); // Full progress
        return;
      }

      const elapsed = Math.max(0, now - startTime); // Time passed
      const totalDuration = endTime - startTime; // Total hackathon duration
      const newProgress = Math.min(100, (elapsed / totalDuration) * 100); // Calculate progress

      setElapsedTime(elapsed); // Update elapsed time
      setProgress(newProgress); // Update progress bar
    };

    // Start interval to update timer and progress every second
    const interval = setInterval(updateTimer, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  // Format time into HH:mm:ss
  const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Semi-Circular Progress Bar */}
      <div className="relative w-28 h-16 overflow-hidden">
        <div
          style={{
            background: `conic-gradient(
              #07C271 ${progress * 1.8}deg,
              #E6E6E6 ${progress * 1.8}deg 180deg
            )`,
            borderRadius: "100% 100% 0 0", // Semi-circle shape
          }}
          className="w-full h-full"
        ></div>
      </div>

      {/* Timer in the center */}
      <div className="absolute top-8 text-center">
        <span className="text-xl font-bold">{formatTime(elapsedTime)}</span>
      </div>
    </div>
  );
};

export default SemiCircularProgressBar;
