import { createSlice } from "@reduxjs/toolkit";
import { getSafeAdminData } from "../services/Validation";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        adminData: getSafeAdminData(),
        allStudents: [],
        allTeachers: [],
        unAuthenticatedTeachers: [],
        unAuthenticatedStudents: [],
        allCourses: [],
        error: null,
        success:null,
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
            state.success=null;
            localStorage.removeItem('adminData');
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

export const { setAdminData, setLoading, setError,setSuccess, clearRecord, setAllTeachers, setAllStudents, setAllUnAuthenticatedTeachers, setAllUnAuthenticatedStudents, appendNewStudent, appendNewTeacher, setAllCourses, appendCourse } = adminSlice.actions;
export default adminSlice.reducer;