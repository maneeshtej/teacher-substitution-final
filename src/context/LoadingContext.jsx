import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    title: null,
    loading: null,
    body: null,
    close: true,
  });

  return (
    <LoadingContext.Provider
      value={{ isLoading, setIsLoading, message, setMessage }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
