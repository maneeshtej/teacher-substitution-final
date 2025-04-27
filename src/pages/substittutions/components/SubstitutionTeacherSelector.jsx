import React, { useEffect, useState } from "react";
import useTeachStore from "../../../context/useTeachStore";
import { fetchUsers } from "../../../../utils/fetchUtils";
export function SubstitutionTeacherSelector({ teacherSubstitutionsToSend }) {
  const teacherID = useTeachStore((state) => state.teacherid);
  const [teachers, setTeachers] = useState(null);

  const fetchAllTeachers = async () => {
    const { data, error } = await fetchUsers(teacherID);

    if (error) {
      console.error(Error);
      return;
    }

    if (data) {
      setTeachers(data);
      return;
    }
  };

  useEffect(() => {
    fetchAllTeachers();
  }, [teacherID]);

  useEffect(() => {
    console.log(teachers);
  }, [teachers]);

  return (
    <div className="py-[min(3vw,50px)] pl-[min(3vw,50px)]">
      {teacherSubstitutionsToSend &&
      Object.keys(teacherSubstitutionsToSend) &&
      Object.keys(teacherSubstitutionsToSend).length > 0 ? (
        <div className="flex flex-col gap-[10px]">
          {Object.keys(teacherSubstitutionsToSend).map((subs, index) => {
            return (
              <div
                className="p-[min(3vw,50px)] flex w-full bg-textc text-backgroundc rounded-md"
                key={index}
              >
                <div className=" rounded-md flex flex-col items-start cursor-pointer flex-2/5">
                  <h1>{teacherSubstitutionsToSend[subs]["subject_name"]}</h1>
                  <div className="text-[min(1rem,10px)] flex gap-[5px]">
                    <span>
                      {teacherSubstitutionsToSend[subs]["dateNumber"]}
                    </span>
                    <span>{teacherSubstitutionsToSend[subs]["month"]}</span>
                  </div>
                </div>
                <div className="flex flex-3/5 items-center justify-center"></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
