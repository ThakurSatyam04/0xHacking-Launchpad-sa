import React, { useEffect } from "react";

import CheckPointFive from "../components/forms/CheckpointFive";

const ScreenFive = () => {
  return (
    <div className="px-4 flex flex-col gap-8 md:px-16 py-5">
      <div className="space-y-6">
        
        {/* <Separator /> */}
        <CheckPointFive />
      </div>
    </div>
  );
};

export default ScreenFive;
