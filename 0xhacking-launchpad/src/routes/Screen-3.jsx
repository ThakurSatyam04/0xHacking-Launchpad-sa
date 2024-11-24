import React, { useEffect } from "react";

import CheckPointThree from "../components/forms/CheckpointThree";

const ScreenThree = () => {

  // Access Redux state
  

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-6">        
        {/* <Separator /> */}
        <CheckPointThree />
      </div>
    </div>
  );
};

export default ScreenThree;
