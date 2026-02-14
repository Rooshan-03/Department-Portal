import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({

    name: 'admin',

    initialState: {
        registerAdmin: null,
        adminData: null,
        error: null,
        loading: false
    },

    reducers: {
        setData: (state, action) => {
            state.adminData = action.payload
            state.error = null
            state.loading = false
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearRecord: (state) => {
            state.error = null
            state.loading = false
        },
        setAdmin: (state, action) => {
            state.adminData = action.payload
            state.error = null
            state.loading = false
        },
    }
})

export const { setData, setLoading, setError, clearRecord, setAdmin } = adminSlice.actions;
export default adminSlice.reducer