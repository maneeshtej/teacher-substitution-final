import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeSubstitutions } from "../../../utils/editAndRemoveUtils"; // Assuming this path is correct relative to src

function SubstitutionDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const substitutionData = location.state?.data;
  console.log(substitutionData);

  const handleEdit = () => {
    if (!substitutionData) {
      return;
    }

    const selectedSubstitutions = [substitutionData];
    navigate("/editsubstitution", {
      state: { selectedSubstitutions },
    });
  };

  const handleDelete = () => {
    console.log("Deleting Substitution:", substitutionData);

    if (!substitutionData?.sub_id) {
      console.error("Error: No valid substitution ID found");
      return;
    }

    removeSubstitutions([substitutionData.sub_id]); // Assuming this function handles async/state updates if needed

    navigate("/home");
  };

  // Basic check if data exists
  if (!substitutionData) {
    return (
      <div className="fixed bg-backgroundc h-[100vh] w-[100vw] flex items-center justify-center text-textc">
        Loading details or no data provided...
        {/* Optionally add a button to go back */}
        <button onClick={() => navigate("/home")} className="ml-4 p-2 border rounded">Go Back</button>
      </div>
    );
  }


  return (
    <div className="fixed bg-backgroundc h-[100vh] w-[100vw] overflow-hidden">
      {/* Header */}
      <div className="flex flex-row h-[10vh] items-center pl-[20px] border-b border-borderc"> {/* Use standard border class */}
        <span
          className="text-textc text-[20px] font-light cursor-pointer flex items-center gap-[10px]"
          onClick={() => navigate("/home")}
        >
          {/* Back Arrow SVG - Consider making this a reusable component */}
          <svg className="h-6 w-6" // Control size with Tailwind
            fill="currentColor" // Inherit color from parent (text-textc)
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg">
            {/* Removed redundant fill attributes from paths */}
            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/>
            <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/>
          </svg>
        </span>
      </div>

      {/* Content Area */}
      <div className="h-[90vh] px-[20px] overflow-y-scroll overflow-x-hidden no-scrollbar pb-10"> {/* Added padding-bottom */}
        <div className="h-[4vh]"></div>
        <div className="w-full flex items-center flex-row mb-4"> {/* Added margin-bottom */}
          <span className="text-[30px] text-textc font-extralight tracking-wide">
            Details
          </span>
          <div className="ml-auto flex gap-[20px] text-textc">
            <button
              className="cursor-pointer font-light hover:text-white transition-colors" // Added hover effect
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="cursor-pointer font-light text-red-500 hover:text-red-400 transition-colors" // Style delete distinctly
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Main Details Section */}
        <div className="pl-[20px]"> {/* Removed h-[100%] which might conflict with scrolling */}
          <div className="h-[4vh]"></div>
          <div className="text-textc">
            <h1 className="text-[2rem] font-light mb-4">{substitutionData["subject_name"]}</h1> {/* Added margin-bottom */}
            <div className="flex flex-wrap gap-[10px] mb-6"> {/* Added margin-bottom */}

              {/* --- Corrected Teacher Info Box --- */}
              {/* Teacher Name */}
             <InfoBox name={"Teacher Name"} param={substitutionData["sub_teacher_name"]} icon={<TeacherSVGIcon />}/>
             {/* Date */}
             <InfoBox name={"Date of Period"} param={substitutionData["date_of_period"]} icon={<DateIcon />} />

              {/* Add other similar boxes here if needed */}

            </div>
          </div>

          {/* Raw Data Display (Consider formatting this better) */}
          <div className="space-y-2"> {/* Add spacing between key-value pairs */}
            {Object.keys(substitutionData).map((key) => (
              <div className="flex text-textc text-sm" key={key}> {/* Added key prop */}
                <span className="min-w-[150px] font-light capitalize"> {/* Adjusted width, added capitalize */}
                  {key.replace(/_/g, ' ')} : {/* Replace underscores for readability */}
                </span>
                <span className="text-gray-300 break-all"> {/* Lighter color for value, allow word break */}
                  {String(substitutionData[key] ?? "none")} {/* Ensure value is string */}
                </span>
              </div>
            ))}
          </div>

          {/* Add some space at the bottom for scroll buffer */}
          <div className="h-[10vh]"></div>
        </div>
      </div>
    </div>
  );
}

