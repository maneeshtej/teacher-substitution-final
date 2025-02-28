import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, useNavigate } from "react-router-dom";
import "./animation.css";

const AnimationContext = createContext();

export const useAnimation = () => useContext(AnimationContext);

function AnimationsManager({ children }) {
  //

  // ANIMATION STATES
  //
  //
  const [animation, setAnimation] = useState("none");
  const [animationStyle, setAnimationStyle] = useState("slide");
  const [wait, SetWait] = useState(false);
  const [animationClasses, setAnimationClasses] = useState({
    start: "",
    end: "",
  });
  //

  // ALERT
  //
  //
  const [alert, setAlert] = useState(null);
  //

  // OTHER STATES
  //
  //
  const [theme, setTheme] = useState("default");
  const [settings, setSettings] = useState(false);
  const navigate = useNavigate();
  //

  //TOGGLE SETTINGS
  //
  //
  //
  //
  const toggleSettings = (state) => {
    if (state === undefined) {
      setSettings((prevState) => !prevState);
      return;
    }

    if (state !== true && state !== false) {
      console.error("Enter a valid state: true (or) false");
      return;
    }

    setSettings(state);
  };
  //

  //   HANDLE THEME
  //
  //
  //
  //
  const handleTheme = (theme, accent) => {
    if (!theme) {
      console.error("No theme eg: 'red-dark' ");
      return;
    }

    setTheme({ theme, accent: accent ?? "default" });

    if (theme == "dark") {
      document.documentElement.style.setProperty(
        "--color-backgroundc",
        "rgb(0, 0, 0)"
      );
      document.documentElement.style.setProperty(
        "--color-textc",
        "rgb(170, 170, 170)"
      );
    }

    if (theme == "light") {
      document.documentElement.style.setProperty(
        "--color-backgroundc",
        "rgb(170, 170, 170)"
      );
      document.documentElement.style.setProperty(
        "--color-textc",
        "rgb(0, 0, 0)"
      );
    }
  };
  //

  //  ALERT
  //
  //
  //
  //
  const showAlert = (message, type) => {
    if (!message) {
      console.error("no message ex: Error!!!");
    }

    if (message === false) {
      setAlert(false);
    }

    setAlert(message);
  };
  //

  //  HANDLE NAVIGATION
  //
  //
  //
  //
  const handleNavigation = (path, state, action) => {
    //if wait return
    if (wait) {
      console.error("Animation is already running !!!");
      return;
    }

    // if no path return
    if (!path) {
      console.error('Please enter a path, e.g., "/somewhere"');
      return;
    }

    // if no action just navigate
    if (!action) {
      navigate(path, { state: state ?? "none" });
      return;
    }

    if (animationStyle == "slide" || !animationStyle) {
      // slide style
      if (action === "exit") {
        setAnimationClasses({ start: "to-left", end: "from-right" });
        SetWait(true);
      }
    } else if (animationStyle == "page") {
      // page style
      setAnimationClasses({ start: "page-start", end: "page-end" });
      SetWait(true);
    } else if (animationStyle == "flip") {
      // flip style
      setAnimationClasses({ start: "flip-start", end: "flip-end" });
      SetWait(true);
    }

    if (animation !== animationClasses.start) {
      setAnimation(animationClasses.start);
    }

    setTimeout(() => {
      navigate(path, { state: state ?? "none" });
      setAnimation(animationClasses.end);
    }, 200);
  };
  //

  // RESET ANIMATION
  //
  //
  //
  //
  const resetAnimation = () => {
    if (animation !== "none") {
      setTimeout(() => {
        setAnimation("none");
        SetWait(false);
      }, 600);
    }
  };

  useEffect(() => {
    resetAnimation();
  }, [animation]);
  //

  // RETURN
  //
  //
  //
  //
  return (
    <AnimationContext.Provider
      value={{
        toggleSettings,
        handleNavigation,
        setAlert,
      }}
    >
      <div
        className=" fixed h-[100dvh] w-[100%] bg-backgroundc text-textc"
        style={{
          perspective: "1500px",
        }}
      >
        {/*  */}
        {/* SETTINGS */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div
          className="animated-element
          fixed left-[10%] top-[10%]
          flex flex-col items-center justify-center gap-10
          z-10
          transition-all duration-300 ease-in-out"
          style={{
            transform: settings ? "translateX(0px)" : "translateX(-250px)",
            opacity: settings ? "1" : "0",
          }}
        >
          <div
            className="flex items-center justify-center 
          h-[10%]"
          >
            Settings
          </div>
          <span className="cursor-pointer" onClick={() => toggleSettings()}>
            Close
          </span>
          {/* Animation Style */}
          <div
            className="btn"
            onClick={() => setAnimationStyle("slide")}
            style={{
              backgroundColor:
                animationStyle === "slide" ? "rgb(50, 50, 50)" : "",
            }}
          >
            Slide
          </div>
          <div
            className="btn"
            onClick={() => setAnimationStyle("page")}
            style={{
              backgroundColor:
                animationStyle === "page" ? "rgb(50, 50, 50)" : "",
            }}
          >
            Page
          </div>
          <div
            className="btn"
            onClick={() => setAnimationStyle("flip")}
            style={{
              backgroundColor:
                animationStyle === "flip" ? "rgb(50, 50, 50)" : "",
            }}
          >
            Flip
          </div>
          {/* Theme */}
          <div
            className="btn"
            onClick={() => handleTheme("light")}
            style={{
              backgroundColor: theme.theme === "light" ? "rgb(50, 50, 50)" : "",
            }}
          >
            Light
          </div>
          <div
            className="btn"
            onClick={() => handleTheme("dark")}
            style={{
              backgroundColor: theme.theme === "dark" ? "rgb(50, 50, 50)" : "",
            }}
          >
            Dark
          </div>
        </div>
        {/*  */}
        {/* ALERT */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div
          className="fixed top-5 left-1/2 transform -translate-x-1/2 
          flex flex-col items-center justify-around
        min-h-[10vh] min-w-[min(500px,80vw)] 
        bg-backgroundc
        border-1 border-borderc rounded-[10px]
        transition-all duration-300 ease-in-out
        z-10"
          style={{
            transform: alert ? "translateY(0px)" : "translateY(-200px)",
          }}
        >
          <h1>{alert ?? "Alert not recieved"}</h1>
          <div className="btn" onClick={() => showAlert(false)}>
            Ok
          </div>
        </div>
        {/*  */}
        {/* CHILDREN */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div
          className={`animated-element ${animation} ${
            settings ? "open-settings" : "close-settings"
          } 
            h-[100dvh] w-[100%] 
            transition-all duration-300 ease-in-out 
            overflow-hidden`}
          style={{
            filter: settings ? "blur(2px)" : "",
          }}
          onClick={() => {
            settings && setSettings(false);
          }}
        >
          <Routes>{children}</Routes>
        </div>
      </div>
    </AnimationContext.Provider>
  );
}
//

export default AnimationsManager;
