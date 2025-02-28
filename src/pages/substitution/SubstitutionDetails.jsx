import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeSubstitutions } from "../../../utils/editAndRemoveUtils";

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

    removeSubstitutions([substitutionData.sub_id]);

    navigate("/home");
  };

  return (
    <div className="fixed bg-backgroundc h-[100vh] w-[100vw] overflow-hidden">
      <div className="flex h-[7vh] items-center pl-[20px] border-b-[1px] border-gray-600r">
        <span
          className="text-textc text-[20px] font-light cursor-pointer"
          onClick={() => {
            navigate("/home");
          }}
        >
          {"<   "}BACK
        </span>
      </div>

      <div className="h-[100%] px-[20px] overflow-y-scroll no-scrollbar">
        <div className="h-[4vh]"></div>
        <div className="w-[100%] flex items-center flex-row">
          <span className="text-[30px] text-textc font-extralight tracking-wide">
            Details
          </span>
          <div className="ml-auto flex gap-[20px]">
            <button
              className="cursor-pointer font-light"
              onClick={() => {
                handleEdit();
              }}
            >
              Edit
            </button>
            <button
              className="cursor-pointer font-light"
              onClick={() => {
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="pl-[20px] h-[100%]">
          <div className="h-[4vh]"></div>
          {substitutionData && Object.keys(substitutionData).length > 0 ? (
            Object.keys(substitutionData).map((key, index) => (
              <>
                <div className="flex text-textc">
                  <span className="min-w-[50%] md:min-w-[40%] lg:min-w-[30%] xl:min-w-[20%] font-extralight">
                    {key} :
                  </span>{" "}
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
