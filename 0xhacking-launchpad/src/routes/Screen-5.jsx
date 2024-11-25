import React, { useEffect } from "react";

import CheckPointFive from "../components/forms/CheckpointFive";

const ScreenFive = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-6">        
        {/* <Separator /> */}
        <CheckPointFive />
      </div>
    </div>
  );
};

export default ScreenFive;
