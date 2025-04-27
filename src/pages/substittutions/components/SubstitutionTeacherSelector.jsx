import React, { useEffect, useState } from "react";
import useTeachStore from "../../../context/useTeachStore";
import { fetchUsers } from "../../../../utils/fetchUtils";
import SubstitutionInfo from "./SubstitutionInfo";
export function SubstitutionTeacherSelector({
  teacherSubstitutionsToSend,
  setteachersubstitutionstosend,
}) {
  // Use setteachersubstitutionstosend inside your compo

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

  const handleSelectChange = (teacher, subKey, subs) => {
    if (!teacher) {
      return;
    }

    const [tempTeacherID, tempTeacherName] = teacher.split("-");

    const newTempSubstitutions = {
      ...teacherSubstitutionsToSend,
      [subKey]: {
        ...teacherSubstitutionsToSend[subKey],
        sub_teacher_id: parseInt(tempTeacherID),
        sub_teacher_name: tempTeacherName,
      },
    };

    setteachersubstitutionstosend(newTempSubstitutions);

    console.log(newTempSubstitutions);
  };

  useEffect(() => {
    fetchAllTeachers();
  }, [teacherID]);

  useEffect(() => {
    // console.log(teachers);
  }, [teachers]);

  return (
    <div className="py-[min(3vw,50px)] pl-[min(3vw,50px)]">
      {teacherSubstitutionsToSend &&
      Object.keys(teacherSubstitutionsToSend) &&
      Object.keys(teacherSubstitutionsToSend).length > 0 ? (
        <div className="flex flex-col gap-[10px]">
          {Object.keys(teacherSubstitutionsToSend).map((subs, index) => {
            return (
              <div>
                <div
                  className="p-[min(3vw,50px)] flex bg-textc text-backgroundc rounded-md w-[clamp(300px,100%,700px)]"
                  key={index}
                >
                  <SubstitutionInfo
                    info={teacherSubstitutionsToSend[subs]}
                    component={
                      <div className=" rounded-md flex flex-col items-start cursor-pointer flex-2/5">
                        <h1>
                          {teacherSubstitutionsToSend[subs]["subject_name"]}
                        </h1>
                        <div className="text-[min(1rem,10px)] flex gap-[5px]">
                          <span>
                            {teacherSubstitutionsToSend[subs]["dateNumber"]}
                          </span>
                          <span>
                            {teacherSubstitutionsToSend[subs]["month"]}
                          </span>
                        </div>
                      </div>
                    }
                  />
                  <div className="flex flex-3/5 items-center justify-center">
                    {teachers && teachers.length > 0 ? (
                      <select
                        defaultValue={-1}
                        onChange={(e) => {
                          handleSelectChange(
                            e.target.value,
                            subs,
                            teacherSubstitutionsToSend[subs]
                          );
                        }}
                      >
                        <option value={-1}>Select teacher</option>
                        {teachers.map((teacher, index) => {
                          return (
                            <option
                              key={index}
                              value={`${teacher.id}-${teacher.name}`}
                            >
                              {teacher.name}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <div className="h-[80%] w-full bg-[rgb(200,200,200)] animate-pulse rounded-md"></div>
                    )}
                  </div>
                </div>
                {teacherSubstitutionsToSend[subs].error ? (
                  <div className="p-[min(2vw,20px)] text-[min(1rem,10px)]">
                    <span className="text-red-400">(i) </span>
                    {teacherSubstitutionsToSend[subs]?.error}
                  </div>
                ) : null}
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
