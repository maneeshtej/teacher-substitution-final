import React from "react";
import { useNavigate } from "react-router-dom";

function SubstitutionCard({ data }) {
  const navigate = useNavigate();
  //   console.log(data);
  const [year, month, day] = data.date_of_period.split("-");
  //   console.log(day);
  if (!data) {
    return <div>No data</div>;
  }
  return (
    <div
      className=" flex items-center justify-center h-[9vh] w-[100%] bg-[rgb(20,20,20)] mb-[10px] rounded-[10px]"
      onClick={() => {
        navigate("/home/subdetails", {
          state: { data },
        });
      }}
    >
      {day}
    </div>
  );
}

export default SubstitutionCard;
