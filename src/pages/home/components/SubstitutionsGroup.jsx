import React from "react";
import SubstitutionCard from "./SubstitutionCard";

function SubstitutionsGroup({ data }) {
  //   console.log(data);
  return (
    <div className="flex flex-col gap-[4dvh]">
      {data && Object.keys(data).length > 0 ? (
        Object.keys(data).map((key, index) => {
          const temp2 = data[key];
          if (temp2 && Object.keys(temp2).length > 0) {
            return (
              <div className="flex flex-col">
                <div className="h-[4dvh] flex items-center">{key}</div>
                <div className="flex flex-col gap-[10px]">
                  {Object.keys(temp2).map((key2, index2) => {
                    return (
                      <SubstitutionCard data={temp2[key2]}></SubstitutionCard>
                    );
                  })}
                </div>
              </div>
            );
          } else {
            return <div>No Data</div>;
          }
        })
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
}

export default SubstitutionsGroup;
