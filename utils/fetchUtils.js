import {supabase} from "./supabase.js"



export const fetchUsers = async () => {
    const {data, error} = await supabase
    .from('Teachers')
    .select('*')

    if (error) {
        return {data: null, error};
    }

    else {
        return {data, error: null};
    }
};

export const handleFetch = async (fetchFunction, setFunction) => {
    const {data, error} = await fetchFunction();

    if (error) {
        console.error("error : ", error);
    }

    if (data) {
        if (setFunction) {
            setFunction(data);
        } else {
            return {data, error: null}
        }
    }
}

export const getTeacherDetailsByEmail = async (email) => {
    try {
        console.log("Email : ", email)
      const { data, error } = await supabase
        .from("Teachers")
        .select("*") 
        .eq("email", email); 
  
      if (error) {
        console.error("Error fetching teacher details:", error);
        return { data: null, error };
      }
      console.log(data);
      return { data, error: null };
    } catch (e) {
      console.error("Unexpected error fetching teacher details:", e);
      return { data: null, error: e }; // Return error properly
    }
  };
  