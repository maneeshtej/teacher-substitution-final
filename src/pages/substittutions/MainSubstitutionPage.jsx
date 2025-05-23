import { Footer } from "./../substitution/components/Footer";
import { GiveClasses } from "./GiveClasses";
import { SubstitutionsDisplay } from "./components/SubstitutionsDisplay";
import { SubstitutionTeacherSelector } from "./components/SubstitutionTeacherSelector";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { BackLogo, HelpLogo } from "../../components/Logos"; // Component for the back button icon
import TypeSelector from "./components/TypeSelector"; // Component to select substitution type (Give/Take/Swap)
import useTeachStore from "../../context/useTeachStore"; // Zustand store for teacher-related data (like teacher ID)
import { create } from "zustand"; // Zustand library for state management
import { persist } from "zustand/middleware"; // Zustand middleware for persisting state (e.g., to localStorage)
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import HelpPage from "./components/HelpPage";
import TakeClass from "./TakeClass";
import {
  insertSubstitutions,
  processSend,
  sendDraftSubstituions,
  sendSubstitutions,
  testSupabaseEdge,
} from "../../../utils/postUtils";
import { checkDuplicateSubstitutions } from "../../../utils/duplicateUtils";
import { GlobalLoadingIndicator } from "../../context/GlobalLoadingIndicator";
import { useLoading } from "../../context/LoadingContext";

