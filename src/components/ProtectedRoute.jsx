import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../../utils/authUtils";

function ProtectedRoute({ element }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const isLogged = await isUserLoggedIn();
        setIsLoggedIn(isLogged);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  if (isLoggedIn === null) {
    return (
      <h1 className="fixed h-[100vh] w-[100vw] bg-backgroundc">Loading...</h1>
    );
  }

  return isLoggedIn ? element : <Navigate to="/" replace />;
}

export default ProtectedRoute;
