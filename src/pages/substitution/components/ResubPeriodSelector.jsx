import React, { useEffect, useState } from "react";
import useTeachStore from "../../../context/useTeachStore";

function CalenderSelector({
  teacherTimeTable,
  setSelectedDates,
  selectedDates,
}) {
  const date = new Date();
  const trackDate = new Date();
  const [curDates, setCurDates] = useState([]);
  const [padding, setPadding] = useState(0);
  // const [selectedDates, setSelectedDates] = useState({});
  const [dateIndex, setDateIndex] = useState({
    index: 0,
    day: null,
    date: null,
  });
  const teacherID = useTeachStore((state) => state.teacherid);
  const weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getWeekDates = () => {
    const today = new Date();
    today.setDate(today.getDate() + padding);

    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i);
      weekDates.push(newDate.toDateString());
    }

    setCurDates(weekDates);
  };

  const increaseDate = () => {
    setPadding(padding + 7);
  };

  const decreaseDate = () => {
    setPadding(padding - 7);
  };

  const handleDateIndex = (day, index, date) => {
    if (!day || index < 0) {
      console.error("error : no Index or Day");
      return;
    }

    console.log();
    const ISODate = new Date(date).toISOString().split("T")[0];

    const trueIndex = weekArr.indexOf(day);

    const temp = { index, day: trueIndex, date, ISODate };

    if (dateIndex != temp) {
      setDateIndex(temp);
    }
  };
  const handleSelectedClasses = (classItem) => {
    if (!classItem) {
      console.error("Error: no classItem");
      return;
    }

    setSelectedDates((prevState) => {
      console.log(dateIndex);
      const key = `${classItem.class_id}-${dateIndex.date}`;

      const temp = { ...prevState };

      if (!temp[key]) {
        temp[key] = {
          ...classItem,
          date_of_period: dateIndex.ISODate,
          teacher_id: teacherID,
        };
        console.log("Added:", temp);
        return temp;
      }

      // Remove entry if it already exists
      delete temp[key];
      console.log("Removed:", temp);
      return temp;
    });
  };

  useEffect(() => {
    getWeekDates();
  }, []);

  useEffect(() => {
    getWeekDates();
  }, [padding]);

  useEffect(() => {
    // console.log(teacherTimeTable);
    // console.log(selectedDates);
    // setParentSelectedDates(selectedDates);
  }, [selectedDates]);
  return (
    <div className="flex max-h-[100%] w-[100%]">
      {curDates && curDates.length > 0 ? (
        <div className="flex flex-col w-[100%] h-[100%]">
          <div className="flex flex-row w-[100%] h-[80%]">
            <div className="w-[30%] flex flex-col items-center">
              <span className="py-[10px] flex w-[100%] text-center items-center justify-center bg-[rgb(70,70,70)]">
                Dates
              </span>
              <div className="flex flex-col w-[100%] h-[100%] overflow-y-scroll no-scrollbar bg-[rgb(50,50,50)]">
                {curDates.map((date, index) => (
                  <div
                    className="flex min-h-[8dvh] justify-center gap-[10px] items-center cursor-pointer"
                    key={index}
                    onClick={() => {
                      handleDateIndex(date.split(" ")[0], index, date);
                    }}
                    style={{
                      backgroundColor:
                        dateIndex.index === index ? "rgb(70, 70, 70)" : "",
                    }}
                  >
                    <span>{date.split(" ")[2]}</span>{" "}
                    <span>{date.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-[70%]">
              <span className="py-[10px] flex w-[100%] text-center items-center justify-center bg-[rgb(70,70,70)]">
                Periods
              </span>
              <div className="h-[100%]">
                {teacherTimeTable &&
                teacherTimeTable[dateIndex.day] &&
                Object.keys(teacherTimeTable).length > 0 ? (
                  <div className="h-[100%] flex flex-col lg:flex-wrap">
                    {teacherTimeTable[dateIndex.day][0].classes.map(
                      (classItem, index) => (
                        <div
                          key={index}
                          className="flex-1 lg:flex-2 flex flex-col items-center justify-center cursor-pointer"
                          onClick={() => {
                            handleSelectedClasses(classItem);
                          }}
                          style={{
                            backgroundColor: selectedDates[
                              `${classItem.class_id}-${dateIndex.date}`
                            ]
                              ? "rgb(50, 50, 50)"
                              : "",
                          }}
                        >
                          <span className="text-[10px]">
                            {classItem.start_time}
                          </span>
                          <span>{classItem.subject_name}</span>

                          {/* <p>{classItem.subject_name}</p>{" "} */}
                          {/* Adjust based on the structure of classItem */}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-white">Select a date</div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-[100%] h-[10dvh] font-extralight text-[20px]">
            <button
              onClick={() => {
                decreaseDate();
                setDateIndex((prevState) => {
                  return {
                    ...prevState,
                    date: null,
                    day: null,
                  };
                });
              }}
            >
              Prev
            </button>
            <button
              onClick={() => {
                increaseDate();
                setDateIndex((prevState) => {
                  return {
                    ...prevState,
                    date: null,
                    day: null,
                  };
                });
              }}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-[100%] w-[100%] items-center justify-center">
          Loading
        </div>
      )}
    </div>
  );
}

export default CalenderSelector;
