import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function SuccessfullSubstitution() {
  const [stage, setStage] = useState(0);
  const location = useLocation();
  const teacherSubstitutions = location.state.data ?? "None man";

  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] w-[100%]">
      <div
        className={`${
          stage == 0 ? "h-[100dvh]" : "h-[10dvh]"
        } w-[100%] bg-green-400 transition-all duration-500 ease-in-out flex flex-col ${
          stage == 0 ? "items-center" : "items-start"
        } overflow-hidden `}
        onClick={() => setStage(1)}
      >
        <SuccessSvg
          style={`mt-[30dvh] animate-bounce ${
            stage == 0 ? "inline" : "hidden"
          }`}
        />
        <span
          className={`text-4xl font-bold ${stage == 0 ? "inline" : "hidden"}`}
        >
          Success
        </span>
        <span
          className={`mt-[20dvh] animate-floatup ${
            stage == 0 ? "inline" : "hidden"
          }`}
        >
          Succesfully Added Substitutions
        </span>
      </div>
      <div className="h-[100dvh] w-[100%] ">
        {teacherSubstitutions ??
        Object.keys(teacherSubstitutions).length > 0 ? (
          Object.keys(teacherSubstitutions).map((key, index) => {
            const classItem = teacherSubstitutions[key];
            return (
              <div
                className={`min-h-[10dvh] flex "bg-[rgb(50,50,50)]"
                    border-[1px] border-[rgb(50,50,50)] rounded-[10px] px-[min(4vw,50px)] text-[min(3vw,10px)] py-[min(2vw,20px)]
                  font-light transition-all duration-200 ease-in-out`}
                onClick={() => {
                  navigate("/home/subdetails", {
                    state: { data: classItem },
                  });
                }}
              >
                <div className="flex flex-row w-[100%]">
                  <div className="w-[45%] flex flex-col items-start justify-evenly ">
                    <div className="font-medium text-[min(3.5vw,20px)]">
                      {classItem.subject_name}
                    </div>
                    <div>Teacher : {classItem.sub_teacher_name}</div>
                  </div>
                  <div className="w-[55%] flex flex-col justify-evenly border-l-[1px] border-[rgb(100,100,100)] pl-[min(3vw,30px)]">
                    <div className="flex flex-row gap-[10px] justify-between">
                      <span>{classItem.reason}</span>
                      <span>{classItem.date_of_period}</span>
                    </div>
                    <div className="flex flex-row gap-[10px] justify-between">
                      <span>{classItem.state}</span>
                      <span>{classItem.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>No</div>
        )}
      </div>
    </div>
  );
}

export default SuccessfullSubstitution;

function SuccessSvg({ style }) {
  return (
    <svg
      fill="rgb(255,255,255)"
      width="150px"
      height="150px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={style}
    >
      <path
        fill-rule="evenodd"
        d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M15.2928932,8.29289322 L10,13.5857864 L8.70710678,12.2928932 C8.31658249,11.9023689 7.68341751,11.9023689 7.29289322,12.2928932 C6.90236893,12.6834175 6.90236893,13.3165825 7.29289322,13.7071068 L9.29289322,15.7071068 C9.68341751,16.0976311 10.3165825,16.0976311 10.7071068,15.7071068 L16.7071068,9.70710678 C17.0976311,9.31658249 17.0976311,8.68341751 16.7071068,8.29289322 C16.3165825,7.90236893 15.6834175,7.90236893 15.2928932,8.29289322 Z"
      />
    </svg>
  );
}
