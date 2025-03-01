import React, { useEffect, useState } from "react";
import useTeachStore from "../../../context/useTeachStore";
import { useAnimation } from "../../../context/animation/AnimationManager";
import { getAllTeachers } from "../../../../utils/fetchUtils";
import { sendSubstitutions } from "../../../../utils/postUtils";
import { Link, useNavigate } from "react-router-dom";
import { checkDuplicateSubstitutions } from "../../../../utils/duplicateUtils";

function ConfirmSubstitution() {
  const { setteachersubstitutionstosend } = useTeachStore();
  const [selectedDates, setSelectedDates] = useState(
    useTeachStore((state) => state.teachersubstitutionstosend) || {}
  );
  const teacherID = useTeachStore((state) => state.teacherid);
  const [teachers, setTeachers] = useState(null);
  const navigate = useNavigate();
  const [pageLoad, setLoadPage] = useState(false);

  const handleSelectedClassesIndex = (classItem) => {
    if (!classItem) {
      console.error("error : no classItem");
      return;
    }

    setSelectedDates((prevState) => ({
      ...prevState,
      [classItem]: {
        ...prevState[classItem],
        selected: !prevState[classItem]?.selected, // Toggle selected field
      },
    }));
  };

  const handleDelete = () => {
    setSelectedDates((prevState) => {
      const temp = { ...prevState };

      for (let key in temp) {
        if (temp[key]?.selected) {
          delete temp[key];
        }
      }

      setteachersubstitutionstosend(temp);
      return temp;
    });
  };

  const checkDuplicates = async () => {
    const results = await checkDuplicateSubstitutions(selectedDates);

    if (results) {
      setSelectedDates((prevState) => {
        const temp = { ...prevState };

        Object.keys(results).forEach((key) => {
          if (temp[key]) {
            temp[key].duplicate = results[key]; // Only set once
          }
        });

        return temp;
      });
    }
  };

  const handleSend = async () => {
    const selectedSubstitutions = Object.keys(selectedDates)
      .filter((key) => selectedDates[key]?.selected) // Get only selected substitutions
      .reduce((acc, key) => ({ ...acc, [key]: selectedDates[key] }), {});

    if (Object.keys(selectedSubstitutions).length === 0) {
      console.warn("No substitutions selected to send.");
      return;
    }

    // Check for duplicates before sending
    const results = await checkDuplicateSubstitutions(selectedSubstitutions);

    let hasDuplicates = false;
    const updatedState = { ...selectedDates };

    Object.keys(results).forEach((key) => {
      if (updatedState[key]) {
        updatedState[key].duplicate = results[key];
        if (results[key]) {
          hasDuplicates = true;
        }
      }
    });

    setSelectedDates(updatedState);

    if (hasDuplicates) {
      console.error("Duplicates found! Sending aborted.");
      setLoadPage(false);
      return;
    }

    // No duplicates, proceed to send
    const result = await sendSubstitutions(selectedSubstitutions);

    setSelectedDates((prevState) => {
      const temp = { ...prevState };

      Object.keys(temp).forEach((key) => {
        if (temp[key]?.selected) {
          delete temp[key];
        }
      });

      return temp;
    });

    console.log(result);

    navigate("/success", { state: { data: selectedDates } });
  };

  useEffect(() => {
    console.log(selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    const fetchAllTeachers = async () => {
      const { data, error } = await getAllTeachers(teacherID);
      if (error) {
        console.error("error : ", error);
      }

      setTeachers(data);
    };

    fetchAllTeachers();
  }, [teacherID]);

  useEffect(() => {
    console.log(teachers);
  }, [teachers]);
  return (
    <div className="fixed flex flex-col h-[100dvh] w-[100vw] bg-backgroundc text-textc px-[20px]  py-[20px]">
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
      <div className="flex flex-row items-center justify-between min-h-[7dvh]">
        <button
          className="font-extralight cursor-pointer"
          onClick={() => {
            //   navigate("/home");
            navigate("/addsubstitution");
          }}
        >
          Back
        </button>
        <button
          className="font-extralight"
          onClick={() => {
            setLoadPage(true);
            handleSend();
            // checkDuplicates();
          }}
        >
          Send
        </button>
      </div>
      <div className="h-[10dvh] flex items-center pl-[min(6vw,50px)]">
        <span className="font-medium text-3xl">Selected Classes</span>
      </div>
      <div className="h-[83dvh] px-[min(12vw,100px)] flex flex-col gap-[20px] overflow-y-scroll">
        <div className="w-[100%] flex flex-row justify-end gap-[20px] font-light">
          <button>Draft</button>
          <button
            className="text-red-300 transition-all duration-200 ease-in-out"
            style={{
              color: Object.values(selectedDates).some((item) => item.selected)
                ? "red"
                : "rgb(170,170,170)",
              cursor: Object.values(selectedDates).some((item) => item.selected)
                ? "pointer"
                : "default",
            }}
            onClick={handleDelete}
            disabled={
              !Object.values(selectedDates).some((item) => item.selected)
            }
          >
            Delete
          </button>
        </div>
        {selectedDates && Object.keys(selectedDates).length > 0 ? (
          Object.keys(selectedDates).map((classItems, index) => {
            return (
              <div
                key={index}
                className="flex flex-col bg-[rgb(30,30,30)] rounded-[10px] p-[15px] transition-all duration-200 ease-in-out"
                onClick={() => handleSelectedClassesIndex(classItems)}
                style={{
                  backgroundColor: selectedDates[classItems]?.duplicate
                    ? "red"
                    : selectedDates[classItems]?.selected
                    ? "white"
                    : "",
                  color: selectedDates[classItems]?.selected ? "black" : "",
                }}
              >
                {selectedDates[classItems] &&
                Object.keys(selectedDates[classItems]).length > 0 ? (
                  Object.keys(selectedDates[classItems]).map((item, idx) => (
                    <span key={idx}>
                      {idx === 0 && (
                        <span
                          className="block"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Teacher :{" "}
                          <select
                            name="Teacher"
                            onChange={(e) => {
                              console.log(e.target.value);
                              setSelectedDates((prevState) => ({
                                ...prevState,
                                [classItems]: {
                                  ...prevState[classItems],
                                  sub_teacher_id: e.target.value.split("-")[0],
                                  sub_teacher_name:
                                    e.target.value.split("-")[1],
                                },
                              }));
                            }}
                          >
                            <option
                              className="bg-backgroundc text-textc"
                              value={null}
                            >
                              None
                            </option>
                            {teachers && Object.keys(teachers).length > 0 ? (
                              Object.keys(teachers).map((key, index) => (
                                <option
                                  key={index}
                                  value={`${teachers[key].id}-${teachers[key].name}`}
                                  className="bg-backgroundc text-textc"
                                >
                                  {teachers[key].name}
                                </option>
                              ))
                            ) : (
                              <option>None</option>
                            )}
                          </select>
                        </span>
                      )}
                      {item} : {selectedDates[classItems][item]}
                    </span>
                  ))
                ) : (
                  <div className="">No Classes</div>
                )}
              </div>
            );
          })
        ) : (
          <div className="h-[100%] w-[100%] flex flex-col items-center justify-center">
            <Link to={"/home"}>Go to home</Link>
          </div>
        )}

        {/* <div className="flex h-[50dvh]"></div> */}
      </div>
    </div>
  );
}

export default ConfirmSubstitution;
