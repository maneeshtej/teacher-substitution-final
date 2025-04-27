import React, {
  lazy,
  Suspense,
  useDebugValue,
  useEffect,
  useState,
} from "react";
import { fetchUsers } from "../../../utils/fetchUtils";
import useTeachStore from "../../context/useTeachStore";
import { data } from "react-router-dom";
import { SubstitutionsDisplay } from "./components/SubstitutionsDisplay";

const CalenderClassSelector = lazy(() =>
  import("./components/CalenderClassSelector")
);

function TakeClass({
  teacherSubstitutionsToSend,
  setteachersubstitutionstosend,
}) {
  const [teachers, setTeachers] = useState();
  const [subTeacherID, setSubTeacherID] = useState(null);
  const teacherID = useTeachStore((state) => state.teacherid);
  const fetchAllTeachers = async () => {
    const { data, error } = await fetchUsers(teacherID);

    // console.log(teacherID);

    if (error) {
      console.error(error);
    }

    if (data) {
      setTeachers(data);
    }
  };

  const handleSelectChange = (teacher) => {
    setSubTeacherID(teacher);
  };

  useEffect(() => {
    fetchAllTeachers();
    console.log(teacherID);
  }, [teacherID]);

  useEffect(() => {
    if (
      teacherSubstitutionsToSend &&
      Object.keys(teacherSubstitutionsToSend).length > 0
    ) {
      const newTempSubstitutions = { ...teacherSubstitutionsToSend };

      Object.keys(newTempSubstitutions).forEach((sub) => {
        const newTempClass = {
          ...newTempSubstitutions[sub],
          sub_teacher_id: teacherID,
        };
        newTempSubstitutions[sub] = newTempClass;
        console.log(newTempSubstitutions[sub]);
      });
    }
    // console.log(teacherID);
  }, [teacherSubstitutionsToSend, teacherID]);

  useEffect(() => {
    // console.log(teachers);
  }, [teachers]);

  useEffect(() => {
    // console.log(subTeacherID);
  }, [subTeacherID]);

  return (
    <div className="px-[min(3vw,50px)]">
      <h1 className="text-subheading font-bold lg:font-normal py-[min(2vw,30px)] border-b-2 border-borderc">
        2. Select Substituion Teacher
      </h1>

      <div className="h-[2dvh]"></div>
      {teachers && teachers.length > 0 ? (
        <div className="p-[min(3vw,50px)] bg-textc text-backgroundc flex items-center justify-center rounded-md">
          <select
            onChange={(e) => {
              //   console.log(e.target.value);
              handleSelectChange(e.target.value);
            }}
          >
            <option>Select a teacher</option>
            {teachers.map((teacher, index) => {
              return (
                <option key={index} value={teacher.id}>
                  {teacher.name}
                </option>
              );
            })}
          </select>
        </div>
      ) : (
        <div className="p-[min(3vw,50px)] bg-textc text-backgroundc flex items-center justify-center rounded-md animate-pulse">
          <select className="invisible">
            <option>Select a teacher</option>
          </select>
        </div>
      )}

      <div className="h-[2dvh]"></div>

      <h1 className="text-subheading font-bold lg:font-normal py-[min(2vw,30px)] border-b-2 border-borderc">
        3. Select Classes
      </h1>

      <SubstitutionsDisplay
        teacherSubstitutionsToSend={teacherSubstitutionsToSend}
        setteachersubstitutionstosend={setteachersubstitutionstosend}
      ></SubstitutionsDisplay>

      <Suspense
        fallback={
          <div className="w-[clamp(300px,100%,700px)] flex flex-row p-[min(3vw,30px)] h-[70dvh] overflow-scroll bg-backgroundh animate-pulse rounded-md"></div>
        }
      >
        <CalenderClassSelector
          setteachersubstitutionstosend={setteachersubstitutionstosend}
          teacherID={subTeacherID}
          teacherSubstitutionsToSend={teacherSubstitutionsToSend}
        ></CalenderClassSelector>
      </Suspense>

      <div className="p-[min(3vw,50px)] flex flex-col gap-[10px]">
        {teacherSubstitutionsToSend &&
        Object.keys(teacherSubstitutionsToSend).length > 0 ? (
          Object.keys(teacherSubstitutionsToSend).map((subs, index) => {
            return (
              <div
                className="p-[min(3vw,50px)] w-[clamp(300px,100%,700px)] flex bg-textc text-backgroundc rounded-md w-[clamp(300px,100%,700px)]"
                key={index}
              >
                <div className=" rounded-md flex flex-col items-start cursor-pointer flex-2/5">
                  <h1>{teacherSubstitutionsToSend[subs]["subject_name"]}</h1>
                  <div className="text-[min(1rem,10px)] flex gap-[5px]">
                    <span>
                      {teacherSubstitutionsToSend[subs]["dateNumber"]}
                    </span>
                    <span>{teacherSubstitutionsToSend[subs]["month"]}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>No Classes</div>
        )}
      </div>
    </div>
  );
}

export default TakeClass;
