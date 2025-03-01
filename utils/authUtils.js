import { supabase } from "./supabase";

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error("Sign-in error:", error);
    return { data: null, error };
  } else {
    // console.log("User signed in:", data);
    return { data, error: null };
  }
};

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("error");
    return { data: null, error };
  }
  // console.log(data);
  return { data, error: null };
};

export const isUserLoggedIn = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error checking user:", error.message);
    return false;
  }

  return !!data?.user;
};
