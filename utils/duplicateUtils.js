import { supabase } from "./supabase";

export const checkDuplicateSubstitutions = async (substitutions) => {
  if (!substitutions || Object.keys(substitutions).length === 0)
    return { value: false, duplicates: {} };

  const queries = Object.keys(substitutions).map(async (key) => {
    const sub = substitutions[key];

    const { data, error } = await supabase
      .from("Substitution")
      .select("sub_id")
      .eq("teacher_id", sub.teacher_id)
      .eq("sub_teacher_id", sub.sub_teacher_id)
      .eq("class_id", sub.class_id)
      .eq("date_of_period", sub.date_of_period)
      .limit(1);

    if (error) {
      console.error("Error checking duplicates:", error);
      return { key, duplicate: false };
    }

    return { key, duplicate: data.length > 0 };
  });

  const results = await Promise.all(queries);

  // Determine the final value based on whether any substitution is a duplicate
  const duplicates = results.reduce((acc, { key, duplicate }) => {
    acc[key] = duplicate;
    return acc;
  }, {});

  // Final value is true if there is any duplicate, otherwise false
  const finalValue = Object.values(duplicates).includes(true);

  console.log(finalValue, duplicates);

  return { value: finalValue, duplicates };
};
