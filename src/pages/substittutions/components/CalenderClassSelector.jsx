import React, { useEffect, useState } from "react"; // Import React hooks: useEffect for side effects, useState for managing component state
import {
  getTeacherTimetableByID, // Utility function (potentially unused in this version, but imported)
  getTimetableGrouped, // Utility function to fetch timetable data grouped by day
} from "../../../../utils/fetchUtils"; // Import utility functions for fetching data
import useTeachStore from "../../../context/useTeachStore"; // Import Zustand store hook for accessing teacher-related state

// Component to display a calendar interface for selecting classes for substitution
function CalenderClassSelector({
  teacherSubstitutionsToSend, // Prop: Object containing currently selected substitutions
  setteachersubstitutionstosend, // Prop: Function to update the parent component's state with selected substitutions
}) {
  // Get the teacher's ID from the global Zustand store
  const teacherID = useTeachStore((state) => state.teacherid);

  // Array of week day names
  const weeks = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Array of month names
  const months = [
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
  ];

  // Function to get today's date with time set to midnight (for comparison)
  const actualDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to 00:00:00.000
    return today;
  };

  // State: The starting date for the currently displayed range of dates
  const [curDate, setCurDate] = useState(new Date());
  // State: The number of dates to render/display at once (currently fixed at 5)
  const [baseDateRange, setBaseDateRange] = useState(5);
  // State: Array holding the date objects currently being displayed based on curDate and baseDateRange
  const [dates, setDates] = useState([]);
  // State: Index to track navigation steps (used for enabling/disabling 'Prev' button)
  const [dateIndex, setDateIndex] = useState(0);
  // State: Holds the full date object ({date, day, month, etc.}) that the user has clicked on
  const [selectedDate, setSelectedDate] = useState(null);
  // State: Stores the fetched timetable data for the teacher, likely grouped by day
  const [teacherTimeTable, setTeacherTimeTable] = useState(null);

  // Function to generate the array of date objects to be displayed
  const getDates = () => {
    const tempDates = []; // Temporary array to build the dates
    // Loop based on the baseDateRange (e.g., 5 times)
    for (let i = 0; i < baseDateRange; i++) {
      const newDate = new Date(curDate); // Start with the current base date
      newDate.setDate(curDate.getDate() + i); // Increment the day for each iteration
      // Push an object with formatted date details into the array
      tempDates.push({
        date: newDate, // The full Date object
        day: weeks[newDate.getDay()], // Day name (e.g., "Monday")
        month: months[newDate.getMonth()], // Month name (e.g., "July")
        dateNumber: newDate.getDate(), // Day of the month (e.g., 15)
        dayNumber: newDate.getDay(), // Day of the week as a number (0-6)
      });
    }
    setDates(tempDates); // Update the component's state with the generated dates
  };

  // Function to handle navigation between weeks/date ranges
  const navigateCalender = (dir) => {
    const today = actualDate(); // Get today's date (normalized to midnight) for comparison
    if (dir === "next") {
      // If navigating forward ('next')
      setCurDate((prev) => {
        const newDate = new Date(prev); // Create a new date from the previous state
        newDate.setDate(newDate.getDate() + 7); // Advance the date by 7 days (one week)
        newDate.setHours(0, 0, 0, 0); // Normalize time
        return newDate; // Return the new date for the state update
      });
      setDateIndex((prev) => prev + 1); // Increment the navigation index
    } else {
      // If navigating backward ('prev')
      setCurDate((prev) => {
        const currentStartDate = new Date(prev); // Get the current start date
        currentStartDate.setHours(0, 0, 0, 0); // Normalize its time

        // Prevent navigating to a date range starting before today
        if (currentStartDate <= today) {
          console.log("Cannot navigate to dates before today.");
          return prev; // Return the previous state (don't change the date)
        }

        // Calculate the new start date for the previous week
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 7); // Go back 7 days
        newDate.setHours(0, 0, 0, 0); // Normalize time

        // Additional check: If the calculated date is strictly before today, reset to today
        // (This might be redundant given the first check, but acts as a safeguard)
        if (newDate < today) {
          return today;
        }

        return newDate; // Return the calculated previous week's start date
      });
      setDateIndex((prev) => prev - 1); // Decrement the navigation index
    }
  };

  // Function to fetch the teacher's timetable data asynchronously
  const fetchTimeTable = async () => {
    if (!teacherID) {
      // Don't attempt fetch if teacherID is not available
      return;
    }
    try {
      // Call the utility function to get grouped timetable data
      const { data, error } = await getTimetableGrouped(teacherID);
      if (error) {
        // Log error if the fetch failed
        console.error(error);
        return;
      }
      if (data) {
        // If data is received successfully, update the state
        setTeacherTimeTable(data);
      }
    } catch (error) {
      // Catch any unexpected errors during the fetch process
      console.error(error);
    }
  };

  // Function to handle selecting or deselecting a class period for substitution
  const handleSelectSubstitution = (period) => {
    // Create a unique key for this potential substitution using class ID, date, and month
    const newKey = `${period.class_id}-${selectedDate.dateNumber}-${selectedDate.month}`;

    // Create a shallow copy of the existing selections object to avoid direct mutation
    const updatedSubstitutions = { ...teacherSubstitutionsToSend };

    // Check if this period is already selected (key exists in the object)
    if (updatedSubstitutions[newKey]) {
      // If already selected, remove it (deselect)
      delete updatedSubstitutions[newKey];
    } else {
      // Else (not selected), add it to the object with the period data
      updatedSubstitutions[newKey] = period;
    }

    // Call the function passed via props to update the state in the parent component
    setteachersubstitutionstosend(updatedSubstitutions);
  };

  // Function to check if a specific period is currently selected for substitution
  const checkSelected = (period) => {
    // Basic validation to ensure necessary data exists
    if (
      !period ||
      !period.class_id ||
      !selectedDate?.dateNumber ||
      !selectedDate?.month
    ) {
      return false; // Cannot determine selection without required info
    }

    // Construct the unique key used for storing selections
    const newKey = `${period.class_id}-${selectedDate.dateNumber}-${selectedDate.month}`;
    // Return true if the key exists in the selections object (meaning it's selected), false otherwise
    // The '!!' converts the value (or undefined) into a boolean.
    return !!teacherSubstitutionsToSend[newKey];
  };

  // Effect Hook: Runs `getDates` whenever `curDate` changes.
  // This regenerates the list of displayed dates when the user navigates weeks.
  useEffect(() => {
    getDates();
  }, [curDate]); // Dependency: curDate

  // Effect Hook: Runs `fetchTimeTable` when the component mounts or `teacherID` changes.
  useEffect(() => {
    fetchTimeTable();
  }, [teacherID]); // Dependency: teacherID

  // Effect Hook: Merges fetched timetable data with the displayed dates.
  // Runs when `teacherTimeTable` state updates (after fetching).
  useEffect(() => {
    // Ensure both dates array and timetable data are available
    if (!dates.length || !teacherTimeTable) return;

    // Map over the current `dates` array
    const updatedDates = dates.map((date) => {
      // Find the periods corresponding to the current date's day number in the timetable data
      // Assumes a specific structure for teacherTimeTable: { "dayNumber": { "0": { "classes": [...] } } }
      // Provides an empty array as a fallback if periods are not found
      const periodsForDay =
        (teacherTimeTable[date.dayNumber.toString()] && // Check if day exists
          Object.keys(teacherTimeTable[date.dayNumber.toString()]).length > 0 && // Check if day has entries
          teacherTimeTable[date.dayNumber.toString()]["0"]["classes"]) || // Access classes array
        []; // Fallback to empty array
      // Return a new object combining the existing date info with the found periods
      return {
        ...date,
        periods: periodsForDay,
      };
    });
    // Update the `dates` state with the new array containing period information
    setDates(updatedDates);
  }, [teacherTimeTable]); // Dependency: teacherTimeTable

  // Effect Hook: Logs the current selected substitutions whenever they change (for debugging)
  useEffect(() => {
    console.log(teacherSubstitutionsToSend);
  }, [teacherSubstitutionsToSend]); // Dependency: teacherSubstitutionsToSend

  // Effect Hook: Logs the current dates array whenever it changes (for debugging)
  useEffect(() => {
    // console.log(dates);
  }, [dates]); // Dependency: dates

  // JSX Rendering starts here
  return (
    <div>
      {/* Container for the main calendar interface (date list and period list) */}
      <div className="w-[clamp(300px,100%,700px)] border-borderc border-t-1 border-b-1 flex flex-row p-[min(3vw,30px)] h-[70dvh] overflow-scroll">
        {/* Left column: List of selectable dates */}
        <div className="flex flex-col gap-[10px] items-center justify-start py-[min(3vw,50px)]">
          {/* Map over the `dates` array to render each date item */}
          {dates.map((date, index) => {
            // console.log(date); // Debug log for individual date object
            return (
              // Clickable div for each date
              <div
                key={index} // Use index as key (consider a more stable key if possible)
                className={`w-fit p-[10px]  ${
                  // Conditional styling: Apply background if this date is the selectedDate
                  selectedDate == date ? "bg-textc text-backgroundc" : " " // Note: Object comparison might be unreliable, consider comparing date.getTime()
                }
                        flex flex-col items-center rounded-md transition-all duration-200 ease-in-out cursor-pointer`}
                onClick={() => {
                  // Set this date object as the selectedDate when clicked
                  setSelectedDate(date);
                }}
              >
                {/* Display the day number */}
                <h1 className="text-subheading">{date.dateNumber}</h1>
                {/* Display the abbreviated day name */}
                <span className="text-[min(0.7rem,3vw)]">{date.day}</span>
              </div>
            );
          })}
        </div>
        {/* Right column: Display periods for the selected date */}
        <div className="flex-1 flex flex-col lg:flex-wrap gap-[10px] p-[min(3vw,50px)] ">
          {/* Conditional rendering based on whether a date is selected and has periods */}
          {selectedDate?.periods?.length > 0 ? (
            // If selected date has periods, map over them
            selectedDate.periods.map((period, index) => {
              //   console.log(period); // Debug log for individual period object
              return (
                // Clickable div for each period
                <div
                  key={index} // Use index as key (consider period.id or similar if available)
                  className={`${
                    // Conditional styling based on whether the period is selected for substitution
                    checkSelected(period)
                      ? "bg-textc text-backgroundc" // Style for selected period
                      : "bg-backgroundc text-textc" // Style for non-selected period
                  } p-[min(2vw,20px)] py-[min(5vw,20px)] h-fit
                  rounded-md flex items-center justify-center w-[min(100%)]`}
                  onClick={() => handleSelectSubstitution(period)} // Call handler to toggle selection
                >
                  {/* Display subject name */}
                  <h1 className="flex-1/3 flex items-center justify-center">
                    {period.subject_name}
                  </h1>
                  {/* Display start and end time (hidden on smaller screens) */}
                  <div className="flex-1/3 border-borderc border-l-1 items-center justify-center hidden md:flex text-[min(1rem,10px)]">
                    {period.start_time} - {period.end_time}
                  </div>
                  {/* Display duration (hidden on smaller screens) */}
                  <div className="flex-1/3 items-center justify-center hidden md:flex text-[min(1rem,10px)]">
                    {period.duration}
                  </div>
                </div>
              );
            })
          ) : // Condition: If selected date is Sunday
          selectedDate && selectedDate.dayNumber === 0 ? (
            <h1 className="h-full w-full flex items-center justify-center text-borderc">
              Select a working day to display classes {/* Message for Sunday */}
            </h1>
          ) : // Condition: If no date is selected yet
          selectedDate == null ? (
            <h1 className="h-full w-full flex items-center justify-center text-borderc">
              Select a date to view classes {/* Prompt to select a date */}
            </h1>
          ) : (
            // Condition: If a date is selected but has no periods (and isn't Sunday)
            <h1 className="h-full w-full flex items-center justify-center text-borderc">
              No classes {/* Message for days with no classes */}
            </h1>
          )}
        </div>
      </div>

      {/* Navigation buttons container */}
      <div className="w-[clamp(300px,100%,700px)] flex flex-row items-center justify-between p-[min(3vw,30px)]">
        {/* Previous week button */}
        <button
          onClick={() => navigateCalender("prev")}
          className={`${
            // Disable button visually and functionally if dateIndex is 0 (at the earliest allowed week)
            dateIndex !== 0 ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          Prev
        </button>
        {/* Next week button */}
        <button onClick={() => navigateCalender("next")}>Next</button>
      </div>
    </div>
  );
}

export default CalenderClassSelector; // Export the component for use in other parts of the application
