import React, { useState } from "react";

function SubstitutionInfo({ info, component }) {
  const [toggleOverlay, setToggleOverlay] = useState(false);

  const openOverlay = (e) => {
    e.stopPropagation();
    setToggleOverlay(true);
    console.log(info);
  };

  const closeOverlay = () => {
    setToggleOverlay(false);
  };

  return (
    <>
      {/* Overlay */}
      {toggleOverlay && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 h-[100dvh] w-[100vw] bg-[rgba(30,30,30,0.5)] z-50 flex items-center justify-center"
          onClick={closeOverlay} // clicking on background closes
        >
          <div
            className="bg-backgroundh h-[50%] w-[80%] flex flex-col rounded-md text-textc"
            onClick={(e) => e.stopPropagation()} // clicking inside the box does NOT close
          >
            <div className=" flex items-center p-[min(5vw,20px)] border-b-[0.5px] border-borderc justify-between">
              <h1 className="text-heading font-bold">{info.subject_name}</h1>
              <span className="text-[min(0.7rem)]">
                {info.start_time} - {info.end_time}
              </span>
            </div>
            <div className="flex flex-row overflow-scroll">
              <div className="flex flex-col gap-[10px] h-full w-full items-start p-[min(3vw,50px)]">
                {[
                  "Teacher name : ",
                  "Duration : ",
                  "Sub Teacher name : ",
                  "Date : ",
                ].map((value, index) => {
                  return (
                    <span className="font-normal" key={index}>
                      {value}
                    </span>
                  );
                })}
              </div>
              <div className="flex flex-col gap-[10px] h-full w-full items-start p-[min(3vw,50px)]">
                {[
                  info.teacher_name || "none",
                  info.duration,
                  info.sub_teacher_name || "none",
                  `${info.dateNumber} ${info.day} - ${info.month}`,
                ].map((value, index) => {
                  return (
                    <span className="font-light text-borderc" key={index}>
                      {value}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div onClick={openOverlay} className="flex relative z-10">
        {component}
      </div>
    </>
  );
}

export default SubstitutionInfo;
