import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SubstitutionDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const substitutionData = location.state?.data;
  console.log(substitutionData);
  return (
    <div
      onClick={() => {
        navigate("/home");
      }}
      className="fixed bg-black h-[100vh] w-[100vw] overflow-hidden"
    >
      <div className="flex h-[7vh] items-center pl-[20px] border-b-[1px] border-gray-600">
        <span className="text-white text-[20px] font-light">{"<   "}BACK</span>
      </div>

      <div className="h-[100%] px-[20px] overflow-y-scroll no-scrollbar">
        <div className="h-[4vh]"></div>
        <span className="text-[30px] text-white font-extralight tracking-wide">
          Details
        </span>
        <div className="pl-[20px] h-[100%]">
          <div className="h-[4vh]"></div>
          {substitutionData && Object.keys(substitutionData).length > 0 ? (
            Object.keys(substitutionData).map((key, index) => (
              <>
                <div className="flex text-white">
                  <span className="min-w-[50%] font-extralight">{key} :</span>{" "}
                  <span className="text-[rgb(200,200,200)]">
                    {substitutionData[key] ?? "none"}
                  </span>
                </div>
                <div className="h-[4vh]"></div>
              </>
            ))
          ) : (
            <div>No Data</div>
          )}
          <div className="h-[4vh]"></div>
          <div className="h-[4vh]"></div>
        </div>
      </div>
    </div>
  );
}

export default SubstitutionDetails;
