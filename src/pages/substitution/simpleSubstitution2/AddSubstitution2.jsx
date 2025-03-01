import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTeachStore from "../../../context/useTeachStore";
import {
  getAllTeachers,
  getTeacherTimetableByID,
  getTimetableGrouped,
} from "../../../../utils/fetchUtils";
import { useAnimation } from "../../../context/animation/AnimationManager";
import CalenderSelector from "../components/CalenderSelector";

function AddSubstitution2() {
  const navigate = useNavigate();
  const { setteachersubstitutionstosend } = useTeachStore();
  const teacherID = useTeachStore((state) => state.teacherid);
  const [selectedTeacherID, setSelectedTeacherID] = useState(null);
  const [teacherTimetable, setTeacherTimetable] = useState(null);
  const [selectedDates, setSelectedDates] = useState(
    useTeachStore((state) => state.teachersubstitutionstosend) ?? {}
  );
  const [selectedDatesPopup, setSelectedDatesPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState();
  const [pageLoad, setPageLoad] = useState(false);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!teacherID) {
        console.error("error : no teacher ID");
        return;
      }
      try {
        const { data, error } = await getTimetableGrouped(
          selectedTeacherID ?? teacherID
        );

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

    const fetchAllTeachers = async () => {
      const { data, error } = await getAllTeachers(teacherID);

      if (error) {
        console.error("error : ", error);
      }

      setTeachers(data);
      console.log(data);
    };

    fetchTimetable();
    fetchAllTeachers();
  }, [teacherID, selectedTeacherID]);

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
      <div
        className={`fixed h-[100dvh] w-[100vw] z-50 bg-black/50 left-0 right-0 ${
          pageLoad ? "opacity-100 " : "opacity-0 pointer-events-none"
        } transition-all duration-200 ease-in-out`}
      >
        <div
          className={`h-[10dvh] bg-black border-b-[1px] border-[rgb(70,70,70)] flex items-center gap-[20px] pl-[min(3vw,50px)] ${
            pageLoad ? "translate-y-[0dvh]" : "translate-y-[-10dvh]"
          } transition-all duration-200 ease-in-out`}
        >
          <svg
            width="17px"
            height="17px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin"
          >
            <path
              d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"
              stroke="rgb(200,200,200)"
              stroke-width="3.55556"
              stroke-linecap="round"
            />
          </svg>
          <span className="font-light text-xl animate-pulse">Loading</span>
        </div>
      </div>
      <SelectedClassesPopup
        selectedDatesPopup={selectedDatesPopup}
        setSelectedDatesPopup={setSelectedDatesPopup}
        selectedDates={selectedDates}
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
            setPageLoad(true);
            navigate("/confirmsubstitution2");
          }}
        >
          Confirm
        </button>
      </div>

      <div className="px-[20px] pb-[20px] flex flex-col w-[100%] h-[93dvh]">
        <div className="h-[4vh]"></div>
        <div className="flex flex-row items-center justify-between">
          {" "}
          <select
            onChange={(e) => {
              setSelectedTeacherID(e.target.value);
            }}
          >
            <option value={null}>None</option>
            {teachers && Object.keys(teachers).length > 0 ? (
              Object.keys(teachers).map((key, index) => {
                return (
                  <option value={teachers[key].id}>{teachers[key].name}</option>
                );
              })
            ) : (
              <option>Loading</option>
            )}
          </select>
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
            teacherID={selectedTeacherID}
            subTeacherID={teacherID}
            mode={2}
          ></CalenderSelector>
        )}
      </div>
    </div>
  );
}

export default AddSubstitution2;

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
