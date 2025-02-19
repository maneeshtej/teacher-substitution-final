import React, { useEffect, useState } from "react";
import { getTeacherSubstitutionsByID } from "../../../../utils/fetchUtils";
import {
  sortByDateAscending,
  sortByDateDescending,
  groupByDate,
  groupBySubject,
  groupBySubTeacher,
} from "../../../../utils/sortUtils";
import SubstitutionCard from "../components/SubstitutionCard";
import SubstitutionsGroup from "../components/SubstitutionsGroup";
import useTeachStore from "../../../context/useTeachStore";

function HomeContent({ sortInfo }) {
  const teacherID = useTeachStore((state) => state.teacherid);
  const [teacherSubstitutions, setTeacherSubstitutions] = useState(null);
  const [groupedSubstitutions, setGroupedSubstitutions] = useState(null);
  const [sortedTeacherSubstitutions, setSortedSubstituions] = useState();

  const fetchSubstitutions = async () => {
    try {
      const { data, error } = await getTeacherSubstitutionsByID(teacherID);

      if (error) {
        return;
      }

      setTeacherSubstitutions(data);
    } catch (error) {
      console.error("error : ", error);
      return;
    }
  };

  useEffect(() => {
    fetchSubstitutions();
  }, [teacherID]);

  const groupSubstitutions = () => {
    console.log(sortInfo.param);

    if (sortInfo.param == "date") {
      const groupedData = groupByDate(teacherSubstitutions);
      setGroupedSubstitutions(groupedData);
    } else if (sortInfo.param == "subject") {
      const groupedData = groupBySubject(teacherSubstitutions);
      setGroupedSubstitutions(groupedData);
    } else if (sortInfo.param == "teacher") {
      const groupedData = groupBySubTeacher(teacherSubstitutions);
      setGroupedSubstitutions(groupedData);
    }
  };

  useEffect(() => {
    groupSubstitutions();
  }, [sortInfo]);

  useEffect(() => {
    console.log(teacherSubstitutions);
    if (teacherSubstitutions) {
      const groupedData = groupByDate(teacherSubstitutions);
      setGroupedSubstitutions(groupedData ?? null);
    }
    console.log(groupedSubstitutions);
  }, [teacherSubstitutions]);
  return (
    <div className="text-white font-medium text-[13px]">
      {groupedSubstitutions && Object.keys(groupedSubstitutions).length > 0 ? (
        Object.keys(groupedSubstitutions).map((data, index) => (
          <SubstitutionsGroup
            title={data}
            data={groupedSubstitutions[data]}
            key={index}
          ></SubstitutionsGroup>
        ))
      ) : (
        <>no</>
      )}
      <div className="h-[40vh]"></div>
    </div>
  );
}

export default HomeContent;
