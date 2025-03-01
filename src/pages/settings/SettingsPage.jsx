import React from "react";
import useTeachStore from "../../context/useTeachStore";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const teacherName = useTeachStore((state) => state.teachername);
  const navigate = useNavigate();
  return (
    <div className="h-[100dvh] w-[100vw] bg-backgroundc text-textc">
      <div
        className="h-[7dvh] flex items-center border-b-[1px] border-[rgb(100,100,100)] pl-[min(3vw,50px)] bg-[rgb(30,30,30)]"
        onClick={() => {
          navigate("/home");
        }}
      >
        Back
      </div>
      <div className="h-[30dvh] px-[min(3vw,50px)] flex flex-col justify-evenly border-b-[1px] border-[rgb(100,100,100)] bg-[rgb(30,30,30)]">
        <span className="text-3xl font-light pl-[min(3vw,50px)]">
          {teacherName ? `${teacherName}` : "none"}
        </span>
        <div className="h-[10dvh] flex flex-row items-center justify-evenly pl-[min(3vw,50px)]">
          <span>Sent</span>
          <span>Recieved</span>
        </div>
      </div>
      <div className="flex flex-col font-light">
        {["Personal Details", "Security", "Availability"].map((name, index) => {
          return (
            <span className="py-[1dvh] flex items-center border-b-[1px] border-[rgb(50,50,50)] pl-[min(3vw,50px)]">
              {name}
            </span>
          );
        })}
      </div>
      <div className="h-[1dvh] bg-[rgb(30,30,30)] "></div>
      <div className="flex flex-col font-light">
        {["Theme", "Accent Color", "Font Style"].map((name, index) => {
          return (
            <span className="py-[1dvh] flex items-center border-b-[1px] border-[rgb(50,50,50)] pl-[min(3vw,50px)]">
              {name}
            </span>
          );
        })}
      </div>
      <div className="h-[1dvh] bg-[rgb(30,30,30)] "></div>
      <div className="flex flex-col font-light">
        {["Timetabale", "Timetable Editor"].map((name, index) => {
          return (
            <span className="py-[1dvh] flex items-center border-b-[1px] border-[rgb(50,50,50)] pl-[min(3vw,50px)]">
              {name}
            </span>
          );
        })}
      </div>
      <div className="h-[1dvh] bg-[rgb(30,30,30)] "></div>
      <div className="flex flex-col font-light">
        {["Account"].map((name, index) => {
          return (
            <span className="py-[1dvh] flex items-center border-b-[1px] border-[rgb(50,50,50)] pl-[min(3vw,50px)]">
              {name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsPage;
