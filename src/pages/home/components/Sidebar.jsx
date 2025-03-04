import React, { useEffect, useState } from "react";
import useTeachStore from "../../../context/useTeachStore";
import { useNavigate } from "react-router-dom";
export function Sidebar({ sidebarState, setSidebarState, setType }) {
  const teacherName = useTeachStore((state) => state.teachername);
  const navigate = useNavigate();
  const [pageLoad, setPageLoad] = useState(false);

  useEffect(() => {
    console.log(teacherName);
  }, [teacherName]);
  return (
    <div
      className={`left-0 top-0 fixed h-[100dvh] w-[100vw] backdrop-blur-sm z-50 ${
        !sidebarState ? "translate-x-[-100vw]" : ""
      } transition-all duration-200 ease-in-out`}
      onClick={() => {
        setSidebarState(false);
      }}
    >
      <div
        className={`fixed h-[100dvh] w-[100vw] z-50 bg-black/50 left-0 right-0 top-0 bottom-0 ${
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
      <div className="flex flex-col h-[100dvh] w-[min(80vw,300px)] bg-backgroundc">
        <div className="h-[15dvh] w-[100%] flex items-center justify-start pl-[min(3vw,50px)] text-3xl border-b-[1px] border-[rgb(50,50,50)]">
          {teacherName ? (
            <span>{teacherName}</span>
          ) : (
            <div className="h-[5dvh] w-[40vw] bg-[rgb(50,50,50) animate-pulse]"></div>
          )}
        </div>
        <div className="h-[70dvh]  px-[min(3vw,50px)] text-[max(1.5vw,20px)]">
          <div className="flex flex-col gap-[4dvh] font-light  border-b-[1px] border-[rgb(50,50,50)] py-[min(3vw,50px)]">
            <span
              onClick={() => {
                setType("sent");
                setSidebarState(false);
              }}
              className={`cursor-pointer`}
            >
              Sent
            </span>
            <span
              onClick={() => {
                setType("rec");
                setSidebarState(false);
              }}
              className={`cursor-pointer`}
            >
              Recieved
            </span>
            <span
              onClick={() => {
                setType("draft");
                setSidebarState(false);
              }}
              className={`cursor-pointer`}
            >
              Draft
            </span>
            <span
              onClick={() => {
                setType("deleted");
                setSidebarState(false);
              }}
              className="cursor-pointer"
            >
              Recycle Bin
            </span>
          </div>
          <div className="flex flex-col gap-[4dvh] font-light  border-b-[1px] border-[rgb(50,50,50)] py-[min(3vw,50px)]">
            <span className="cursor-pointer">Timetable</span>
          </div>
        </div>
        <div
          className="h-[10dvh] mt-auto border-t-[1px] border-[rgb(50,50,50)] flex items-center px-[min(3vw,50px)]
        justify-start gap-[20px] cursor-pointer"
        >
          <svg
            width="25px"
            height="25px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"
              fill="rgb(255,255,255)"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 1.25C11.2954 1.25 10.6519 1.44359 9.94858 1.77037C9.26808 2.08656 8.48039 2.55304 7.49457 3.13685L6.74148 3.58283C5.75533 4.16682 4.96771 4.63324 4.36076 5.07944C3.73315 5.54083 3.25177 6.01311 2.90334 6.63212C2.55548 7.25014 2.39841 7.91095 2.32306 8.69506C2.24999 9.45539 2.24999 10.3865 2.25 11.556V12.444C2.24999 13.6135 2.24999 14.5446 2.32306 15.3049C2.39841 16.0891 2.55548 16.7499 2.90334 17.3679C3.25177 17.9869 3.73315 18.4592 4.36076 18.9206C4.96771 19.3668 5.75533 19.8332 6.74148 20.4172L7.4946 20.8632C8.48038 21.447 9.2681 21.9135 9.94858 22.2296C10.6519 22.5564 11.2954 22.75 12 22.75C12.7046 22.75 13.3481 22.5564 14.0514 22.2296C14.7319 21.9134 15.5196 21.447 16.5054 20.8632L17.2585 20.4172C18.2446 19.8332 19.0323 19.3668 19.6392 18.9206C20.2669 18.4592 20.7482 17.9869 21.0967 17.3679C21.4445 16.7499 21.6016 16.0891 21.6769 15.3049C21.75 14.5446 21.75 13.6135 21.75 12.4441V11.556C21.75 10.3866 21.75 9.45538 21.6769 8.69506C21.6016 7.91095 21.4445 7.25014 21.0967 6.63212C20.7482 6.01311 20.2669 5.54083 19.6392 5.07944C19.0323 4.63324 18.2447 4.16683 17.2585 3.58285L16.5054 3.13685C15.5196 2.55303 14.7319 2.08656 14.0514 1.77037C13.3481 1.44359 12.7046 1.25 12 1.25ZM8.22524 4.44744C9.25238 3.83917 9.97606 3.41161 10.5807 3.13069C11.1702 2.85676 11.5907 2.75 12 2.75C12.4093 2.75 12.8298 2.85676 13.4193 3.13069C14.0239 3.41161 14.7476 3.83917 15.7748 4.44744L16.4609 4.85379C17.4879 5.46197 18.2109 5.89115 18.7508 6.288C19.2767 6.67467 19.581 6.99746 19.7895 7.36788C19.9986 7.73929 20.1199 8.1739 20.1838 8.83855C20.2492 9.51884 20.25 10.378 20.25 11.5937V12.4063C20.25 13.622 20.2492 14.4812 20.1838 15.1614C20.1199 15.8261 19.9986 16.2607 19.7895 16.6321C19.581 17.0025 19.2767 17.3253 18.7508 17.712C18.2109 18.1089 17.4879 18.538 16.4609 19.1462L15.7748 19.5526C14.7476 20.1608 14.0239 20.5884 13.4193 20.8693C12.8298 21.1432 12.4093 21.25 12 21.25C11.5907 21.25 11.1702 21.1432 10.5807 20.8693C9.97606 20.5884 9.25238 20.1608 8.22524 19.5526L7.53909 19.1462C6.5121 18.538 5.78906 18.1089 5.24923 17.712C4.72326 17.3253 4.419 17.0025 4.2105 16.6321C4.00145 16.2607 3.88005 15.8261 3.81618 15.1614C3.7508 14.4812 3.75 13.622 3.75 12.4063V11.5937C3.75 10.378 3.7508 9.51884 3.81618 8.83855C3.88005 8.1739 4.00145 7.73929 4.2105 7.36788C4.419 6.99746 4.72326 6.67467 5.24923 6.288C5.78906 5.89115 6.5121 5.46197 7.53909 4.85379L8.22524 4.44744Z"
              fill="rgb(255,255,255)"
            />
          </svg>
          <span
            className="font-light"
            onClick={() => {
              setPageLoad(false);
              navigate("/settings");
            }}
          >
            Settings and Account
          </span>
        </div>
      </div>
    </div>
  );
}
