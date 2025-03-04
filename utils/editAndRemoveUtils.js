import useTeachStore from "../src/context/useTeachStore";
import { logSubstitutions } from "./recentFunctionUtils";
import { supabase } from "./supabase";

export const removeSubstitutions = async (sub_ids) => {
  if (!sub_ids || sub_ids.length === 0) {
    console.error("❌ Error: No substitution IDs provided for deletion");
    return { data: null, error: "No substitution IDs provided" };
  }

  const { data, error } = await supabase
    .from("Substitution")
    .select("*")
    .in("sub_id", sub_ids);

  if (data) {
    const { data: data2, error } = await supabase
      .from("Deleted")
      .insert(data.map(({ sub_id, ...rest }) => rest));
    console.log(data2, error);

    if (!error) {
      const { data: deletedData, error } = await supabase
        .from("Substitution")
        .delete()
        .in("sub_id", sub_ids);

      console.log(deletedData, error);
    }
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
