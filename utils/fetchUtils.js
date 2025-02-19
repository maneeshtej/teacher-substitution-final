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
        const {data, error} = await supabase
        .from("Substitution")
        .select('*, Classes:class_id(Subjects:subject_id(*)), Teachers:sub_teacher_id(name)')
        .eq("teacher_id", ID)

        if (error) {
            console.error("error : ", error);
            return {data:null, error};
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
            sub_teacher_name: item.Teachers?.name || null
          }));
          
        //   console.log(flattenedData);
          

        return {data: flattenedData, error: null};

    } catch (error) {
        console.error("error : ", error);
        return {data:null, error};
    }
}
  