const TeacherSVGIcon = () => {
  return (
    <svg
        className="w-12 h-12 mb-1 text-textc" // Tailwind size, margin, ensure color
        fill="currentColor" // Use currentColor to inherit text color
        viewBox="0 0 64 64"
        version="1.1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" // Removed inline style, width, height, redundant fill
        aria-hidden="true" // Added for accessibility as the text describes it
        height="20px"
        width="20px"
      >
        {/* Optional: Add a <title> for better accessibility */}
        {/* <title>Information Icon</title> */}
        <g id="ICON">
          {/* Removed fill from path, it will inherit from svg's fill="currentColor" */}
          <path d="M60,3.5l-56,-0c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1l2.171,-0c-0.111,0.313 -0.171,0.649 -0.171,1l-0,10.176c-0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l0,-6.676l44,-0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1l-44,-0l0,-1.5c0,-0.552 0.448,-1 1,-1l46,-0c0.552,-0 1,0.448 1,1c0,0 -0,30.5 -0,30.5c-0,0.552 -0.448,1 -1,1l-23,-0l-0,-10.25c-0,-6.075 -4.925,-11 -11,-11c-0.665,0 -1.335,0 -2,0c-6.075,0 -11,4.925 -11,11l0,17.542c-1.104,0.329 -2.12,0.929 -2.95,1.758c-1.313,1.313 -2.05,3.093 -2.05,4.95c0,3.799 0,8 0,8c0,0.552 0.448,1 1,1l32,-0c0.552,-0 1,-0.448 1,-1l-0,-8c0,-1.857 -0.737,-3.637 -2.05,-4.95c-0.83,-0.829 -1.846,-1.429 -2.95,-1.758l-0,-5.292l23,0c1.657,-0 3,-1.343 3,-3l0,-30.5c-0,-0.351 -0.06,-0.687 -0.171,-1l2.171,-0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1Zm-30,43.5l-4.083,0c-0.477,2.836 -2.946,5 -5.917,5c-2.971,-0 -5.44,-2.164 -5.917,-5l-4.083,0c-1.326,-0 -2.598,0.527 -3.536,1.464c-0.937,0.938 -1.464,2.21 -1.464,3.536c0,0 0,7 0,7l4,-0l0,-4c0,-0.552 0.448,-1 1,-1c0.552,0 1,0.448 1,1l0,4l18,-0l0,-4c0,-0.552 0.448,-1 1,-1c0.552,0 1,0.448 1,1l0,4l4,-0l0,-7c0,-1.326 -0.527,-2.598 -1.464,-3.536c-0.938,-0.937 -2.21,-1.464 -3.536,-1.464Zm-6.126,0l-7.748,0c0.445,1.724 2.012,3 3.874,3c1.862,-0 3.429,-1.276 3.874,-3Zm6.126,-2l-20,-0c0,0 0,-17.25 0,-17.25c0,-4.971 4.029,-9 9,-9c0.665,0 1.335,0 2,0c4.971,0 9,4.029 9,9l0,17.25Zm-2,-17c-0,-0.552 -0.448,-1 -1,-1l-6.382,0c0,-0 -1.724,-3.447 -1.724,-3.447c-0.169,-0.339 -0.515,-0.553 -0.894,-0.553c-0.379,-0 -0.725,0.214 -0.894,0.553l-1.724,3.447c-0,0 -2.382,0 -2.382,0c-0.552,0 -1,0.448 -1,1l0,10c0,2.761 2.239,5 5,5c1.881,0 4.119,0 6,0c2.761,-0 5,-2.239 5,-5c-0,-4.138 -0,-10 -0,-10Zm-2,1l-0,9c-0,1.657 -1.343,3 -3,3c-0,-0 -6,0 -6,0c-1.657,-0 -3,-1.343 -3,-3c0,-0 0,-9 0,-9c-0,0 2,0 2,0c0.379,-0 0.725,-0.214 0.894,-0.553l1.106,-2.211c0,0 1.106,2.211 1.106,2.211c0.169,0.339 0.515,0.553 0.894,0.553l6,-0Zm14.5,6l11.5,0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-11.5,0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1Zm-3.5,-5l15,0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1l-15,0c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1Zm-0,-5l15,0c0.552,0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-15,0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1Zm0,-5l15,0c0.552,0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-15,0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1Zm-7,-5l22,0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-22,0c-0.552,-0 -1,0.448 -1,1c-0,0.552 0.448,1 1,1Z" />
        </g>
      </svg>
  )
}

const DateIcon = () => {
  return (
    <svg
      // Use Tailwind classes for size, margin, and color
      // text-white sets the color to white
      className="w-12 h-12 mb-1 text-white"
      // fill="currentColor" makes the SVG inherit the color from the className
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" // Good practice for decorative icons
    >
      {/* Removed hardcoded width, height, and fill attributes */}
      <path d="M6,22H18a3,3,0,0,0,3-3V7a2,2,0,0,0-2-2H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H5A2,2,0,0,0,3,7V19A3,3,0,0,0,6,22ZM5,12.5a.5.5,0,0,1,.5-.5h13a.5.5,0,0,1,.5.5V19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1Z"/>
    </svg>
  )
}


export default SubstitutionDetails;

function InfoBox({ name, param, icon }) {
  return (
    // Removed the extraneous empty JSX expression {} after className
    <div className="h-[130px] w-[130px] border border-borderc rounded-xl flex flex-col
                    justify-center items-center p-[10px] text-center gap-1">
                      {icon}
      
      <span className="text-xs text-gray-400">{name}</span>
      <span className="font-medium text-sm">{param}</span>
    </div>
  );
}

  