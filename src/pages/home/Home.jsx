import React, { useEffect, useState } from "react";
import { isUserLoggedIn } from "../../../utils/authUtils";
import { useNavigate } from "react-router-dom";
import useCheckStatus from "../../hooks/useCheckStatus";
import HomeContent from "./content/HomeContent";
import useTeachStore from "../../context/useTeachStore";
import { useAnimation } from "../../context/animation/AnimationManager";

function Home() {
  const navigate = useNavigate();
  const { startChecking, stopChecking } = useCheckStatus();
  const { teachername, teacherid, teacherdetails } = useTeachStore();
  const teacherDetails = useTeachStore((state) => state.teacherdetails);
  const teacherID = useTeachStore((state) => state.teacherid);
  const teacherName = useTeachStore((state) => state.teachername);
  const [sortMethod, setSortMethod] = useState({
    param: "date",
    type: "asc",
  });
  const { handleNavigation } = useAnimation();

  useEffect(() => {
    startChecking();
    // console.log("Started Checking");
    return () => stopChecking();
  }, [startChecking]);

  // useEffect(() => {
  //   setTeacherDetails(getStateData("teacherData") || null);
  //   setTeacherID(getStateData("teacherID") || null);
  //   setTeacherName(getStateData("teacherName") || null);
  // }, [getStateData]);

  useEffect(() => {
    if (teacherDetails) {
      // console.log(teacherID, teacherName);
    }
  }, [teacherDetails, teacherID, teacherName]);
  return (
    // Main wrapper
    <div className="fixed h-[100vh] w-[100vw] lg:w-[90vw] xl:w-[85vw] text-textc bg-backgroundc tracking-[0.2px] lg:ml-[10vw] xl:ml-[15vw] lg:pt-[6vh]">
      {/*  */}
      {/* Header */}
      {/*  */}
      <div className="h-[2vh] flex"></div>
      <div
        className="flex lg:items-center w-[100%] items-end px-[20px] lg:fixed lg:top-0 bg-backgroundc lg:left-0 z-10 lg:border-b-[1px] 
        border-[rgb(70,70,70)] lg:h-[10vh]"
      >
        <div className="flex items-center gap-[15px] w-[100%]">
          <div className="min-h-[35px] min-w-[35px] bg-white rounded-[100px]"></div>
          <span className="font-[15px] tracking-[0.5px] text-textc]">
            {teacherName || "unknown"}
          </span>
          {/*  */}
          {/* SearchBar */}
          {/*  */}
          <div className=" w-[100%] md:w-[70%] xl:w-[70vw] 2xl:w-[55vw] px-[20px] items-end hidden md:flex">
            <div className="flex items-center bg-white h-[6vh] w-[100%] rounded-[5px] px-[10px] gap-[15px]">
              <SearchIconSvg />
              <span className="text-textc font-medium">Search</span>
            </div>
          </div>
          {/*  */}
          {/*  */}

          <NotificationSvg />
        </div>
      </div>
      {/*  */}
      {/*  */}
      {/*  */}
      {/* SearchBar */}
      {/*  */}
      <div className="h-[4vh] md:hidden"></div>
      <div className=" w-[100%] px-[20px] flex items-end md:hidden">
        <div className="flex items-center bg-white h-[6vh] w-[100%] rounded-[5px] px-[10px] gap-[15px]">
          <SearchIconSvg />
          <span className="text-textc font-medium">Search</span>
        </div>
      </div>
      {/*  */}
      {/*  */}
      {/*  */}
      {/* Filters */}
      {/*  */}
      {/*  */}
      <div className=""></div>
      <div className="h-[4vh]"></div>
      <div className="flex items-end w-[100%] px-[30px]">
        <div className="flex items-center w-[100%] gap-[15px]">
          <div className="flex flex-row items-center gap-[5px]">
            <span className="font-medium text-textc]">Upcoming</span>
            <DropdownIconSvg />
          </div>
          <SortDropdown setSortMethod={setSortMethod} sortMethod={sortMethod} />
        </div>
      </div>
      {/*  */}
      {/*  */}
      {/*  */}
      {/* HomeContent */}
      {/*  */}
      {/*  */}
      <div className="h-[4vh]"></div>
      <div className="px-[30px] h-[100%] overflow-scroll no-scrollbar">
        <HomeContent sortInfo={sortMethod}></HomeContent>
      </div>
      {/*  */}
      {/*  */}
      {/*  */}
      {/* Footer */}
      {/*  */}
      {/*  */}
      <div
        className="fixed flex items-center justify-center bottom-[10vh] md:bottom-0 md:border-r-[1px] border-[rgb(70,70,70)] lg:left-0 lg:w-[10vw] lg:h-[100vh] xl:w-[15vw] 
        h-[10vh] w-[100%] lg:bg-backgroundc bg-gradient-to-b from-transparent to-80% to-black"
      >
        <div className="flex items-center justify-between w-[60%] lg:flex-col lg:gap-[30px] xl:w-[100%]">
          <div className="flex flex-col justify-between xl:flex-row h-[100%] items-center gap-[6px] xl:gap-[15px] xl:items-start xl:w-[50%] cursor-pointer">
            <HomeIconSvg />
            <span className="text-textc xl:text-textc] xl:w-[100px] text-textcr">
              Home
            </span>
          </div>
          <div
            className="flex flex-col justify-between xl:flex-row h-[100%] items-center gap-[6px] xl:gap-[15px] xl:items-start xl:w-[50%] cursor-pointer"
            onClick={() => {
              // navigate("/addsubstitution");
              handleNavigation("/addsubstitution");
            }}
          >
            <PlusIconSvg />
            <span className="text-textc xl:text-textc] xl:w-[100px] text-textcr">
              New
            </span>
          </div>
          <div className="flex flex-col justify-between xl:flex-row h-[100%] items-center gap-[6px] xl:gap-[15px] xl:items-start xl:w-[50%] cursor-pointer">
            <ProfileIconSvg />
            <span className="text-textc xl:text-textc] xl:w-[100px] text-textcr">
              Profile
            </span>
          </div>
        </div>
      </div>
      {/*  */}
      {/*  */}
    </div>
  );
}

