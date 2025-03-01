import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectorPage() {
  const navigate = useNavigate();
  const [pageLoad, setPageLoad] = useState(false);
  return (
    <div className="h-[100dvh] w-[100%] bg-backgroundc text-textc">
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
      <div className="h-[10dvh] flex items-center border-b-[1px] border-[rgb(50,50,50)] px-[min(3vw,50px)]">
        <button
          className="cursor-pointer"
          onClick={() => {
            setPageLoad(true);
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
            setPageLoad(true);
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
