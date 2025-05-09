import React, { lazy, useDebugValue, useEffect } from "react";
import { SubstitutionsDisplay } from "./components/SubstitutionsDisplay";
import { Suspense } from "react";
import { SubstitutionTeacherSelector } from "./components/SubstitutionTeacherSelector";
import useTeachStore from "../../context/useTeachStore";

const CalenderClassSelector = lazy(() =>
  import("./components/CalenderClassSelector")
);

export function GiveClasses({
  teacherSubstitutionsToSend,
  setteachersubstitutionstosend,
  allowSteps,
}) {
  const teacherID = useTeachStore((state) => state.teacherid);
  const teacherName = useTeachStore((state) => state.teachername);

  useEffect(() => {
    console.log(teacherID);
  }, [teacherID]);

  return (
    <>
      {/* Section 2: Select Classes (conditionally enabled) */}

      <div
        className={`${
          allowSteps.step2 == false // Apply opacity and disable interaction if step 2 is not allowed
            ? "opacity-30 pointer-events-none"
            : "opacity-100"
        } px-[min(3vw,50px)] z-0`}
      >
        <h1 className="text-subheading font-bold lg:font-normal py-[min(2vw,30px)] border-b-2 border-borderc">
          2. Select Classes
        </h1>
        {/* Display substitutions */}
        <SubstitutionsDisplay
          teacherSubstitutionsToSend={teacherSubstitutionsToSend}
          setteachersubstitutionstosend={setteachersubstitutionstosend}
        />
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
            teacherID={teacherID}
            teacherName={teacherName}
          />
        </Suspense>
      </div>
      <div className="h-[2dvh]"></div>

      <div className="p-[min(3vw,50px)]">
        <h1 className="text-subheading font-bold border-b-2 border-borderc py-[min(2vw,30px)]">
          3. Select teachers
        </h1>
        <SubstitutionTeacherSelector
          teacherSubstitutionsToSend={teacherSubstitutionsToSend}
          setteachersubstitutionstosend={setteachersubstitutionstosend}
        />
      </div>
    </>
  );
}
