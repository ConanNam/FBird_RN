import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    dataMarket: [],
    myBird: [],
    openBird: {},
    isOpen: false,
    isBuySuccess: false,
    myBirdOnSale: [],
    myBirdBox: [],
    isLoadingDataMarket: false,
    dataMarketPaginate: {}
}


const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        getDataMarket: (state, { payload }) => {
            state.isLoadingDataMarket = true
        },
        getFilterDataMarket: (state, { payload }) => { },
        getFilterDataMarketByStar: (state, { payload }) => { },
        getDataMarketByStar: (state, { payload }) => { },
        getDataMarketSuccess: (state, { payload }) => {
            state.isLoadingDataMarket = false
            state.dataMarket = payload.birds
            state.dataMarketPaginate = payload.paginate
        },
        getDataMyBird: (state, { payload }) => { },
        getMyBird: (state, { payload }) => { },
        getDataMyBirdSuccess: (state, { payload }) => {
            state.myBird = payload
            state.isOpen = false
        },
        getDataMyBirdOnSaleSuccess: (state, { payload }) => {
            state.myBirdOnSale = payload
            state.isOpen = false
        },
        requestOpenBox: (state, { payload }) => {
            console.log('payload', payload)
            state.openBird = {}
            state.isOpen = false
        },
        requestOpenBoxSuccess: (state, { payload }) => {
            state.openBird = payload
            state.isOpen = true
        },
        requestGetMyBirdBox: (state, { payload }) => {
        },
        requestGetMyBirdBoxSuccess: (state, { payload }) => {
            state.myBirdBox = payload
        },
        requestByBird: (state, { payload }) => {
            state.isBuySuccess = false
        },
        requestByBirdSuccess: (state, { payload }) => {
            state.isBuySuccess = true
        },
        requestSaleBird: (state, { payload }) => {
        },

        requestSaleBirdSuccess: (state, { payload }) => {
        },
        requestDeSaleBird: (state, { payload }) => {
        },
    }
})

export const marketActions = marketSlice.actions
export const marketReducer = marketSlice.reducer