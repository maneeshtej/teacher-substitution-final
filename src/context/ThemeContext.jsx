import React, { createContext, useContext, useState } from "react";
import { Routes } from "react-router-dom";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    bgColor: "rgb(0, 0, 0)",
    textColor: "rgb(170, 170, 170)",
  });

  const [textStyle, setTextStyle] = useState({
    fontFamily: `"Open Sans", serif`,
    fontColor: "rgb(0,0,0)",
  });

  return (
    <ThemeContext.Provider value={{ theme, textStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
