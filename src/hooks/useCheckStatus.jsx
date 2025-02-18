import { useEffect, useCallback, useState } from "react";
import { isUserLoggedIn } from "../../utils/authUtils";
import { useNavigate } from "react-router-dom";

function useCheckStatus(intervalTime = 5000) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Function to check login status
  const checkLogin = useCallback(async () => {
    const isLoggedIn = await isUserLoggedIn();
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  // Start checking every 5 seconds
  const startChecking = useCallback(() => {
    if (!isChecking) {
      const id = setInterval(checkLogin, 5000);
      setIntervalId(id);
      setIsChecking(true);
    }
  }, [isChecking, checkLogin, intervalTime]);

  // Stop checking
  const stopChecking = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsChecking(false);
    }
  }, [intervalId]);

  // Cleanup when the component unmounts
  useEffect(() => {
    return () => stopChecking();
  }, [stopChecking]);

  return { checkLogin, startChecking, stopChecking, isChecking };
}

export default useCheckStatus;
