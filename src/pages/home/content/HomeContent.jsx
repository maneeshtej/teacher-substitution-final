import React, { useEffect, useState } from "react";
import { useManeeshState } from "../../../context/StateProvider";

function HomeContent() {
  const { getPersistState } = useManeeshState();
  const [teacherID, setTeacherID] = useState(null);

  useEffect(() => {
    setTeacherID(getPersistState() || null);
  });

  useEffect(() => {
    console.log(teacherID);
  }, [teacherID]);
  return (
    <div className="text-white font-medium text-[13px]">
      <span>Today</span>
      <div className="h-[4vh]"></div>
      <div className="h-[30vh] w-[100%] border-2">1</div>
      <div className="h-[4vh]"></div>
      <div className="h-[30vh] w-[100%] border-2">2</div>
      <div className="h-[4vh]"></div>
      <div className="h-[30vh] w-[100%] border-2">3</div>
      <div className="h-[4vh]"></div>
      <div className="h-[30vh] w-[100%] border-2">4</div>
      <div className="h-[4vh]"></div>
      <div className="h-[30vh] w-[100%] border-2">5</div>
      <div className="h-[4vh]"></div>
      <div className="h-[30vh] w-[100%] border-2">6</div>
      <div className="h-[4vh]"></div>
      <div className="h-[30vh] w-[100%] border-2">7</div>
      <div className="h-[40vh]"></div>
    </div>
  );
}

export default HomeContent;
