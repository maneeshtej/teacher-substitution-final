import React from "react";
import { useNavigate } from "react-router-dom";

function SelectorPage() {
  const navigate = useNavigate();
  return (
    <div className="h-[100dvh] w-[100%]">
      <div className="h-[10dvh] flex items-center border-b-[1px] border-[rgb(50,50,50)] px-[min(3vw,50px)]">
        <button
          className="cursor-pointer"
          onClick={() => {
            navigate("/home");
          }}
        >
          Back
        </button>
      </div>
      <div className="h-[100%] w-[100%] px-[min(3vw,50px)] gap-[4dvh] flex flex-col">
        <div className="h-[5dvh]"></div>
        <div
          className="h-[10dvh] flex items-center justify-center bg-[rgb(50,50,50)] rounded-[5px] cursor-pointer"
          onClick={() => {
            navigate("/addsubstitution");
          }}
        >
          Give Class
        </div>
        <div
          className="h-[10dvh] flex items-center justify-center bg-[rgb(50,50,50)] rounded-[5px] cursor-pointer"
          onClick={() => {
            navigate("/addsubstitution2");
          }}
        >
          Take Class
        </div>
      </div>
    </div>
  );
}

export default SelectorPage;
