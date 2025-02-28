import { supabase } from "./supabase";

export const logSubstitutions = async (action_type, teacher_id, class_ids) => {
  if (!action_type || !teacher_id || !class_ids) {
    console.error("Error: No action or teacherID provided.");
    return { data: null, error: "Missing required parameters." };
  }

  const { data: response, error } = await supabase
    .from("RecentActions")
    .insert([
      {
        action_type,
        teacher_id,
        class_ids,
      },
    ]);

  if (error) {
    console.error("Error logging substitution:", error);
    return { data: null, error };
  }

  return { data: response, error: null };
};
