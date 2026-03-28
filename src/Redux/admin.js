import { createSlice } from "@reduxjs/toolkit";
import { getSafeAdminData } from "../services/Validation";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        adminData: getSafeAdminData(),
        allStudents: [],
        studentsCount: null,
        allTeachers: [],
        teachersCount: null,
        activeCoursesCount: null,
        pendingComplaints: null,
        recentUsers: null,
        recentComplaints: [],
        unAuthenticatedTeachers: [],
        unAuthenticatedStudents: [],
        allCourses: [],
        error: null,
        success: null,
        loading: false
    },

    reducers: {
        setAdminData: (state, action) => {
            state.adminData = action.payload;
            localStorage.setItem('adminData', JSON.stringify(action.payload));
            state.error = null;
            state.loading = false;
        },
        setAllStudents: (state, action) => {
            state.allStudents = action.payload
            state.error = null;
            state.loading = false;
        },
        setAllCourses: (state, action) => {
            state.allCourses = action.payload
            state.error = null;
            state.loading = false;
        },
        setStudentsCount: (state, action) => {
            state.studentsCount = action.payload
        },
        setTeachersCount: (state, action) => {
            state.teachersCount = action.payload
        },
        setAllUnAuthenticatedTeachers: (state, action) => {
            state.unAuthenticatedTeachers = action.payload
            state.error = null;
            state.loading = false;
        },
        setAllUnAuthenticatedStudents: (state, action) => {
            state.unAuthenticatedStudents = action.payload
            state.error = null;
            state.loading = false;
        },
        setAllTeachers: (state, action) => {
            state.allTeachers = action.payload
            state.error = null;
            state.loading = false;
        },
        setActiveCoursesCount: (state, action) => {
            state.activeCoursesCount = action.payload
            state.error = null
            state.loading = false
        },
        setPendingComplaints: (state, action) => {
            state.pendingComplaints = action.payload
            state.error = null
            state.loading = false
        },
        setRecentUsers: (state, action) => {
            state.recentUsers = action.payload
            state.error = null
            state.loading = false
        },
        setRecentComplaints: (state, action) => {
            state.recentComplaints = action.payload
            state.error = null
            state.loading = false
        },
        appendNewTeacher: (state, action) => {
            state.allTeachers.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        appendNewStudent: (state, action) => {
            state.allStudents.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        appendCourse: (state, action) => {
            state.allCourses.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        clearRecord: (state) => {
            state.adminData = null;
            state.error = null;
            state.loading = false;
            state.success = null;
            localStorage.removeItem('adminData');
        },
        clearMessages: (state) => {
            state.error = null;
            state.success = null
        },
        removeFromUnauthenticatedTeachers: (state, action) => {
            state.unAuthenticatedTeachers = state.unAuthenticatedTeachers.filter(
                teacher => teacher.id !== action.payload
            );
        },
        removeFromUnauthenticatedStudents: (state, action) => {
            state.unAuthenticatedStudents = state.unAuthenticatedStudents.filter(
                student => student.id !== action.payload
            );
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSuccess: (state, action) => {
            state.success = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setAdminData, setLoading, setError, setSuccess, clearRecord, setAllTeachers, setAllStudents, removeFromUnauthenticatedStudents, removeFromUnauthenticatedTeachers, setAllUnAuthenticatedTeachers, setAllUnAuthenticatedStudents, appendNewStudent, appendNewTeacher, setAllCourses, appendCourse, setTeachersCount, setStudentsCount, clearMessages, setActiveCoursesCount, setPendingComplaints, setRecentUsers, setRecentComplaints} = adminSlice.actions;
export default adminSlice.reducer;