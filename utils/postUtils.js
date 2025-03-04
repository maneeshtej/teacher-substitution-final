import { logSubstitutions } from "./recentFunctionUtils";
import { supabase } from "./supabase";

import { v4 as uuidv4 } from "uuid";

export const sendSubstitutions = async (data) => {
  if (!data || Object.keys(data).length === 0) {
    return logError("No data provided");
  }

  const groupId = uuidv4();
  const validSubstitutions = await processSubstitutions(data, groupId);

  if (validSubstitutions.length === 0) {
    return logError("No valid substitutions to insert");
  }

  console.log("Inserting into Supabase:", validSubstitutions);
  return insertSubstitutions(validSubstitutions, groupId);
};

// 🔹 Process and validate input data
const processSubstitutions = async (data, groupId) => {
  const temp = await Promise.all(
    Object.values(data).map(async (value, index) => {
      if (!value.teacher_id || !value.sub_teacher_id) {
        console.error(
          `Error at index ${index}: Missing teacher_id or sub_teacher_id`
        );
        return null;
      }

      return {
        teacher_id: Number(value.teacher_id),
        sub_teacher_id: Number(value.sub_teacher_id),
        class_id: Number(value.class_id),
        date_of_period: new Date(value.date_of_period).toISOString(),
        status: "pending",
        state: "incomplete",
        reason: "Medical leave",
        re_sub: false,
        group_id: groupId,
      };
    })
  );

  return temp.filter(Boolean);
};

// 🔹 Insert into Supabase and log actions
const insertSubstitutions = async (validSubstitutions, groupId) => {
  try {
    const { data: insertedData, error } = await supabase
      .from("Substitution")
      .insert(validSubstitutions);

    if (error) return logError("Supabase Insert Error:", error);

    console.log("Successfully inserted into Supabase:", insertedData);
    return logClassIds(validSubstitutions, groupId, insertedData);
  } catch (err) {
    return logError("Unexpected error:", err.message || "Unknown error");
  }
};

// 🔹 Fetch class IDs and log the action
const logClassIds = async (validSubstitutions, groupId, insertedData) => {
  const { data: classData, error } = await supabase
    .from("Substitution")
    .select("class_id")
    .eq("group_id", groupId);

  if (error || !classData?.length) {
    return logError("Error fetching class_ids for logging:", error);
  }

  const classIds = classData.map((item) => item.class_id);
  await logSubstitutions("ADD", validSubstitutions[0].teacher_id, classIds);
  return { data: insertedData, error: null };
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
    const subsToSend = await processSubstitutions(substitutions, groupId);
    const { data: result, error } = await supabase
      .from("Drafts")
      .insert(subsToSend);

    if (error) return logError("Supabase Insert Error:", error);

    console.log("Successfully inserted into Supabase:", result);
    return { data: "success", error: null };
  } catch (err) {
    return logError("Unexpected error:", err.message || "Unknown error");
  }
  console.log(subsToSend);
};
