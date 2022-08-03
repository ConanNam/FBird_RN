import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    verificationCode: {
        success: false,
        data: null,
        message: "",
        code: null
    },
    walletInGame: {},
    wallet: null,
    provider: null,
    account: null,
    bnbBalance: null,
    fbtBalance: null,
    nftBalance: null,
    isInitOnChainWallet: false,
}


const walletSlice = createSlice({
    name: 'walletSlice',
    initialState,
    reducers: {
        addWallet: (state, { payload }) => { },
        addWalletSuccess: (state, { payload }) => {
            console.log('payload', payload)
            state.walletInGame = payload
        },
        getWallet: (state, { payload }) => { },
        getWalletSuccess: (state, { payload }) => {
            console.log('payload', payload)
            state.walletInGame = payload
        },
        getVerificationCode: (state, { params }) => { },
        getVerificationCodeSuccess: (state, { payload }) => {
            console.log("🚀 ~ file: authReducer.js ~ line 41 ~ payload", payload)
            state.verificationCode = payload
        },
        initProvider: (state, { payload }) => {
            state.isInitOnChainWallet = false
        },
        initProviderSuccess: (state, { payload }) => {
            console.log('payload.provider', payload.provider)
            state.provider = payload.provider
            state.account = payload.account
        },
        getBalanceOnChain: (state, { payload }) => {

        },
        getBalanceOnChainSuccess: (state, { payload }) => {
            state.bnbBalance = payload.bnbBalance
            state.fbtBalance = payload.fbtBalance
            state.nftBalance = payload.nftBalance
            state.isInitOnChainWallet = true
        },
        claimToken: (state, { payload }) => { }
    }
})

export const walletActions = walletSlice.actions
export const walletReducer = walletSlice.reducer