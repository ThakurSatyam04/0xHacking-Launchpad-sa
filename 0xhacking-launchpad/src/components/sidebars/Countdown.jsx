import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SemiCircularProgressBar from "./SemicirculatBar";

const Countdown = () => {
  const [seconds, setSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFutureEvent, setIsFutureEvent] = useState(false);
  const [isHackathonEnded, setIsHackathonEnded] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const { duration, startTime } = useSelector((state) => state.countdown);

  const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000); // Use this currentTime to validate if Timer is working or not
  // uncomment this to verify if progress bar is working or not
  
  // const startTime = currentTimeInSeconds;
  // const duration = 0.1;

  useEffect(() => {
    const handleProgress = async () => {
      try {
        const durationInSeconds = duration * 60 * 60; // Convert duration to seconds
        const endTime = new Date(startTime * 1000 + durationInSeconds * 1000); // Add duration to start time
        const currentTime = new Date();

        const twoDaysInSeconds = 2 * 24 * 3600;
        const timeDifferenceInSeconds = Math.floor(
          (currentTime.getTime() - startTime * 1000) / 1000
        );

        if (timeDifferenceInSeconds > twoDaysInSeconds) {
          // If the start time is more than 2 days ago
          setIsHackathonEnded(true);
        } else if (startTime > currentTimeInSeconds) {
          // If the start time is in the future
          setIsFutureEvent(true);
          const initialTime = Math.floor((startTime - currentTime.getTime() / 1000));
          setSeconds(initialTime);
          setTotalSeconds(durationInSeconds);
        } else {
          const initialTime = Math.max(
            Math.floor((endTime - currentTime) / 1000),
            0
          ); // Time difference in seconds
          setSeconds(initialTime);
          setTotalSeconds(durationInSeconds);
        }
      } catch (error) {
        console.error("Error fetching start time:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handleProgress();
  }, [isLoading,isFutureEvent,isHackathonEnded]);

  useEffect(() => {
    if (!isLoading && !isFutureEvent && !isHackathonEnded) {
      const intervalId = setInterval(() => {
        setSeconds((seconds) => Math.max(seconds - 1, 0));
      }, 1000);

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [isLoading, isFutureEvent, isHackathonEnded]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isHackathonEnded) {
    return (
      <div className="text-center font-semibold text-sm md:text-xl md:pt-5 text-red-600 dark:text-gray-100">
        Hackathon Ended.
      </div>
    );
  }

  if (isFutureEvent) {
    return (
      <div className="text-center font-semibold text-sm md:text-xl md:pt-5 text-[#06C270] dark:text-gray-100">
        Hackathon Begins Shortly.
      </div>
    );
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const elapsedPercentage =
    totalSeconds > 0 ? ((totalSeconds - seconds) / totalSeconds) * 100 : 0;

  return (
    <div className="flex w-full flex-col">
      <div className="relative">
        <SemiCircularProgressBar elapsedPercentage={elapsedPercentage} />
        <div className="absolute flex justify-center gap-1 -bottom-[10%] right-[20%] transform translate-x-1">
          {String(hours).padStart(2, "0")}
          <span className="dark:text-gray-200">:</span>
          {String(minutes).padStart(2, "0")}
          <span className="dark:text-gray-200">:</span>
          {String(remainingSeconds).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};

export default Countdown;
