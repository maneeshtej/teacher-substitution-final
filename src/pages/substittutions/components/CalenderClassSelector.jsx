import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getTeacherTimetableByID,
  getTimetableGrouped,
} from "../../../../utils/fetchUtils";
import useTeachStore from "../../../context/useTeachStore";

function CalenderClassSelector({
  teacherSubstitutionsToSend,
  setteachersubstitutionstosend,
}) {
  const [loading, setLoading] = useState(false);
  const teacherID = useTeachStore((state) => state.teacherid);
  const weeks = useMemo(
    () => [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    []
  );

  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const actualDate = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const [curDate, setCurDate] = useState(new Date());
  const [baseDateRange, setBaseDateRange] = useState(6); // number of dates rendered at once
  const [dates, setDates] = useState([]); // keeps all the current days acc to user selection in an array
  const [dateIndex, setDateIndex] = useState(0); // keeps track of prev and doesn't let it go into past
  const [selectedDate, setSelectedDate] = useState(null); // keeps track of selected date
  const [teacherTimeTable, setTeacherTimeTable] = useState(null);

  const getDates = useCallback(() => {
    const tempDates = [];
    for (let i = 0; i < baseDateRange; i++) {
      const newDate = new Date(curDate);
      newDate.setDate(curDate.getDate() + i);
      tempDates.push({
        date: newDate,
        day: weeks[newDate.getDay()],
        month: months[newDate.getMonth()],
        dateNumber: newDate.getDate(),
        dayNumber: newDate.getDay(),
      });
    }
    setDates(tempDates);
  }, [curDate, weeks, months, baseDateRange]);

  const navigateCalender = (dir) => {
    const today = actualDate();
    if (dir === "next") {
      setCurDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 7);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
      });
      setDateIndex((prev) => prev + 1);
      setSelectedDate(null);
    } else {
      setCurDate((prev) => {
        const currentStartDate = new Date(prev);
        currentStartDate.setHours(0, 0, 0, 0);

        if (currentStartDate <= today) {
          console.log("Cannot navigate to dates before today.");
          return prev;
        }
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 7);
        newDate.setHours(0, 0, 0, 0);

        if (newDate < today) {
          return today;
        }

        return newDate;
      });
      setDateIndex((prev) => prev - 1);
      setSelectedDate(null);
    }
  };

  const fetchTimeTable = async () => {
    setLoading(true);
    if (!teacherID) {
      return;
    }
    try {
      const { data, error } = await getTimetableGrouped(teacherID);
      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        setTeacherTimeTable(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSelectSubstitution = (period) => {
    const newKey = `${period.class_id}-${selectedDate.dateNumber}-${selectedDate.month}`;

    const updatedSubstitutions = { ...teacherSubstitutionsToSend };

    if (updatedSubstitutions[newKey]) {
      // If already selected, remove it
      delete updatedSubstitutions[newKey];
    } else {
      // Else, add it
      updatedSubstitutions[newKey] = period;
    }

    setteachersubstitutionstosend(updatedSubstitutions);
  };

  const checkSelected = (period) => {
    if (
      !period ||
      !period.class_id ||
      !selectedDate?.dateNumber ||
      !selectedDate?.month
    ) {
      return false;
    }

    const newKey = `${period.class_id}-${selectedDate.dateNumber}-${selectedDate.month}`;
    return !!teacherSubstitutionsToSend[newKey];
  };

  const mergePeriodsIntoDates = () => {
    if (!dates.length || !teacherTimeTable) return;

    const updatedDates = dates.map((date) => ({
      ...date,
      periods:
        (teacherTimeTable[date.dayNumber.toString()] &&
          Object.keys(teacherTimeTable[date.dayNumber.toString()]).length > 0 &&
          teacherTimeTable[date.dayNumber.toString()]["0"]["classes"]) ||
        [],
    }));

    const hasChanges = updatedDates.some(
      (d, i) => JSON.stringify(d.periods) !== JSON.stringify(dates[i].periods)
    );

    if (hasChanges) {
      setDates(updatedDates);
      setSelectedDate(updatedDates[0]);
    }
  };

  useEffect(() => {
    getDates();
  }, [curDate]);

  useEffect(() => {
    fetchTimeTable();
  }, [teacherID]);

  useEffect(() => {
    mergePeriodsIntoDates();
  }, [teacherTimeTable, dates]);

  useEffect(() => {
    console.log(teacherSubstitutionsToSend);
  }, [teacherSubstitutionsToSend]);

  useEffect(() => {
    // console.log(dates);
  }, [dates]);

  return (
    <div>
      {/*  data structure : 
                {date, day, month, dateNumber} 
        
        {dates && dates.length > 0 &&
            dates.map((date, index) => {
                return (
                    <div key={index}>
                        <h1>{date.dateNumber} {date.month} {date.day}</h1>
                    </div>
                )
            })
        } */}

      {!loading ? (
        <>
          <div className="w-[clamp(300px,100%,700px)] border-borderc border-t-1 flex flex-row p-[min(3vw,30px)] h-[70dvh] overflow-scroll">
            <div className="flex flex-col gap-[10px] items-center justify-start py-[min(3vw,50px)]">
              {dates.map((date, index) => {
                // console.log(date);
                return (
                  <div
                    key={index}
                    className={`w-fit p-[10px]  ${
                      selectedDate == date ? "bg-textc text-backgroundc" : " "
                    } 
                              flex flex-col items-center rounded-md transition-all duration-200 ease-in-out cursor-pointer`}
                    onClick={() => {
                      setSelectedDate(date);
                    }}
                  >
                    <h1 className="text-subheading">{date.dateNumber}</h1>
                    <span className="text-[min(0.7rem,3vw)]">{date.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 flex flex-col lg:flex-wrap gap-[10px] p-[min(3vw,50px)] ">
              {selectedDate?.periods?.length > 0 ? (
                selectedDate.periods.map((period, index) => {
                  //   console.log(period);
                  return (
                    <div
                      key={index}
                      className={`${
                        checkSelected(period)
                          ? "bg-textc text-backgroundc"
                          : "bg-backgroundc text-textc"
                      } p-[min(2vw,20px)] py-[min(5vw,20px)] h-fit 
                        rounded-md flex items-center justify-center w-[min(100%)]`}
                      onClick={() => handleSelectSubstitution(period)}
                    >
                      <h1 className="flex-1/3 flex items-center justify-center">
                        {period.subject_name}
                      </h1>
                      <div className="flex-1/3 border-borderc border-l-1 items-center justify-center hidden md:flex text-[min(1rem,10px)]">
                        {period.start_time} - {period.end_time}
                      </div>
                      <div className="flex-1/3 items-center justify-center hidden md:flex text-[min(1rem,10px)]">
                        {period.duration}
                      </div>
                    </div>
                  );
                })
              ) : selectedDate && selectedDate.dayNumber === 0 ? (
                <h1 className="h-full w-full flex items-center justify-center text-borderc">
                  Select a working day to display classes
                </h1>
              ) : selectedDate == null ? (
                <h1 className="h-full w-full flex items-center justify-center text-borderc">
                  Select a date to view classes
                </h1>
              ) : (
                <h1 className="h-full w-full flex items-center justify-center text-borderc">
                  No classes
                </h1>
              )}
            </div>
          </div>

          <div className="w-[clamp(300px,100%,700px)] flex flex-row items-center justify-between p-[min(3vw,30px)]">
            <button
              onClick={() => navigateCalender("prev")}
              className={`${
                dateIndex !== 0
                  ? "opacity-100"
                  : "opacity-50 pointer-events-none"
              }`}
            >
              Prev
            </button>
            <button onClick={() => navigateCalender("next")}>Next</button>
          </div>
        </>
      ) : (
        <div className="w-[clamp(300px,100%,700px)] bg-backgroundh animate-pulse flex flex-row p-[min(3vw,30px)] h-[70dvh] overflow-scroll"></div>
      )}
    </div>
  );
}

export default CalenderClassSelector;
