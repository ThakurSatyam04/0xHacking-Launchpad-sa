import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../features/ProfileSlice"; // Update the path as per your project structure
import useLoadingDots from "@/hooks/LoadingDots";
import CheckPointTwo from "../components/forms/CheckpointTwo";

const ScreenTwo = () => {
  const dispatch = useDispatch();

  // Access Redux state
  

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-6">
       
        {/* <Separator /> */}
        <CheckPointTwo />
      </div>
    </div>
  );
};

export default ScreenTwo;
