import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTeachStore from "../../context/useTeachStore";
import { getTeacherTimetableByID } from "../../../utils/fetchUtils";
import { useAnimation } from "../../context/animation/AnimationManager";

function AddSubstitution() {
  const navigate = useNavigate();
  const teacherID = useTeachStore((state) => state.teacherid);
  const [teacherTimetable, setTeacherTimetable] = useState(null);
  const { handleNavigation } = useAnimation();

  useEffect(() => {
    const fetchSubstitutions = async () => {
      if (!teacherID) {
        console.error("error : no teacher ID");
        return;
      }
      try {
        const { data, error } = await getTeacherTimetableByID(teacherID);

        if (error) {
          console.error("error : ", error);
          return;
        }

        if (data) {
          setTeacherTimetable(data);
        }
      } catch (error) {
        console.error("error : ", error);
      }
    };

    fetchSubstitutions();
  }, [teacherID]);

  useEffect(() => {
    console.log(teacherTimetable);
  }, teacherTimetable);

  console.log(teacherID);
  return (
    <div className="fixed h-[100vh] w-[100vw] bg-backgroundc text-textc px-[20px] pt-[20px]">
      <span
        className="font-extralight"
        onClick={() => {
          //   navigate("/home");
          handleNavigation("/home");
        }}
      >
        Back
      </span>
      <div className="pl-[20px]">
        <div className="h-[4vh]"></div>
        <span className="text-[30px] font-light tracking-wide">
          Add Substitution
        </span>
        <div className="h-[4vh]"></div>
      </div>
    </div>
  );
}

export default AddSubstitution;
