import React, { useEffect, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import { getAllTeachers } from "../../../utils/fetchUtils";
import useTeachStore from "../../context/useTeachStore";
import { updateSubstitutions } from "../../../utils/editAndRemoveUtils";

function EditSubstitutions() {
  const location = useLocation();
  const [teacherSubstitutions, setTeacherSubstitutions] = useState(
    location.state.selectedSubstitutions ?? null
  );
  const teacherID = useTeachStore((state) => state.teacherid);
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    const { data, error } = await getAllTeachers(teacherID);

    if (error) {
      console.error(error);
    }

    setLoading(false);

    setTeachers(data);
  };

  useEffect(() => {
    fetchTeachers();
  }, [teacherID]);

  useEffect(() => {
    console.log(teacherSubstitutions);
  }, [teacherSubstitutions]);

  const handleChange = (e, key, key2) => {
    setTeacherSubstitutions((prevState) => {
      const temp = { ...prevState };

      temp[key][key2] = e.target.value;

      return temp;
    });
  };

  return (
    <div className="h-[100dvh] w-[100%] px-[min(3vw,50px)] text-textc">
      <div className="h-[7dvh] flex items-center justify-between  font-light">
        <button
          onClick={() => {
            navigate("/home");
          }}
          className="cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={() => {
            updateSubstitutions(teacherSubstitutions);
            navigate("/success", { state: { data: teacherSubstitutions } });
          }}
        >
          Confirm
        </button>
      </div>
      <div className="h-[10dvh] flex items-center text-3xl font-light">
        Edit Substitutions
      </div>
      <div className="px-[min(3vw,50px)] h-[80%] w-[100%] flex flex-col overflow-y-scroll py-[4dvh] gap-[4dvh]">
        {teacherSubstitutions &&
        Object.keys(teacherSubstitutions).length > 0 ? (
          Object.keys(teacherSubstitutions).map((key, index) => {
            const temp = teacherSubstitutions[key];
            return (
              <div
                className={`flex flex-col gap-[10px] bg-[rgb(50,50,50)] p-[10px] rounded-[10px] ${
                  loading ? "animate-pulse" : ""
                }`}
              >
                {!loading ? (
                  <>
                    {Object.keys(temp).map((key2, index) => {
                      const temp2 = temp[key2];
                      return (
                        <span>
                          {key2} :{" "}
                          {key2 == "state" ? (
                            <select
                              className="bg-[rgb(70,70,70)] text-sm p-[5px] rounded-[5px]"
                              onChange={(e) => {
                                handleChange(e, key, key2);
                              }}
                            >
                              <option
                                className="bg-black text-sm"
                                value={temp2}
                              >
                                {temp2}
                              </option>
                              <option
                                className="bg-black text-sm"
                                value={"Completed"}
                              >
                                Completed
                              </option>
                              <option
                                className="bg-black text-sm"
                                value={"Cancelled"}
                              >
                                Cancelled
                              </option>
                            </select>
                          ) : key2 == "reason" ? (
                            <input
                              className="bg-[rgb(70,70,70)] rounded-[5px] text-sm p-[5px]"
                              value={temp2}
                              onChange={(e) => {
                                handleChange(e, key, key2);
                              }}
                            ></input>
                          ) : key2 == "sub_teacher_name" ? (
                            <TeacherEditDropdown
                              setTeacherSubstitutions={setTeacherSubstitutions}
                              temp={temp}
                              temp2={temp2}
                              teachers={teachers}
                              key1={key}
                            />
                          ) : (
                            temp2
                          )}
                        </span>
                      );
                    })}
                  </>
                ) : (
                  <div className="h-[10dvh]"></div>
                )}
              </div>
            );
          })
        ) : (
          <div>No Substitutions</div>
        )}
      </div>
    </div>
  );
}

export default EditSubstitutions;

function SubCard({ key2, index, temp }) {}

function TeacherEditDropdown({
  setTeacherSubstitutions,
  temp2,
  teachers,
  key1,
}) {
  return (
    <select
      onChange={(e) => {
        setTeacherSubstitutions((prevState) => {
          const temp = {
            ...prevState,
            [key1]: {
              ...prevState[key1],
              sub_teacher_id: teachers[e.target.value].id,
              sub_teacher_name: teachers[e.target.value].name,
            },
          };
          return temp;
        });
      }}
    >
      <option className="bg-backgroundc text-textc" value={temp2}>
        {temp2}
      </option>
      {teachers &&
        Object.keys(teachers)
          .filter((key) => teachers[key] !== temp2) // Exclude temp2 first
          .map((key) => (
            <option className="bg-backgroundc text-textc" key={key} value={key}>
              {teachers[key].name}
            </option>
          ))}
    </select>
  );
}
