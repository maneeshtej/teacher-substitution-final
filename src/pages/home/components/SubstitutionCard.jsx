import React from "react";
import { useNavigate } from "react-router-dom";

function SubstitutionCard({ data, selectMode = false, selected = false }) {
  const navigate = useNavigate();

  console.log("SubstitutionCard Data:", JSON.stringify(data, null, 2));

  if (!data) {
    return <div>No data</div>;
  }

  let day = "";
  if (data?.date_of_period) {
    const [year, month, dayExtracted] = data.date_of_period.split("-");
    day = dayExtracted;
    console.log(day);
  }

  return (
    <div
      className="flex items-center justify-center h-[9vh] w-[100%] bg-[rgb(20,20,20)] rounded-[10px] transition-all duration-200 ease-in-out"
      onClick={() => {
        if (selectMode) {
          return;
        }
        navigate("/home/subdetails", {
          state: { data },
        });
      }}
      style={{
        backgroundColor: selected ? "white" : "",
        color: selected ? "black" : "",
      }}
    >
      {day}
    </div>
  );
}

export default SubstitutionCard;
