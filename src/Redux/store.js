import { configureStore } from "@reduxjs/toolkit";
import adminReducer from './admin'

export const store = configureStore({
    reducer: {
        admin: adminReducer
    }
})