export default Home;

function NotificationSvg({}) {
  return (
    <svg
      width="25px"
      height="25px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ml-auto"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.33497 4.72727V5.25342C6.64516 6.35644 4.76592 9.97935 4.83412 13.1192L4.83409 14.8631C3.45713 16.6333 3.53815 19.2727 6.9735 19.2727H9.33497C9.33497 19.996 9.61684 20.6897 10.1186 21.2012C10.6203 21.7127 11.3008 22 12.0104 22C12.72 22 13.4005 21.7127 13.9022 21.2012C14.404 20.6897 14.6858 19.996 14.6858 19.2727H17.0538C20.4826 19.2727 20.5323 16.6278 19.1555 14.8576L19.1938 13.1216C19.2631 9.97811 17.3803 6.35194 14.6858 5.25049V4.72727C14.6858 4.00396 14.404 3.31026 13.9022 2.7988C13.4005 2.28734 12.72 2 12.0104 2C11.3008 2 10.6203 2.28734 10.1186 2.7988C9.61684 3.31026 9.33497 4.00395 9.33497 4.72727ZM12.9022 4.72727C12.9022 4.74573 12.9017 4.76414 12.9006 4.78246C12.6101 4.74603 12.3142 4.72727 12.014 4.72727C11.7113 4.72727 11.413 4.74634 11.1203 4.78335C11.1192 4.76474 11.1186 4.74603 11.1186 4.72727C11.1186 4.48617 11.2126 4.25494 11.3798 4.08445C11.547 3.91396 11.7739 3.81818 12.0104 3.81818C12.2469 3.81818 12.4738 3.91396 12.641 4.08445C12.8083 4.25494 12.9022 4.48617 12.9022 4.72727ZM11.1186 19.2727C11.1186 19.5138 11.2126 19.7451 11.3798 19.9156C11.547 20.086 11.7739 20.1818 12.0104 20.1818C12.2469 20.1818 12.4738 20.086 12.641 19.9156C12.8083 19.7451 12.9022 19.5138 12.9022 19.2727H11.1186ZM17.0538 17.4545C17.8157 17.4545 18.2267 16.5435 17.7309 15.9538C17.49 15.6673 17.3616 15.3028 17.3699 14.9286L17.4106 13.0808C17.4787 9.99416 15.0427 6.54545 12.014 6.54545C8.98598 6.54545 6.55028 9.99301 6.61731 13.0789L6.65748 14.9289C6.66561 15.303 6.53726 15.6674 6.29639 15.9538C5.80054 16.5435 6.21158 17.4545 6.9735 17.4545H17.0538Z"
        fill="rgb(255,255,255)"
      />
    </svg>
  );
}

