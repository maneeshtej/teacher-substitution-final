import React from "react";
import SubstitutionCard from "./SubstitutionCard";

function SubstitutionsGroup({ data, title }) {
  //   console.log(data);
  return (
    <div className="">
      <div className="border-l-[1px] border-[rgb(170,170,170)] pl-[15px] ">
        <div className="h-[4vh] text-[12px]">{title}</div>
        <div className="pl-[10px]">
          {Object.keys(data).map((subData, index) => (
            <SubstitutionCard data={data[subData]}></SubstitutionCard>
          ))}
        </div>
      </div>
      <div className="h-[4vh]"></div>
    </div>
  );
}

export default SubstitutionsGroup;
