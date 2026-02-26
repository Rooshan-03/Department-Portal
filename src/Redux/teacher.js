import { createSlice } from "@reduxjs/toolkit";
import { getSafeTeacherData } from "../services/Validation";

const teacerSlice = createSlice({
    name: 'teacher',
    initialState: {
        teacherData: getSafeTeacherData()
    },
    reducers: {
        setTeacherData: (state, action) => {
            state.teacherData = action.payload;
            localStorage.setItem('teacherData', JSON.stringify(action.payload));
            state.error = null;
            state.loading = false;
        }
    }
})


export const  {setTeacherData} = teacerSlice.actions;
export default teacerSlice.reducer