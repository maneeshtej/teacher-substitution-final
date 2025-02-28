import { data } from "react-router-dom";
import { supabase } from "./supabase.js";

export const fetchUsers = async () => {
  const { data, error } = await supabase.from("Teachers").select("*");

  if (error) {
    return { data: null, error };
  } else {
    return { data, error: null };
  }
};

export const handleFetch = async (fetchFunction, setFunction) => {
  const { data, error } = await fetchFunction();

  if (error) {
    console.error("error : ", error);
  }

  if (data) {
    if (setFunction) {
      setFunction(data);
    } else {
      return { data, error: null };
    }
  }
};

export const getTeacherDetailsByEmail = async (email) => {
  try {
    // console.log("Email : ", email)
    const { data, error } = await supabase
      .from("Teachers")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("Error fetching teacher details:", error);
      return { data: null, error };
    }
    //   console.log(data);
    return { data, error: null };
  } catch (e) {
    console.error("Unexpected error fetching teacher details:", e);
    return { data: null, error: e }; // Return error properly
  }
};

export const getTeacherSubstitutionsByID = async (ID) => {
  try {
    const { data, error } = await supabase
      .from("Substitution")
      .select(
        "*, Classes:class_id(Subjects:subject_id(*)), Teachers:sub_teacher_id(name)"
      )
      .eq("teacher_id", ID);

    if (error) {
      console.error("error : ", error);
      return { data: null, error };
    }

    // console.log(data);

    const flattenedData = data.map((item) => ({
      sub_id: item.sub_id,
      re_sub_id: item.re_sub_id,
      teacher_id: item.teacher_id,
      sub_teacher_id: item.sub_teacher_id,
      class_id: item.class_id,
      date_of_period: item.date_of_period,
      created_at: item.created_at,
      status: item.status,
      state: item.state,
      reason: item.reason,
      re_sub: item.re_sub,
      subject_id: item.Classes?.Subjects?.subject_id || null,
      subject_name: item.Classes?.Subjects?.subject_name || null,
      sub_teacher_name: item.Teachers?.name || null,
    }));

    //   console.log(flattenedData);

    return { data: flattenedData, error: null };
  } catch (error) {
    console.error("error : ", error);
    return { data: null, error };
  }
};

export const getTeacherTimetableByID = async (ID) => {
  if (!ID) {
    console.error("error : no ID");
    return { data: null, error: "no ID" };
  }

  try {
    const { data, error } = await supabase
      .from("Classes")
      .select("*")
      .eq("teacher_id", ID);

    if (error) {
      return { data: null, error: error };
    }

    if (data) {
      return { data, error: null };
    }
  } catch (error) {
    console.error("error : ", error);
    return { data: null, error };
  }
};
export const getTimetableGrouped = async (ID) => {
  if (!ID) {
    console.error("Error: No ID provided");
    return { data: null, error: "No ID provided" };
  }

  try {
    const { data, error } = await supabase.rpc("get_classes_by_teacher", {
      p_teacher_id: ID,
    });

    if (error) {
      console.error("Error: ", error);
      return { data: null, error };
    }

    const groupedData = data.reduce((acc, bcc) => {
      if (!acc[bcc.day_of_week]) {
        acc[bcc.day_of_week] = [];
      }
      acc[bcc.day_of_week].push(bcc);
      return acc;
    }, {});

    return { data: groupedData, error: null };
  } catch (error) {
    console.error("Error: ", error);
    return { data: null, error };
  }
};

export const getAllTeachers = async (teacherID) => {
  if (!teacherID) {
    console.error("error : teacherID not given");
    return { data: null, error: "no teacherID" };
  }
  const { data, error } = await supabase
    .from("Teachers")
    .select("*")
    .neq("id", teacherID);

  if (error) {
    console.error("error : ", error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const getSubstitutionsSortedandFiltered = async ({
  teacherID,
  type,
  sortBy = "dateofPeriod",
  sort = "Asc",
  status = null,
  state = null,
  subTeacherFilter = null,
}) => {
  console.log(type);
  if (!teacherID) {
    console.error("error : no TeacherID provided");
  }

  let query = supabase
    .from("Substitution")
    .select(
      "*, Classes:class_id(Subjects:subject_id(*)), Teachers:sub_teacher_id(name)"
    )
    .neq("deleted", "true");

  if (type == "sent" || type == null || type == undefined) {
    query = query.eq("teacher_id", teacherID);
  } else if (type == "rec") {
    query = query.eq("sub_teacher_id", teacherID);
  }

  if (sortBy === "dateofPeriod") {
    query = query.order("date_of_period", { ascending: sort === "Asc" });
  } else if (sortBy === "createdAt") {
    query = query.order("created_at", { ascending: sort === "Asc" });
  } else if (sortBy === "status") {
    query = query.order("status", { ascending: sort === "Asc" });
  } else if (sortBy === "state") {
    query = query.order("state", { ascending: sort === "Asc" });
  } else if (sortBy === "reason") {
    query = query.order("reason", { ascending: sort === "Asc" });
  }

  const { data, error } = await query;

  if (error) {
    console.error("error : ", error);
    return { data: null, error: error };
  }

  if (data) {
    const flattenedData = data.map((item) => ({
      sub_id: item.sub_id,
      re_sub_id: item.re_sub_id,
      teacher_id: item.teacher_id,
      sub_teacher_id: item.sub_teacher_id,
      class_id: item.class_id,
      date_of_period: item.date_of_period,
      created_at: item.created_at,
      status: item.status,
      state: item.state,
      reason: item.reason,
      re_sub: item.re_sub,
      subject_id: item.Classes?.Subjects?.subject_id || null,
      subject_name: item.Classes?.Subjects?.subject_name || null,
      sub_teacher_name: item.Teachers?.name || null,
      deleted: item.deleted,
    }));

    if (flattenedData) {
      return { data: flattenedData, error: null };
    }
  }
};
