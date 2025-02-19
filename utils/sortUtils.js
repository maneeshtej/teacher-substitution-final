export const sortByDateAscending = (data) => {
    if (!data) {
        console.error("error : no data");
    }

    const sortedData = [...data].sort(
        (a, b) => new Date(a.date_of_period) - new Date(b.date_of_period)
    );

    return sortedData;
}

export const sortByDateDescending = (data) => {
    if (!data) {
        console.error("error : no data");
    }

    const sortedData = [...data].sort(
        (a, b) => new Date(b.date_of_period) - new Date(a.date_of_period)
    );

    return sortedData;
}

export const groupByDate = (data) => {
    if (!data || !Array.isArray(data)) {
        console.error("Error: Invalid data");
        return {}; 
    }

    return data.reduce((acc, item) => {
        const date = item.date_of_period; 

        if (!acc[date]) {
            acc[date] = []; 
        }

        acc[date].push(item); 
        return acc;
    }, {});
};

export const groupBySubject = (data) => {
    if (!data || !Array.isArray(data)) {
        console.error("Error: Invalid data");
        return {}; 
    }

    return data.reduce((acc, item) => {
        const temp = item.subject_name; 

        if (!acc[temp]) {
            acc[temp] = []; 
        }

        acc[temp].push(item); 
        return acc;
    }, {});

}

export const groupBySubTeacher = (data) => {
    if (!data || !Array.isArray(data)) {
        console.error("Error: Invalid data");
        return {}; 
    }

    return data.reduce((acc, item) => {
        const temp = item.sub_teacher_name; 

        if (!acc[temp]) {
            acc[temp] = []; 
        }

        acc[temp].push(item); 
        return acc;
    }, {});

}
