import { createContext, useState } from "react";

const steps = [
  "Checkpoint",
  "Checkpoint",
  "Checkpoint",
  "Checkpoint",
  "Checkpoint",
];

export const DataContext = createContext({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  smallSidebarOpen: true,
  setSmallSidebarOpen: () => {},
  loading: true,
  setLoading: () => {},
  currentStep: 0,
  setCurrentStep: () => {},
  handleNext: () => {},
  handlePrevious: () => {},
  steps: steps,
  setUserData: () => {},
  checkpointsStatus: [],
  setCheckpointsStatus: () => {},
  checkpointOneStatus: undefined,
  setCheckpointOneStatus: () => {},
  checkpointTwoStatus: undefined,
  setCheckpointTwoStatus: () => {},
  checkpointThreeStatus: undefined,
  setCheckpointThreeStatus: () => {},
  checkpointFourStatus: undefined,
  setCheckpointFourStatus: () => {},
  checkpointFiveStatus: undefined,
  setCheckpointFiveStatus: () => {},
  checkpointsCompleted: 0,
  setCheckpointsCompleted: () => {},
});

export const DataProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [smallSidebarOpen, setSmallSidebarOpen] = useState(true);
  const [userData, setUserData] = useState();
  const [checkpointsStatus, setCheckpointsStatus] = useState([]);
  const [checkpointOneStatus, setCheckpointOneStatus] = useState(undefined);
  const [checkpointTwoStatus, setCheckpointTwoStatus] = useState(undefined);
  const [checkpointThreeStatus, setCheckpointThreeStatus] = useState(undefined);
  const [checkpointFourStatus, setCheckpointFourStatus] = useState(undefined);
  const [checkpointFiveStatus, setCheckpointFiveStatus] = useState(undefined);
  const [checkpointsCompleted, setCheckpointsCompleted] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    smallSidebarOpen,
    setSmallSidebarOpen,
    loading,
    setLoading,
    currentStep,
    setCurrentStep,
    handleNext,
    handlePrevious,
    steps,
    userData,
    setUserData,
    checkpointsStatus,
    setCheckpointsStatus,
    checkpointOneStatus,
    setCheckpointOneStatus,
    checkpointTwoStatus,
    setCheckpointTwoStatus,
    checkpointThreeStatus,
    setCheckpointThreeStatus,
    checkpointFourStatus,
    setCheckpointFourStatus,
    checkpointFiveStatus,
    setCheckpointFiveStatus,
    checkpointsCompleted,
    setCheckpointsCompleted,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
