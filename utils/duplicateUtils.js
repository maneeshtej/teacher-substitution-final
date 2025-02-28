import { supabase } from "./supabase";

export const checkDuplicateSubstitutions = async (substitutions) => {
  if (!substitutions || Object.keys(substitutions).length === 0) return {};

  const queries = Object.keys(substitutions).map(async (key) => {
    const sub = substitutions[key];

    const { data, error } = await supabase
      .from("Substitution")
      .select("sub_id")
      .eq("class_id", sub.class_id)
      .eq("date_of_period", sub.date_of_period)
      .eq("deleted", false)
      .limit(1);

    if (error) {
      console.error("Error checking duplicates:", error);
      return { key, duplicate: false };
    }

    return { key, duplicate: data.length > 0 };
  });

  const results = await Promise.all(queries);

  console.log(results);

  return results.reduce((acc, { key, duplicate }) => {
    acc[key] = duplicate;
    return acc;
  }, {});
};
