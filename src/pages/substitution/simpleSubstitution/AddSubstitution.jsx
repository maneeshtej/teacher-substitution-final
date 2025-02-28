import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTeachStore from "../../../context/useTeachStore";
import {
  getTeacherTimetableByID,
  getTimetableGrouped,
} from "../../../../utils/fetchUtils";
import { useAnimation } from "../../../context/animation/AnimationManager";
import CalenderSelector from "../components/CalenderSelector";

function AddSubstitution() {
  const navigate = useNavigate();
  const { setteachersubstitutionstosend } = useTeachStore();
  const teacherID = useTeachStore((state) => state.teacherid);
  const [teacherTimetable, setTeacherTimetable] = useState(null);
  const [selectedDates, setSelectedDates] = useState(
    useTeachStore((state) => state.teachersubstitutionstosend) ?? {}
  );
  const [selectedDatesPopup, setSelectedDatesPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!teacherID) {
        console.error("error : no teacher ID");
        return;
      }
      try {
        const { data, error } = await getTimetableGrouped(teacherID);

        if (error) {
          console.error("error : ", error);
          return;
        }

        if (data) {
          setTeacherTimetable(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("error : ", error);
      }
    };

    fetchTimetable();
  }, [teacherID]);

  useEffect(() => {
    // console.log(teacherTimetable);
  }, teacherTimetable);

  useEffect(() => {
    console.log(selectedDates);
    setteachersubstitutionstosend(selectedDates);
  }, [selectedDates]);

  console.log(teacherID);
  return (
    <div className="fixed flex flex-col h-[100dvh] w-[100vw] bg-backgroundc text-textc px-[20px]  py-[20px]">
      <SelectedClassesPopup
        selectedDatesPopup={selectedDatesPopup}
        setSelectedDatesPopup={setSelectedDatesPopup}
        selectedDates={selectedDates}
        teacherID={teacherID}
        mode={1}
      />
      <div className="flex flex-row items-center justify-between min-h-[7dvh]">
        <button
          className="font-extralight cursor-pointer"
          onClick={() => {
            //   navigate("/home");
            navigate("/home");
            setteachersubstitutionstosend(null);
          }}
        >
          Back
        </button>
        <button
          className="font-extralight"
          onClick={() => {
            //   navigate("/home");
            navigate("/confirmsubstitution");
          }}
        >
          Confirm
        </button>
      </div>

      <div className="px-[20px] pb-[20px] flex flex-col w-[100%] h-[93dvh]">
        <div className="h-[4vh]"></div>
        <div className="flex flex-row items-center justify-between">
          {" "}
          <span className=" text-[min(5vw,20px)] font-light tracking-wide">
            Add Substitution
          </span>
          <button
            className="text-[min(5vw,20px)] font-light tracking-wide cursor-pointer"
            onClick={() => {
              setSelectedDatesPopup(true);
            }}
          >
            Selected Dates :{" "}
            {selectedDates && Object.keys(selectedDates).length >= 0
              ? Object.keys(selectedDates).length
              : "none"}
          </button>
        </div>

        <div className="h-[4vh]"></div>
        {loading ? (
          <div className="h-[80%] w-[100%] bg-[rgb(50,50,50)] animate-pulse rounded-[10px]"></div>
        ) : (
          <CalenderSelector
            teacherTimeTable={teacherTimetable}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            teacherID={teacherID}
          ></CalenderSelector>
        )}
      </div>
    </div>
  );
}

export default AddSubstitution;

function SelectedClassesPopup({
  selectedDatesPopup,
  setSelectedDatesPopup,
  selectedDates,
}) {
  return (
    <div
      className="fixed h-[100dvh] w-[100vw] backdrop-blur-lg left-0 top-0 transition-all duration-200 ease-in-out"
      style={{
        opacity: selectedDatesPopup ? "1" : "0",
        pointerEvents: selectedDatesPopup ? "all" : "none",
      }}
    >
      <div className="h-[10dvh] flex items-center pl-[min(10vw,50px)] ">
        <button
          className="font-light text-lg tracking-wide cursor-pointer"
          onClick={() => {
            setSelectedDatesPopup(false);
          }}
        >
          Close
        </button>
      </div>
      <div className="h-[93dvh] px-[min(20vw,100px)] flex flex-col gap-[20px] overflow-scroll">
        {selectedDates && Object.keys(selectedDates).length > 0 ? (
          Object.keys(selectedDates).map((classItems, index) => {
            console.log(selectedDates[classItems]);

            return (
              <div key={index} className="flex flex-col border-b-[0.5px]">
                {selectedDates[classItems] &&
                Object.keys(selectedDates[classItems]).length > 0 ? (
                  Object.keys(selectedDates[classItems]).map((item, idx) => (
                    <span key={idx}>
                      {item} : {selectedDates[classItems][item]}
                    </span>
                  ))
                ) : (
                  <div>No data</div>
                )}
              </div>
            );
          })
        ) : (
          <div>No Classes</div>
        )}
        <div className="flex h-[50dvh]"></div>
      </div>
    </div>
  );
}