// Lazily load the CalenderClassSelector component for better initial load performance

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
  const { setIsLoading, setMessage } = useLoading();

  // Hook for navigation
  const navigate = useNavigate();

  // Get actions and state from the Zustand stores
  const { settypestate, setallowsteps, resetstate } = useSubStore(); // Actions for the local sub store
  const teacherID = useTeachStore((state) => state.teacherid); // Get teacher ID from the global teacher store
  const { setteachersubstitutionstosend } = useTeachStore(); // Action to update selected substitutions in the global store
  const teacherSubstitutionsToSend = useTeachStore(
    (state) => state.teachersubstitutionstosend // Get the currently selected substitutions from the global store
  );
  const [finalSubstitutions, setFinalSubstitutions] = useState([]);
  const [allowSend, setAllowSend] = useState(false);

  // Function called when a substitution type is selected in the TypeSelector
  const updateType = (type) => {
    setTypeState((prev) => ({
      ...prev,
      type, // Set the selected type
      visible: false, // Hide the selector
      filled: true, // Mark type as selected
    }));
    setteachersubstitutionstosend({});
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

  const checkValidity = () => {
    let isValid = true;

    const temp = { ...teacherSubstitutionsToSend }; // copy to edit

    Object.keys(temp).forEach((key) => {
      const data = temp[key];
      let error = "";

      if (!data.teacher_id) error = "Teacher ID missing";
      else if (!data.teacher_name) error = "Teacher Name missing";
      else if (!data.sub_teacher_id) error = "Sub Teacher ID missing";
      else if (!data.sub_teacher_name) error = "Sub Teacher Name missing";
      else if (!data.class_id) error = "Class ID missing";
      else if (!data.subject_id) error = "Subject ID missing";
      else if (!data.start_time) error = "Start Time missing";
      else if (!data.end_time) error = "End Time missing";
      else if (!data.date?.date) error = "Date missing";

      if (error) {
        isValid = false;
        temp[key].error = error; // update that particular entry with error
      } else {
        delete temp[key].error; // no error => remove if already existed
      }
    });

    // Update teacherSubstitutionsToSend with new errors
    setteachersubstitutionstosend(temp);

    return isValid;
  };

  const handleCheckSubstitutions = async () => {
    if (!checkValidity()) {
      return;
    }

    const constantTeacherSubstitutions = teacherSubstitutionsToSend;

    const processedSubstitutions = processSend(constantTeacherSubstitutions);
    setFinalSubstitutions(processedSubstitutions);

    setMessage({
      title: "Loading",
      heading: "Checking duplicates",
      body: "Please wait",
    });
    setIsLoading(true);

    const duplicatesResult = await checkDuplicateSubstitutions(
      processedSubstitutions
    );
    // console.log(duplicatesResult);

    const tempSubs = { ...teacherSubstitutionsToSend };

    Object.keys(teacherSubstitutionsToSend).map((sub, index) => {
      tempSubs[sub] = {
        ...tempSubs[sub],
        duplicate: duplicatesResult.duplicates[index],
      };
      setteachersubstitutionstosend(tempSubs);

      console.log(duplicatesResult.duplicates[index]);
    });

    if (duplicatesResult.value === false) {
      setMessage({
        title: "Loading",
        heading: "Inserting substitutions",
        body: "Please wait",
        close: true,
      });
      const constantTeacherID = teacherID;
      const { data, error } = await insertSubstitutions(
        processedSubstitutions,
        constantTeacherID
      );

      if (error) {
        console.error(error);
        setMessage({
          title: "Error",
          heading: null,
          body: `Failed to insert due to `,
          close: true,
        });
        setIsLoading(true);
        return;
      }

      if (data) {
        setteachersubstitutionstosend({});
        setFinalSubstitutions([]);
        setMessage({
          title: "Success",
          heading: null,
          body: "Inserted substitutions",
          close: true,
        });
        setIsLoading(true);
        console.log("success", data);
        return;
      }
    }
    setMessage({
      title: "Duplicates found",
      heading: null,
      body: "Please remove duplicates",
      close: true,
    });
    setIsLoading(true);
  };

  const handleDraft = async () => {
    const processedSubstitutions = processSend(teacherSubstitutionsToSend);
    setFinalSubstitutions(processedSubstitutions);

    const { data, error } = await sendDraftSubstituions(finalSubstitutions);

    if (error) {
      console.error(error);
    }

    if (data) {
      console.log("success");
      setteachersubstitutionstosend({});
    }
  };

  // Effect to synchronize local typeState with the Zustand store whenever local state changes
  useEffect(() => {
    settypestate(typeState);
  }, [typeState, settypestate]); // Added settypestate to dependency array

  // Effect to synchronize local allowSteps with the Zustand store whenever local state changes
  useEffect(() => {
    console.log("teacher subs to send : ", teacherSubstitutionsToSend);
  }, [teacherSubstitutionsToSend]);

  useEffect(() => {
    console.log(finalSubstitutions);
  }, [finalSubstitutions]);

  return (
    // Main container div covering the full screen
    <div className="fixed h-[100dvh] w-[100vw] bg-backgroundc text-textc">
      <GlobalLoadingIndicator />
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
          <h1 className="text-subheading font-bold lg:font-normal w-full border-b-2 border-borderc py-[min(2vw,30px)]">
            1. Select Type
          </h1>
          <div className="h-[2vh]"></div>
          {/* Clickable area to show the selected type or prompt selection */}
          <div className="pl-[min(3vw,50px)]">
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
        </div>
        <div className="h-[min(5vw,20px)]"></div>

        {typeState?.type === 0 ? (
          <Suspense fallback={<div>Loading</div>}>
            <GiveClasses
              teacherSubstitutionsToSend={teacherSubstitutionsToSend}
              setteachersubstitutionstosend={setteachersubstitutionstosend}
              allowSteps={allowSteps}
            />
          </Suspense>
        ) : typeState?.type === 1 ? (
          <TakeClass
            teacherSubstitutionsToSend={teacherSubstitutionsToSend}
            setteachersubstitutionstosend={setteachersubstitutionstosend}
          ></TakeClass>
        ) : (
          <div>Select an option</div>
        )}

        {/* Footer section with a gradient overlay and Send button */}
        <Footer
          handleCheckSubstitutions={handleCheckSubstitutions}
          handleDraft={handleDraft}
        />
        <h1
          onClick={() => {
            setMessage({
              title: "Loading",
              heading: "Inserting substitutions",
              body: "Please wait",
              close: true,
            });
            setIsLoading(true);
          }}
        >
          Test Loading
        </h1>
      </div>
    </div>
  );
}

export default MainSubstitutionPage;
