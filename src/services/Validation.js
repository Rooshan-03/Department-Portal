export const getSafeAdminData = () => {
    const data = localStorage.getItem('adminData');
    if (!data || data === "undefined") return null; 
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};


export const getSafeTeacherData = () => {
    const data = localStorage.getItem('teacherData');
    if (!data || data === "undefined") return null; 
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

export const getSafeStudentData = () => {
    const data = localStorage.getItem('studentData');
    if (!data || data === "undefined") return null; 
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};