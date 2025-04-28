import { data } from "react-router-dom";
import { logSubstitutions } from "./recentFunctionUtils";
import { supabase } from "./supabase";

import { v4 as uuidv4 } from "uuid";

const convertSubstitution = (data) => {
  const { teacher_id, sub_teacher_id, class_id, date } = data;
  const date_of_period = new Date(date.date).toISOString().split("T")[0];

  return {
    teacher_id,
    sub_teacher_id,
    class_id,
    date_of_period,
    created_at: new Date().toISOString(),
    status: "pending",
    state: "incomplete",
    reason: "None",
    re_sub: false,
  };
};

export const processSend = (teacherSubstitutionsToSend) => {
  const toSend = [];
  const tempSubs = { ...teacherSubstitutionsToSend };

  Object.keys(tempSubs).forEach((key, index) => {
    const finalSubs = {
      ...tempSubs[key],
      toSend: convertSubstitution(tempSubs[key]),
    };

    tempSubs[key] = { ...finalSubs };
    toSend.push(convertSubstitution(tempSubs[key]));
  });

  return toSend;
};

// export const sendSubstitutions = async (data) => {
//   if (!data || Object.keys(data).length === 0) {
//     return logError("No data provided");
//   }

//   const groupId = uuidv4();
//   const validSubstitutions = await processSubstitutions(data, groupId);

//   if (validSubstitutions.length === 0) {
//     return logError("No valid substitutions to insert");
//   }

//   console.log("Inserting into Supabase:", validSubstitutions);
//   return insertSubstitutions(validSubstitutions, groupId);
// };

// // 🔹 Process and validate input data
// const processSubstitutions = async (data, groupId) => {
//   const temp = await Promise.all(
//     Object.values(data).map(async (value, index) => {
//       if (!value.teacher_id || !value.sub_teacher_id) {
//         console.error(
//           `Error at index ${index}: Missing teacher_id or sub_teacher_id`
//         );
//         return null;
//       }

//       return {
//         teacher_id: Number(value.teacher_id),
//         sub_teacher_id: Number(value.sub_teacher_id),
//         class_id: Number(value.class_id),
//         date_of_period: new Date(value.date_of_period).toISOString(),
//         status: "pending",
//         state: "incomplete",
//         reason: "Medical leave",
//         re_sub: false,
//         group_id: groupId,
//       };
//     })
//   );

//   return temp.filter(Boolean);
// };

// 🔹 Insert into Supabase and log actions
// const insertSubstitutions = async (validSubstitutions, groupId) => {
//   try {
//     const { data: insertedData, error } = await supabase
//       .from("Substitution")
//       .insert(validSubstitutions);

//     if (error) return logError("Supabase Insert Error:", error);

//     console.log("Successfully inserted into Supabase:", insertedData);
//     return logClassIds(validSubstitutions, groupId, insertedData);
//   } catch (err) {
//     return logError("Unexpected error:", err.message || "Unknown error");
//   }
// };

// // 🔹 Fetch class IDs and log the action
// const logClassIds = async (validSubstitutions, groupId, insertedData) => {
//   const { data: classData, error } = await supabase
//     .from("Substitution")
//     .select("class_id")
//     .eq("group_id", groupId);

//   if (error || !classData?.length) {
//     return logError("Error fetching class_ids for logging:", error);
//   }

//   const classIds = classData.map((item) => item.class_id);
//   await logSubstitutions("ADD", validSubstitutions[0].teacher_id, classIds);
//   return { data: insertedData, error: null };
// };

export const insertSubstitutions = async (subs) => {
  if (!subs) {
    return { data: null, error: "no Subs" };
  }

  const { data, error } = await supabase.rpc("insert_values", {
    substitutions: subs, // Pass the array directly
  });

  if (error) {
    console.error("Insert Error:", error);
    return { data: null, error };
  }

  console.log("Insert successful:", data);
  return { data: "success", error: null };
};

export const sendSubstitutions = async (substitutionData) => {
  if (!substitutionData) {
    return { data: null, error: "no data" };
  }

  try {
    const { data: responseData, error } = await supabase.functions.invoke(
      "insert-substitutions",
      {
        body: substitutionData,
      }
    );

    if (error) {
      return { data: null, error };
    }

    return { data: 1, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const testSupabaseEdge = async (subs) => {
  if (!subs) {
    console.error("Missing 'subs' in the request body");
    return { data: null, error: "no data" };
  }

  try {
    const { data, error } = await supabase.functions.invoke("fetch-teachers", {
      body: { subs },
    });

    if (error) {
      console.error("Error invoking Supabase function:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error sending request:", error);
    return { data: null, error };
  }
};

// 🔹 Generic error handler
const logError = (message, error = null) => {
  console.error(message, error || "");
  return { data: null, error: message };
};

export const sendDraftSubstituions = async (substitutions) => {
  if (!substitutions) {
    console.error("error : no Substitutions");
  }

  try {
    const groupId = uuidv4();
    const { data: result, error } = await supabase
      .from("Drafts")
      .insert(substitutions);

    if (error) return logError("Supabase Insert Error:", error);

    console.log("Successfully inserted into Supabase:", result);
    return { data: "success", error: null };
  } catch (err) {
    return logError("Unexpected error:", err.message || "Unknown error");
  }
  console.log(subsToSend);
};
