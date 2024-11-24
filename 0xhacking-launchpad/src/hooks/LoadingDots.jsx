import { useEffect, useState } from "react";

const useLoadingDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : "."));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return dots;
};

export default useLoadingDots;
