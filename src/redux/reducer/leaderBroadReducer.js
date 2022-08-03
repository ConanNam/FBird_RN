import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    dataLeaderBroad: [],
}


const leaderBroadSlice = createSlice({
    name: 'leaderBoard',
    initialState,
    reducers: {
        getDataLeaderBoards: (state, {payload})=>{
            console.log('222332', 222332)
        },
        getDataLeaderBoardSuccess: (state, {payload})=>{
            state.dataLeaderBroad = payload
        },
    }
})

export const leaderBroadActions = leaderBroadSlice.actions
export const leaderBroadReducer = leaderBroadSlice.reducer