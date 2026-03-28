import { setActiveCoursesCount, setPendingComplaints, setRecentUsers, setStudentsCount, setTeachersCount } from "../Redux/admin";

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

export const storeData = (data,dispatch) => {
    dispatch(setStudentsCount(data.total_students))
    dispatch(setTeachersCount(data.total_teachers))
    dispatch(setActiveCoursesCount(data.active_courses))
    dispatch(setPendingComplaints(data.pending_complaints))
    dispatch(setRecentUsers(data.recent_users))
    dispatch(setPendingComplaints(data.recent_complaints))
}