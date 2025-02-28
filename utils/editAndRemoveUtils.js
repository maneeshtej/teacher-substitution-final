import useTeachStore from "../src/context/useTeachStore";
import { logSubstitutions } from "./recentFunctionUtils";
import { supabase } from "./supabase";

export const removeSubstitutions = async (sub_ids) => {
  if (!sub_ids || sub_ids.length === 0) {
    console.error("Error: sub_ids not provided");
    return { data: null, error: "Substitution IDs not provided" };
  }

  try {
    const { data, error } = await supabase
      .from("Substitution")
      .update({ deleted: true })
      .in("sub_id", sub_ids);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error deleting substitutions:", error);
    return { data: null, error };
  }
};

export const updateSubstitutions = async (substitutions) => {
  if (!substitutions || Object.keys(substitutions).length === 0) {
    console.error("Error: No substitutions provided");
    return { data: null, error: "No data to update" };
  }

  const updates = Object.values(substitutions).map(async (substitution) => {
    if (!substitution.sub_id) {
      console.error("Skipping invalid entry:", substitution);
      return { data: null, error: "Invalid substitution data" };
    }

    const {
      sub_id,
      re_sub_id,
      teacher_id,
      sub_teacher_id,
      class_id,
      date_of_period,
      status,
      state,
      reason,
      group_id,
    } = substitution;

    return supabase
      .from("Substitution")
      .update({
        re_sub_id,
        teacher_id,
        sub_teacher_id,
        class_id,
        date_of_period,
        status,
        state,
        reason,
        group_id,
      })
      .eq("sub_id", sub_id);
  });

  const results = await Promise.all(updates);

  const errors = results.filter(({ error }) => error);
  if (errors.length > 0) {
    console.error("Some updates failed:", errors);
    await logSubstitutions(
      "EDIT",
      substitutions[0]?.teacher_id,
      JSON.stringify(Object.values(substitutions)), // Convert object to an array
      substitutions[0]?.group_id
    );

    return { data: null, error: errors };
  }

  await logSubstitutions(
    "EDIT",
    substitutions[0]?.teacher_id,
    JSON.stringify(Object.values(substitutions)), // Convert object to an array
    substitutions[0]?.group_id
  );

  return { data: results, error: null };
};
