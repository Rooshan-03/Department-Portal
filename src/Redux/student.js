import { createSlice } from "@reduxjs/toolkit";
import { getSafeStudentData } from "../services/Validation";

const studentSlice = createSlice({
    name: 'student',
    initialState: {
        studentData: getSafeStudentData(),
        enrolledCourses: [],
        availableCourses: [],
        schedule: [],
        loading: false,
        error: null,
        success: null
    },
    reducers: {
        setStudentData: (state, action) => {
            state.studentData = action.payload;
            localStorage.setItem('studentData', JSON.stringify(action.payload));
            state.error = null;
            state.loading = false;
        },
        setEnrolledCourses: (state, action) => {
            state.enrolledCourses = action.payload;
            state.loading = false;
        },
        setAvailableCourses: (state, action) => {
            state.availableCourses = action.payload;
            state.loading = false;
        },
        setStudentSchedule: (state, action) => {
            state.schedule = action.payload;
            state.loading = false;
        },
        addEnrolledCourse: (state, action) => {
            state.enrolledCourses.push(action.payload);
            state.loading = false;
        },
        setStudentLoading: (state, action) => {
            state.loading = action.payload;
        },
        setStudentError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setStudentSuccess: (state, action) => {
            state.success = action.payload;
            state.loading = false;
        },
        clearStudentMessages: (state) => {
            state.error = null;
            state.success = null;
        },
        clearStudentData: (state) => {
            state.studentData = null;
            state.enrolledCourses = [];
            state.availableCourses = [];
            state.schedule = [];
            state.error = null;
            state.success = null;
            localStorage.removeItem('studentData');
        }
    }
})

export const { 
    setStudentData, 
    setEnrolledCourses, 
    setAvailableCourses, 
    setStudentSchedule,
    addEnrolledCourse, 
    setStudentLoading, 
    setStudentError,
    setStudentSuccess,
    clearStudentMessages,
    clearStudentData 
} = studentSlice.actions;
export default studentSlice.reducer