import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  fetchCheckpointStatus,
  fetchCheckPointsTime,
  setEnabledCheckpoints,
  setBlinkingCheckpoint,
} from "../../features/CheckpointSlice";
import { fetchUserProfile } from "../../features/ProfileSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const steps = [
    "Checkpoint 1",
    "Checkpoint 2",
    "Checkpoint 3",
    "Checkpoint 4",
    "Checkpoint 5",
  ];
  const screens = [
    "checkpoint-1",
    "checkpoint-2",
    "checkpoint-3",
    "checkpoint-4",
    "checkpoint-5",
  ];

  // Accessing Redux state from both slices
  const {
    checkpointsStatus,
    checkPointsTimes,
    enabledCheckpoints,
    blinkingCheckpoint,
    loading,
    error,
    duration,
    startTime,
  } = useSelector((state) => state.countdown);


  // Fetch checkpoint and user profile data from API
  useEffect(() => {
    dispatch(fetchCheckPointsTime());
    dispatch(fetchCheckpointStatus());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Simulate a progress calculation for each checkpoint
  const calculateProgress = (start, end, index) => {
    const totalDuration = end - start;
    const elapsedTime = currentTime - start;

    if (elapsedTime <= 0) return 0;
    if (elapsedTime >= totalDuration) return 100;

    if (index === steps.length - 1) {
      // For the last checkpoint, calculate progress based on the current time
      return (elapsedTime / totalDuration) * 100;
    }

    return (elapsedTime / totalDuration) * 100;
  };

  // Update enabled checkpoints based on time
  const updateEnabledCheckpoints = () => {
    const currentTime = new Date().getTime();
    let enabledCount = 0;

    for (let i = 0; i < checkPointsTimes.length; i++) {
      if (currentTime >= checkPointsTimes[i]) {
        enabledCount = i + 1;
      } else {
        break;
      }
    }

    if (enabledCount !== enabledCheckpoints) {
      dispatch(setBlinkingCheckpoint(enabledCount));
      dispatch(setEnabledCheckpoints(enabledCount));
    }
  };

  // Update current time and enabled checkpoints every second
  useEffect(() => {
    if (checkPointsTimes.length > 0) {
      const interval = setInterval(() => {
        setCurrentTime(new Date().getTime());
        updateEnabledCheckpoints();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [checkPointsTimes, enabledCheckpoints]);

  // Timer
  function formatTime(unit) {
    return unit < 10 ? `0${unit}` : unit;
  }

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Calculate the end time by adding duration to the start time (both in milliseconds)
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000); // Use this currentTime to validate if Timer is working or not
    const hackathonStartTime = currentTimeInSeconds * 1000;
    const hackathonEndTime = hackathonStartTime + duration * 3600 * 1000;

    // Function to update the time left
    const updateTimeLeft = () => {
      const currentTime = new Date().getTime(); 
      const remainingTime = hackathonEndTime - currentTime;

      if (remainingTime <= 0) {
        // If remaining time is 0 or less, stop the timer
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(remainingTime / (1000 * 60 * 60)); // Calculate hours
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)); // Calculate minutes
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000); // Calculate seconds
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    // Set up an interval to update the time left every second
    const intervalId = setInterval(updateTimeLeft, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [startTime, duration]);

  return (
    <aside className="md:fixed top-28 overflow-y-auto h-[calc(100vh-135px)] w-[200px] bg-white dark:bg-[#1E1E1E] shadow-md rounded-xl border border-[#E6EAF0] dark:border-[#343434]">
      <div className="relative h-full flex flex-col items-center justify-between p-5">
        <div className="h-full flex flex-col items-center justify-between">
          <div className="text-xl font-semibold">Checkpoints</div>
          <ul className="space-y-4">
            {steps.map((step, index) => {
              // Check if the checkpoint is completed
              const isCheckpointCompleted = checkpointsStatus[index];

              // For incomplete checkpoints, calculate progress
              const nextCheckpointTime =
                checkPointsTimes[index + 1] || currentTime;
              const progress = isCheckpointCompleted
                ? 100 // If completed, progress is 100%
                : calculateProgress(
                    new Date(checkPointsTimes[index]).getTime(),
                    new Date(nextCheckpointTime).getTime(),
                    index
                  );
              return (
                <li
                  key={index}
                  style={{
                    background: isCheckpointCompleted
                      ? "#07C271" // Green if checkpoint is completed
                      : `conic-gradient(
                          #07C271 ${progress || 0}%,
                          #F4F4F6 ${progress || 0}% 100%
                        )`, // Progress for incomplete
                    transition: "background 0.5s linear",
                  }}
                  className={`w-[4.3rem] h-[4.3rem] rounded-full flex items-center justify-center relative ${
                    checkpointsStatus[index]
                      ? "bg-[#52e500] text-gray-700"
                      : index === blinkingCheckpoint - 1
                      ? ""
                      : "text-black dark:text-white "
                  }`}
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F4F4F6] dark:bg-[#2C2C2E] text-[#07C271] dark:text-[#FFFFFF] ">
                    <NavLink to={`/${screens[index]}`}>
                      <button
                        disabled={
                          index >= enabledCheckpoints ||
                          (index > 0 && !checkpointsStatus[index - 1])
                        }
                        className={`block w-16 h-16 rounded-full  ${
                          index >= enabledCheckpoints ||
                          (index > 0 && !checkpointsStatus[index - 1])
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        } ${
                          checkpointsStatus[index]
                            ? "bg-[#52e500] text-black"
                            : index === blinkingCheckpoint - 1
                            ? ""
                            : " "
                        }`}
                      >
                        <p className="text-sm md:text-2xl xl:text-3xl font-extrabold">
                          {index + 1}
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
              <span className="text-lg font-bold">
                {timeLeft
                  ? `${formatTime(timeLeft.hours)}:${formatTime(
                      timeLeft.minutes
                    )}:${formatTime(timeLeft.seconds)}`
                  : "00:00:00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