function SearchIconSvg({}) {
  return (
    <svg
      width="25px"
      height="25px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="min-w-[25px] min-h-[25px]"
    >
      <path
        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
        stroke="#000000"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function DropdownIconSvg({}) {
  return (
    <svg
      width="15px"
      height="15px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <title>drop-down</title>
      <desc>Created with sketchtool.</desc>
      <g
        id="directional"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g id="drop-down" fill="rgb(255,255,255)">
          <polygon id="Shape" points="5 8 12 16 19 8"></polygon>
        </g>
      </g>
    </svg>
  );
}

function SortIconSvg({}) {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ml-auto"
    >
      <path
        d="M22 7L2 7"
        stroke="rgb(255,255,255)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M19 12L5 12"
        stroke="rgb(255,255,255)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M16 17H8"
        stroke="rgb(255,255,255)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}

function HomeIconSvg({}) {
  return (
    <svg
      width="25px"
      height="25px"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z" // fill="rgb(255,255,255)"
        stroke="rgb(255,255,255"
        strokeWidth="2"
      />
    </svg>
  );
}

function PlusIconSvg({}) {
  return (
    <svg
      width="29px"
      height="29px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44771 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8Z"
        fill="rgb(255,255,255)"
        stroke="white"
        stroke-width="1"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
        fill="rgb(255,255,255)"
        stroke="white"
        stroke-width="1"
      />
    </svg>
  );
}

function ProfileIconSvg({}) {
  return (
    <svg
      width="25px"
      height="25px"
      viewBox="0 0 20 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <title>profile_round [#1342]</title>
      <desc>Created with Sketch.</desc>
      <defs></defs>
      <g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g
          id="Dribbble-Light-Preview"
          transform="translate(-140.000000, -2159.000000)"
          fill="rgb(255,255,255)"
        >
          <g id="icons" transform="translate(56.000000, 160.000000)">
            <path
              d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598"
              id="profile_round-[#1342]"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

function SortDropdown({ sortMethod, setSortMethod }) {
  const [dropped, setDropped] = useState(false);

  return (
    <div className="relative flex w-[100%]">
      {/* Dropdown Menu */}
      <div
        className={`absolute flex flex-col h-[30vh] w-[100%] bg-backgroundc ml-auto z-30 
        rounded-[10px] p-[10px] transition-all duration-300 ease-in-out 
        ${
          dropped
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Cancel Button */}
        <div className="flex w-[100%] justify-end">
          <button className="text-textc" onClick={() => setDropped(false)}>
            Cancel
          </button>
        </div>

        <div className="h-[4vh]"></div>

        {/* Options */}
        <div className="flex flex-col items-end w-[100%] pr-[20px] font-[15px]">
          <div
            className="h-[6vh] cursor-pointer text-textc hover:opacity-80 transition-all duration-200 ease-in-out "
            style={{
              color: sortMethod.param == "date" ? "white" : "gray",
            }}
            onClick={() => {
              setSortMethod((prevState) => ({ ...prevState, param: "date" }));
              setDropped(false);
            }}
          >
            Date
          </div>
          <div
            className="h-[6vh] cursor-pointer text-textc hover:opacity-80 transition-all duration-200 ease-in-out "
            onClick={() => {
              setSortMethod((prevState) => ({
                ...prevState,
                param: "subject",
              }));
              setDropped(false);
            }}
            style={{
              color: sortMethod.param == "subject" ? "white" : "gray",
            }}
          >
            Subject
          </div>
          <div
            className="h-[6vh] cursor-pointer text-textc hover:opacity-80 transition-all duration-200 ease-in-out "
            onClick={() => {
              setSortMethod((prevState) => ({
                ...prevState,
                param: "teacher",
              }));
              setDropped(false);
            }}
            style={{
              color: sortMethod.param == "teacher" ? "white" : "gray",
            }}
          >
            Teacher
          </div>
        </div>
      </div>

      {/* Backdrop (closes dropdown on click) */}
      <div
        className={`fixed h-[100%] w-[100vw] left-0 top-0 backdrop-blur-[2px] z-20 
        transition-opacity duration-300 ease-in-out 
        ${dropped ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setDropped(false)}
      ></div>

      {/* Dropdown Toggle Button */}
      {!dropped && (
        <div
          className="ml-auto cursor-pointer"
          onClick={() => setDropped(true)}
        >
          <SortIconSvg />
        </div>
      )}
    </div>
  );
}
