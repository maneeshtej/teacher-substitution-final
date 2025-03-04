import React, { useEffect, useState } from "react";
import useTeachStore from "../../../context/useTeachStore";
import { useQuery } from "@tanstack/react-query";
import { getSubstitutionsSortedandFiltered } from "../../../../utils/fetchUtils";
import { useNavigate } from "react-router-dom";

function HomeContent({ type }) {
  const teacherID = useTeachStore((state) => state.teacherid);
  const navigate = useNavigate();
  const [sortMode, setSortMode] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSubstituions, setSelectedSubstituions] = useState({});
  const [pageLoad, setPageLoad] = useState(false);

  const [sortOption, setSortOptions] = useState({
    teacherID,
    sortBy: "dateofPeriod",
    sort: "Asc",
  });

  useEffect(() => {
    console.log(sortOption);
  }, [sortOption]);

  const [tempSortOption, setTempSortOption] = useState({
    teacherID,
    sortBy: "dateofPeriod",
    sort: "Asc",
  });

  const getSortedSubstitutions = async () => {
    const { data, error } = await getSubstitutionsSortedandFiltered({
      ...sortOption,
      type: type,
    });
    if (error) {
      console.error("error : ", error);
      return {};
    }

    return data;
  };

  const setSortMethods = ({ sortBy, sort }) => {
    setTempSortOption((prevState) => ({
      ...prevState,
      sortBy: sortBy ?? prevState.sortBy,
      sort: sort ?? prevState.sort,
    }));
  };

  const handleSelect = (key, classItem) => {
    if (!key) {
      return;
    }

    setSelectedSubstituions((prevstate) => {
      const temp = { ...prevstate };

      if (temp[key]) {
        delete temp[key];
        return temp;
      }

      temp[key] = classItem;
      return temp;
    });
  };

  const handleDelete = async () => {
    if (
      !selectedSubstituions ||
      Object.keys(selectedSubstituions).length === 0
    ) {
      return;
    }

    // setPageLoad(true);

    try {
      const { removeSubstitutions } = await import(
        "../../../../utils/editAndRemoveUtils"
      );

      const sub_ids = Object.values(selectedSubstituions).map(
        (sub) => sub.sub_id
      );

      await removeSubstitutions(sub_ids);
      setSelectedSubstituions({});
      refetch();
    } catch (error) {
      console.error("Error deleting substitutions:", error);
    } finally {
      setPageLoad(false); // Ensure page loading stops even if there's an error
    }
  };

  useEffect(() => {
    console.log(selectedSubstituions);
  }, [selectedSubstituions]);

  const {
    data: teacherSubstitutions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["teacherSubstitutions", sortOption, type],
    queryFn: getSortedSubstitutions,
    staleTime: 60000,
    retry: 3,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    console.log(teacherSubstitutions);
  }, [teacherSubstitutions]);

  return (
    <div className=" w-[100%] px-[min(3vw,50px)]">
      {!isLoading ? (
        <>
          <div
            className={`fixed h-[100dvh] w-[100vw] z-50 bg-black/50 left-0 right-0 top-0 ${
              pageLoad ? "opacity-100 " : "opacity-0 pointer-events-none"
            } transition-all duration-200 ease-in-out`}
          >
            <div
              className={`h-[10dvh] bg-black border-b-[1px] border-[rgb(70,70,70)] flex items-center pl-[min(3vw,50px)] ${
                pageLoad ? "translate-y-[0dvh]" : "translate-y-[-10dvh]"
              } transition-all duration-200 ease-in-out`}
            >
              <span className="font-light text-xl animate-pulse">Loading</span>
            </div>
          </div>
          <div className="h-[4dvh]"></div>
          {/*  */}
          {/* Filters and Sorting */}
          {/*  */}
          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-row justify-between">
              <button
                className="font-light text-2xl flex"
                onClick={() => {
                  setSortMode((prevState) => !prevState);
                  setSelectMode(false);
                }}
              >
                Filters
              </button>
              <button
                className="font-light text-2xl flex"
                onClick={() => {
                  setSortMode(false);
                  setSelectMode((prevState) => !prevState);
                }}
              >
                Select
              </button>
            </div>
            {/* Sort */}
            <div
              className={`fixed top-0 left-0 h-[100dvh] w-[100vw] flex ${
                sortMode ? "translate-y-[0dvh]" : "translate-y-[100dvh]"
              } flex-col bg-backgroundc z-50 transition-all duration-200 ease-in-out`}
            >
              <div className="h-[10dvh] flex items-center px-[min(3vw,50px)]">
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setSortMode(false);
                  }}
                >
                  X
                </span>
              </div>
              {/* Filters */}
              <div className="w-[100vw] px-[min(3vw,50px)]">
                <div className="flex flex-row justify-between">
                  {" "}
                  <span className="font-light text-4xl">Sort</span>
                  <div className="flex gap-[20px] text-xs">
                    <button
                      className={`${
                        tempSortOption.sort !== "Asc"
                          ? "text-[rgb(100,100,100)]"
                          : "text-textc"
                      } transition-all duration-200 ease-in-out`}
                      onClick={() => {
                        setSortMethods({ sort: "Asc" });
                      }}
                    >
                      Ascending
                    </button>
                    <button
                      className={`${
                        tempSortOption.sort !== "Dsc"
                          ? "text-[rgb(100,100,100)]"
                          : "text-textc"
                      } transition-all duration-200 ease-in-out`}
                      onClick={() => {
                        setSortMethods({ sort: "Dsc" });
                      }}
                    >
                      Descending
                    </button>
                  </div>
                </div>

                <div className="h-[4dvh]"></div>
                <div className="flex flex-row gap-[min(5vw,50px)] overflow-x-scroll no-scrollbar">
                  {[
                    { label: "Date of Period", key: "dateofPeriod" },
                    { label: "Date Created", key: "createdAt" },
                    { label: "Status", key: "status" },
                    { label: "State", key: "state" },
                    { label: "Reason", key: "reason" },
                  ].map((option) => (
                    <div
                      key={option.key}
                      className={`h-[20dvh] min-w-[20dvh] rounded-[10px] flex items-end p-[10px] border-[1px] border-[rgb(50,50,50)] ${
                        tempSortOption.sortBy === option.key
                          ? ""
                          : "bg-[rgb(50,50,50)]"
                      } transition-colors duration-200 ease-in-out`}
                      onClick={() => setSortMethods({ sortBy: option.key })}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
                <div className="h-[4dvh]"></div>
                <span className="font-light text-4xl">Filter</span>
              </div>

              <div className="h-[10dvh] flex items-center justify-center mt-auto">
                <button
                  onClick={() => {
                    setSortOptions(tempSortOption);
                    setSortMode(false);
                    refetch();
                  }}
                >
                  Sort
                </button>
              </div>
            </div>

            {/* Select Mode */}
            <div
              className={`w-[100%] ${
                selectMode ? "flex" : "hidden"
              } flex-row gap-[min(7vw,30px)] font-light justify-end bg-[rgb(50,50,50)] rounded-[5px] p-[5px] text-[min(4vw,15px)]`}
            >
              <button
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  navigate("/editsubstitution", {
                    state: { selectedSubstitutions: selectedSubstituions },
                  });
                  setPageLoad(true);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (
                    Object.keys(selectedSubstituions).length ==
                    Object.keys(teacherSubstitutions).length
                  ) {
                    setSelectedSubstituions({});
                  } else {
                    setSelectedSubstituions(teacherSubstitutions);
                  }
                }}
              >
                Select All
              </button>
            </div>
          </div>
          {/*  */}
          {/* Rendering substitutions */}
          {/*  */}
          <div className="h-[4dvh]"></div>
          <div className="h-[100%] w-[100%] flex flex-col gap-[10px]">
            {teacherSubstitutions ??
            Object.keys(teacherSubstitutions).length > 0 ? (
              Object.keys(teacherSubstitutions).map((key, index) => {
                const classItem = teacherSubstitutions[key];
                return (
                  <div
                    className={`min-h-[10dvh] flex ${
                      selectMode ? "" : "bg-[rgb(50,50,50)]"
                    } ${
                      selectMode && selectedSubstituions[key]
                        ? "bg-white text-black"
                        : ""
                    } border-[1px] border-[rgb(50,50,50)] rounded-[10px] px-[min(4vw,50px)] text-[min(3vw,10px)]
                  font-light transition-all duration-200 ease-in-out`}
                    onClick={() => {
                      if (selectMode) {
                        handleSelect(key, classItem);
                      } else {
                        setPageLoad(true);
                        navigate("/home/subdetails", {
                          state: { data: classItem },
                        });
                      }
                    }}
                  >
                    <div className="flex flex-row w-[100%]">
                      <div className="w-[45%] flex flex-col items-start justify-evenly ">
                        <div className="font-medium text-[min(3.5vw,15px)]">
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
        </>
      ) : (
        <>
          <div className="h-[4dvh]"></div>
          <div className="flex items-center pointer-events-none bg-[rgb(70,70,70)] rounded-[10px] animate-pulse">
            <button className="font-light text-2xl text-black h-[5dvh]"></button>
          </div>
          {/* Rendering substitutions */}
          <div className="h-[4dvh]"></div>
          <div className="h-[100%] w-[100%] bg-[rgb(70,70,70)] rounded-[10px] animate-pulse"></div>
        </>
      )}
    </div>
  );
}

export default HomeContent;
