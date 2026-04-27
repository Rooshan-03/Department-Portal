import { setActiveCoursesCount, setAllStudents, setAllTeachers, setPendingComplaints, setRecentUsers, setStudentsCount, setTeachersCount } from "../Redux/admin";

export const getSafeAdminData = () => {
    const data = localStorage.getItem('adminData');

    if (!data || data === "undefined") {
        return {
            access_token: null,
            email: null,
            name: null,
            id: null
        };
    }

    try {
        const parsed = JSON.parse(data);

        return {
            access_token: parsed?.access_token ?? null,
            email: parsed?.email ?? null,
            name: parsed?.name ?? null,
            id: parsed?.id ?? null
        };
    } catch (e) {
        return {
            access_token: null,
            email: null,
            name: null,
            id: null
        };
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

export const storeData = (data, dispatch) => {
    dispatch(setStudentsCount(data.total_students))
    dispatch(setTeachersCount(data.total_teachers))
    dispatch(setActiveCoursesCount(data.active_courses))
    dispatch(setPendingComplaints(data.pending_complaints))
    dispatch(setPendingComplaints(data.recent_complaints))
    const teachers = data.recent_users.filter(user => user.role === "teacher");
    const students = data.recent_users.filter(user => user.role === "student");

    dispatch(setAllTeachers(teachers));
    dispatch(setAllStudents(students));
}