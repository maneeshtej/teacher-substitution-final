import React, { useEffect } from "react";
import useTeachStore from "../../context/useTeachStore";
// import { fetchSubstitutionsbyGroup } from "../../../utils/fetchUtils";
import { useNavigate } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";

function Recent() {
  // const teacherID = useTeachStore((state) => state.teacherid);
  // const navigate = useNavigate();
  // const fetchSubstitutions = async () => {
  //   const { data, error } = await fetchSubstitutionsbyGroup(teacherID);

  //   if (error) {
  //     console.error("error : ", error);
  //   }

  //   return data;
  // };

  // const {
  //   data: groupedTeacherSubstitutions = [],
  //   error,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ["groupedTeacherSubstitions", teacherID],
  //   queryFn: fetchSubstitutions,
  //   enabled: !!teacherID,
  //   staleTime: 60000,
  //   retry: 3,
  // });

  return (
    <div className="h-[100dvh] w-[100%]">
      {/* <div className="h-[10dvh] border-b-[rgb(50,50,50)] border-b-[1px] flex items-center">
        <span
          className="font-light tracking-wide text-lg"
          onClick={() => {
            navigate("/home");
          }}
        >
          Back
        </span>
      </div>
      <div
        className={`h-[90dvh] w-[100%] overflow-y-scroll ${
          isLoading ? "p-[min(3vw,50px)]" : "pl-[min(3vw,50px)]"
        }`}
      >
        {isLoading ? (
          <div className="flex h-[100%] w-[100%] animate-pulse bg-[rgb(50,50,50)] rounded-[10px]"></div>
        ) : (
          <div className=" w-[100%] h-[100%]">
            <div className="h-[10dvh] flex items-center font-light text-3xl">
              Recent
            </div>
            <div className=" w-[100%] pl-[min(3vw,50px)]">
              {groupedTeacherSubstitutions &&
              Object.keys(groupedTeacherSubstitutions).length > 0 ? (
                Object.keys(groupedTeacherSubstitutions).map((key, index) => {
                  const subArray =
                    groupedTeacherSubstitutions[key].substitutions;
                  const date = new Date(
                    groupedTeacherSubstitutions[key].created_at
                  );

                  const istTime = date.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  });

                  return (
                    <div className="flex w-[100%] flex-col">
                      <div className="border-b-[1px] border-[rgb(50,50,50)] mr-[min(3vw,50px)] py-[1px]">
                        {istTime.toUpperCase()}
                      </div>
                      <div className="p-[min(3vw,50px)] flex flex-col gap-[4dvh]">
                        {subArray && Object.keys(subArray).length > 0 ? (
                          Object.keys(subArray).map((key2, index2) => {
                            const subArray2 = subArray[key2];
                            console.log(subArray[key2]);
                            return (
                              <div className="flex items-center bg-[rgb(50,50,50)] rounded-[10px] flex-col">
                                {Object.keys(subArray2).map((key3, index3) => {
                                  return (
                                    <div>
                                      {key3} : {subArray2[key3]}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })
                        ) : (
                          <div>None</div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No Substitutions</div>
              )}
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default Recent;
