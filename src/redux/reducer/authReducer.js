import { createSlice } from '@reduxjs/toolkit'

const initialState = {

    verificationCode: {
        success: false,
        data: null,
        message: "",
        code: null
    },
    user: null

}


const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        getVerificationCode: (state, { params }) => { },
        getVerificationCodeSuccess: (state, { payload }) => {
            console.log("🚀 ~ file: authReducer.js ~ line 41 ~ payload get code", payload)
            state.verificationCode = payload
        },
        init: (state, { params }) => { },
        login: (state, { params }) => { },
        loginSuccess: (state, { payload }) => {
            // console.log("🚀 ~ file: authReducer.js ~ line 45 ~ payload login", payload)
            // state.authnLogin = payload
            state.user = payload.user
        },
        checkLogined: (state, { params }) => { }
    }
})

export const authActions = authSlice.actions
export const authReducers = authSlice.reducer