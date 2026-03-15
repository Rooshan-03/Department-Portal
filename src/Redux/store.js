import { configureStore } from "@reduxjs/toolkit";
import adminReducer from './admin'
import studentReducer from './student'
import teacherReducer from './teacher'

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        student: studentReducer,
        teacher: teacherReducer
    }
})