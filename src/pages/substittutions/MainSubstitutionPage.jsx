import React, { lazy, Suspense, useEffect, useState } from "react";
import { BackLogo, HelpLogo } from "../../components/Logos"; // Component for the back button icon
import TypeSelector from "./components/TypeSelector"; // Component to select substitution type (Give/Take/Swap)
import useTeachStore from "../../context/useTeachStore"; // Zustand store for teacher-related data (like teacher ID)
import { create } from "zustand"; // Zustand library for state management
import { persist } from "zustand/middleware"; // Zustand middleware for persisting state (e.g., to localStorage)
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import HelpPage from "./components/HelpPage";

// Lazily load the CalenderClassSelector component for better initial load performance
const CalenderClassSelector = lazy(() =>
  import("./components/CalenderClassSelector")
);

// Create a Zustand store specifically for substitution page state, persisted in localStorage
const useSubStore = create(
  persist(
    (set) => ({
      // State for the selected substitution type (0: Give, 1: Take, 2: Swap)
      typeState: {
        type: null, // The actual type selected
        visible: false, // Whether the TypeSelector modal/popup is visible
        filled: false, // Whether a type has been selected
      },
      // State to control which steps/sections of the form are enabled
      allowSteps: {
        step1: true, // Type selection is always allowed initially
        step2: false, // Class selection is initially disabled
      },

      // Actions to update the store's state
      settypestate: (newTypeState) => set({ typeState: newTypeState }),
      setallowsteps: (newAllowSteps) => set({ allowSteps: newAllowSteps }),
      // Action to reset the substitution state (e.g., when leaving the page)
      resetstate: () =>
        set({
          typeState: { type: null, visible: false, filled: false },
          allowSteps: { step1: true, step2: false },
        }),
    }),
    { name: "sub-store" } // Key used for storing this state in localStorage
  )
);

function MainSubstitutionPage() {
  // Local component state mirroring the Zustand store state for easier updates
  const [typeState, setTypeState] = useState(
    useSubStore((state) => state.typeState)
  );
  const [allowSteps, setAllowSteps] = useState(
    useSubStore((state) => state.allowSteps)
  );

  const [helpToggle, setHelpToggle] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  // Get actions and state from the Zustand stores
  const { settypestate, setallowsteps, resetstate } = useSubStore(); // Actions for the local sub store
  const teacherID = useTeachStore((state) => state.teacherid); // Get teacher ID from the global teacher store
  const { setteachersubstitutionstosend } = useTeachStore(); // Action to update selected substitutions in the global store
  const teacherSubstitutionsToSend = useTeachStore(
    (state) => state.teachersubstitutionstosend // Get the currently selected substitutions from the global store
  );

  // Function called when a substitution type is selected in the TypeSelector
  const updateType = (type) => {
    setTypeState((prev) => ({
      ...prev,
      type, // Set the selected type
      visible: false, // Hide the selector
      filled: true, // Mark type as selected
    }));
    // Enable the next step (class selection)
    setAllowSteps((prev) => ({
      ...prev,
      step2: true,
    }));
  };

  // Function to toggle the visibility of the TypeSelector component
  const toggleTypeSelector = () => {
    setTypeState((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  };

  // Effect to synchronize local typeState with the Zustand store whenever local state changes
  useEffect(() => {
    settypestate(typeState);
  }, [typeState, settypestate]); // Added settypestate to dependency array

  // Effect to synchronize local allowSteps with the Zustand store whenever local state changes
  useEffect(() => {
    setallowsteps(allowSteps);
  }, [allowSteps, setallowsteps]); // Added setallowsteps to dependency array

  return (
    // Main container div covering the full screen
    <div className="fixed h-[100dvh] w-[100vw] bg-backgroundc text-textc">
      {/* Render the TypeSelector component, passing visibility and update function */}
      <TypeSelector
        visible={typeState.visible}
        type={typeState.type}
        setType={updateType}
      />
      <HelpPage visible={helpToggle} />

      {/* Header section with back button and title */}
      <div className="h-[10dvh] w-[100%] flex items-center gap-[10px] px-[min(3vw,50px)] cursor-pointer">
        {/* Back button logic: clears local storage, resets state, and navigates home */}
        <div
          onClick={() => {
            localStorage.removeItem("sub-store"); // Clear persisted state
            resetstate(); // Reset Zustand store state
            setteachersubstitutionstosend({}); // Clear selected substitutions in global store
            navigate("/home"); // Navigate back to the home page
          }}
        >
          <BackLogo size="min(3rem,7vw)" />
        </div>
        <h1 className="text-heading font-bold lg:font-normal">
          Add Substitutions
        </h1>
        <div className="ml-auto" onClick={() => setHelpToggle(true)}>
          <HelpLogo />
        </div>
      </div>

      {/* Main content area, scrollable */}
      <div className="h-[90dvh] w-[100%] p-[min(3vw,50px)] overflow-scroll">
        {/* Section 1: Select Substitution Type */}
        <div className="px-[min(3vw,50px)]">
          <h1 className="text-subheading font-bold lg:font-normal">
            Select Type
          </h1>
          <div className="h-[2vh]"></div>
          {/* Clickable area to show the selected type or prompt selection */}
          <span
            className="flex w-[clamp(300px,100%,700px)] bg-textc text-backgroundc p-[min(3vw,30px)] rounded-md cursor-pointer"
            onClick={toggleTypeSelector} // Opens the TypeSelector
          >
            {/* Display selected type text */}
            {typeState.type == 0
              ? "Give Class"
              : typeState.type == 1
              ? "Take Class"
              : typeState.type == 2
              ? "Swap Class"
              : "Tap to select"}
          </span>
        </div>
        <div className="h-[min(5vw,20px)]"></div>

        {/* Section 2: Select Classes (conditionally enabled) */}
        <div
          className={`${
            allowSteps.step2 == false // Apply opacity and disable interaction if step 2 is not allowed
              ? "opacity-30 pointer-events-none"
              : "opacity-100"
          } px-[min(3vw,50px)] z-0`}
        >
          <h1 className="text-subheading font-bold lg:font-normal">
            Select Classes
          </h1>
          <div className="h-[2vh]"></div>
          {/* Use Suspense for lazy loading the CalenderClassSelector */}
          <Suspense
            fallback={
              // Display a loading placeholder while the component loads
              <div
                className={`h-[100dvh] w-[100%] bg-backgroundh rounded-md animate-pulse`}
              ></div>
            }
          >
            {/* Render the calendar component, passing down state and setters */}
            <CalenderClassSelector
              teacherSubstitutionsToSend={teacherSubstitutionsToSend}
              setteachersubstitutionstosend={setteachersubstitutionstosend}
            />
          </Suspense>
        </div>

        {/* Footer section with a gradient overlay and Send button */}
        <div className="h-[10dvh] w-[100%] flex justify-center items-center bg-gradient-to-b from-[rgba(30,30,30,0)] via-[rgba(30,30,30,0.4)] to-[rgba(30,30,30,1)]">
          {/* Send button (functionality likely needs to be added to onClick) */}
          <span className="bg-textc flex items-center justify-center text-backgroundc font-bold tracking-wide p-[min(3vw,20px)] rounded-md cursor-pointer h-[80%] w-[min(60%,300px)]">
            Send
          </span>
        </div>
      </div>
    </div>
  );
}

export default MainSubstitutionPage;
