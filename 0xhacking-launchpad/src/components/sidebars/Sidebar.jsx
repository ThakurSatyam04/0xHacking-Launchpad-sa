import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { DataContext } from "../../contexts/DataProvider";

const Sidebar = () => {
  const {
    steps,
    checkpointOneStatus,
    checkpointTwoStatus,
    checkpointThreeStatus,
    checkpointFourStatus,
    checkpointFiveStatus,
  } = useContext(DataContext);

  const [checkPointsTimes, setCheckPointsTimes] = useState([]);
  const [enabledCheckpoints, setEnabledCheckpoints] = useState(0);
  const [blinkingCheckpoint, setBlinkingCheckpoint] = useState(0);
  const [checkpointsStatus, setCheckpointsStatus] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const screens = [
    "checkpoint-1",
    "checkpoint-2",
    "checkpoint-3",
    "checkpoint-4",
    "checkpoint-5",
  ];

  // Simulate a progress calculation for each checkpoint
  const calculateProgress = (start, end) => {
    const totalDuration = end - start;
    const elapsedTime = currentTime - start;

    if (elapsedTime <= 0) return 0;
    if (elapsedTime >= totalDuration) return 100;
    return (elapsedTime / totalDuration) * 100;
  };

  // Dummy data for checkpoint times (simulated start and end times)
  const getCheckPointsTime = () => {
    const now = new Date().getTime();
    const dummyTimes = [
      { start: now, end: now + 20 * 1000 }, // Checkpoint 1 (5 seconds)
      { start: now + 20 * 1000, end: now + 40 * 1000 }, // Checkpoint 2 (5 seconds)
      { start: now + 40 * 1000, end: now + 80 * 1000 }, // Checkpoint 3 (5 seconds)
      { start: now + 80 * 1000, end: now + 120 * 1000 }, // Checkpoint 4 (5 seconds)
      { start: now + 120 * 1000, end: now + 160 * 1000 }, // Checkpoint 4 (5 seconds)
    ];

    setCheckPointsTimes(dummyTimes);
  };

  // Fetching checkpoint statuses (dummy for testing)
  useEffect(() => {
    async function fetchCheckpointsStatus() {
      try {
        // Simulating API response
        const dummyStatus = [true, false, false, false, false]; // Example status
        setCheckpointsStatus(dummyStatus);
      } catch (error) {
        console.error("Error fetching checkpoint status:", error);
      }
    }
    fetchCheckpointsStatus();
  }, [
    checkpointOneStatus,
    checkpointTwoStatus,
    checkpointThreeStatus,
    checkpointFourStatus,
    checkpointFiveStatus,
  ]);

  useEffect(() => {
    getCheckPointsTime(); // Load the dummy data when component mounts
  }, []);

  const updateEnabledCheckpoints = () => {
    const currentTime = new Date().getTime();
    let enabledCount = 0;

    for (let i = 0; i < checkPointsTimes.length; i++) {
      if (currentTime >= checkPointsTimes[i].start) {
        enabledCount = i + 1;
      } else {
        break;
      }
    }

    if (enabledCount !== enabledCheckpoints) {
      setBlinkingCheckpoint(enabledCount);
      setEnabledCheckpoints(enabledCount);
    }
  };

  useEffect(() => {
    if (checkPointsTimes.length > 0) {
      const interval = setInterval(() => {
        setCurrentTime(new Date().getTime());
        updateEnabledCheckpoints();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [checkPointsTimes]);

  return (
    <aside className="md:fixed top-28 overflow-y-auto h-[calc(100vh-135px)] w-[200px] bg-white dark:bg-[#1E1E1E] shadow-md rounded-xl border border-[#E6EAF0] dark:border-[#343434]">
      <div className="relative h-full flex flex-col items-center justify-between p-5">
        <div className="h-full flex flex-col items-center justify-between">
          <div className="text-xl font-semibold">Checkpoints</div>
          <ul className="space-y-4">
            {steps.map((step, index) => {
              const progress =
                checkPointsTimes[index] &&
                calculateProgress(
                  checkPointsTimes[index].start,
                  checkPointsTimes[index].end
                );

              return (
                <li key={index} className={`text-sm xl:text-lg`}>
                  <div
                    className="w-[4.3rem] h-[4.3rem] rounded-full flex items-center justify-center relative"
                    style={{
                      background: `conic-gradient(
                          #07C271 ${progress || 0}%, 
                          #F4F4F6 ${progress || 0}% 100%
                        )`,
                      transition: "background 0.5s linear",
                    }}
                  >
                    <NavLink to={`/${screens[index]}`}>
                      <button
                        disabled={index >= enabledCheckpoints}
                        className={`w-16 h-16 rounded-full flex items-center justify-center bg-[#F4F4F6] dark:bg-[#2C2C2E] ${
                          index >= enabledCheckpoints
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }`}
                      >
                        <p className="text-sm md:text-2xl font-bold text-[#07C271] dark:text-white">
                          0{index + 1}
                        </p>
                      </button>
                    </NavLink>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="w-32 h-16 mt-8">
            <div className="w-32 h-16 rounded-t-full border-4 border-b-0 border-green-500 overflow-hidden flex items-end justify-center">
              <span className="text-lg font-bold">12:03:00</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
