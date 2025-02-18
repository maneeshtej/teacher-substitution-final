import React, { useState, createContext, useContext, useEffect } from "react";

const StateContext = createContext(null);

export function StateProvider({ children }) {
  const [state, setState] = useState({});
  const [persistState, setPersistState] = useState(() => {
    const localState = localStorage.getItem("persist");
    if (!localState) {
      localStorage.setItem("persist", JSON.stringify({}));
      return {};
    }
    return JSON.parse(localState);
  });

  const updateState = (key, data) => {
    if (!key || !data) {
      console.error("No key or data provided");
      return;
    }

    setState((prevState) => ({
      ...prevState,
      [key]: data,
    }));
  };

  const getState = (key, clear = false) => {
    if (!key) {
      console.error("No key provided");
      return;
    }

    if (!(key in state)) {
      console.error("Key not found in state");
      return;
    }

    const value = state[key];

    if (clear) {
      setState((prevState) => {
        const newState = { ...prevState };
        delete newState[key];
        return newState;
      });
    }

    return value;
  };

  const updatePersistState = (key, data) => {
    if (!key || !data) {
      console.error("no key or data");
    }

    setPersistState((prevState) => {
      const newState = { ...prevState, [key]: data };
      return newState;
    });
  };

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persistState));
  }, [persistState]);

  const getPersistState = (key, clear = false) => {
    if (!persistState[key]) {
      console.error("Key doesnt exist");
      return;
    }

    return persistState[key];
  };

  return (
    <StateContext.Provider
      value={{ updateState, getState, updatePersistState, getPersistState }}
    >
      {children}
    </StateContext.Provider>
  );
}

export const useManeeshState = () => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }

  return context;
};
