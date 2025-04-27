import React from "react";
export function SubstitutionsDisplay({
  teacherSubstitutionsToSend,
  setteachersubstitutionstosend,
}) {
  return (
    <div className="">
      <div className="h-[20dvh] w-full px-[min(3vw,50px)] flex items-center gap-[10px] overflow-x-scroll no-scrollbar">
        {teacherSubstitutionsToSend &&
        Object.keys(teacherSubstitutionsToSend) &&
        Object.keys(teacherSubstitutionsToSend).length > 0 ? (
          Object.keys(teacherSubstitutionsToSend).map((subs, index) => {
            return (
              <div
                className="p-[min(3vw,50px)] border-borderc border-1 rounded-md flex flex-col items-start cursor-pointer"
                onClick={() => {
                  const updatedSubstitutions = {
                    ...teacherSubstitutionsToSend,
                  };
                  delete updatedSubstitutions[subs];
                  setteachersubstitutionstosend(updatedSubstitutions);
                }}
              >
                <h1>{teacherSubstitutionsToSend[subs]["subject_name"]}</h1>
                <div className="text-[min(1rem,10px)] flex gap-[5px]">
                  <span>{teacherSubstitutionsToSend[subs]["dateNumber"]}</span>
                  <span>{teacherSubstitutionsToSend[subs]["month"]}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-[rgb(170,170,170)] font-light">
            Select periods to view
          </div>
        )}
      </div>
    </div>
  );
}
