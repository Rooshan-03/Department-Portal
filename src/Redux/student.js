import { createSlice } from "@reduxjs/toolkit";
import { getSafeStudentData } from "../services/Validation";

const studentSlice = createSlice({
    name: 'student',
    initialState: {
        studentData: getSafeStudentData()
    },
    reducers: {
        setStudentData: (state, action) => {
            state.studentData = action.payload;
            localStorage.setItem('studentData', JSON.stringify(action.payload));
            state.error = null;
            state.loading = false;
        }
    }
})


export const  {setStudentData} = studentSlice.actions;
export default studentSlice.reducer