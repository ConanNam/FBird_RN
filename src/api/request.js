
import FAxios, { appConfig } from "./FAxios"
import { CONFIG, auth_urls, user } from "./urls"


// const processResponse = (promise) => {
//     return promise.then(response => ({ error: null, data: response.data?.data ?? response.data })).catch(error => ({ error, data: error?.response?.data?.data ?? error?.response?.data ?? error?.response ?? error }))
// }

const processResponse = (promise) => {
    return promise.then(response => ({ error: null, data: response?.data })).catch(error => ({ error, data: error?.response?.data }))
}

export const getDataMarketPlace = async (params) => {
    return processResponse(FAxios.get(`${CONFIG.API_DATA_MARKETPLACE}${buildGetParams(params)}`))
}

export const requireGetMyBird = async (params) => {
    console.log('params', params)
    return processResponse(FAxios.get(`${CONFIG.API_DATA_MY_BIRD}?on_sale=false`))
}

export const requireGetMyBirdByPrice = async (params) => {
    console.log('params', params)
    return processResponse(FAxios.get(`${CONFIG.API_FILTER_PRICE}?is_low_to_high=${params.payload}`))
}

export const requireGetMyBirdByStar = async (params) => {
    console.log('params', params)
    return processResponse(FAxios.get(`${CONFIG.API_FILTER_PRICE}?is_low_to_high=${params.payload.isLow}&from_star=${params.payload.from}&to_star=${params.payload.to}`))
}

export const requireGetBirdByStar = async (params) => {
    console.log('params', params)
    return processResponse(FAxios.get(`${CONFIG.API_FILTER_PRICE}?from_star=${params.payload.from}&to_star=${params.payload.to}`))
}

export const requireGetMyBirdOnSale = async (params) => {
    console.log('params', params)
    return processResponse(FAxios.get(`${CONFIG.API_DATA_MY_BIRD}?on_sale=true`))
}

export const requireGetLeaderBroad = async (params) => {
    console.log('params12222', params)
    return processResponse(FAxios.get(`${CONFIG.API_GET_LEADER_BROAD}`))
}

export const postOpenBox = async (params) => {
    console.log('params', params)
    return processResponse(FAxios.post(`${CONFIG.API_OPEN_BOX}`, params))
}

export const requireGetMyBirdBox = async (params) => {
    console.log('params12222', params)
    return processResponse(FAxios.get(`${CONFIG.API_OPEN_MY_BOX}`))
}



export const postBuyBird = async (params) => {
    console.log('params', params.payload)
    return processResponse(FAxios.post(`${CONFIG.API_BUY_BIRD}`, { bird: params.payload }))
}

export const postSaleBird = async (params) => {
    console.log('params', params.payload)
    return processResponse(FAxios.post(`${CONFIG.API_SALE_BIRD}`, params.payload))
}

export const postDeSaleBird = async (params) => {
    console.log('params', params.payload)
    return processResponse(FAxios.post(`${CONFIG.API_DE_SALE_BIRD}`, params.payload))
}


export const buildGetParams = (params) => {
    if (!params || params.length === 0) {
        return '';
    }
    return `?${Object.entries(params).map(x => (`${x[0]}=${x[1]}`)).join('&')}`
}



// auth

export const get_code = (params) => {
    console.log("🚀 ~ file: request.js ~ line 18 ~ params", params.payload)
    return processResponse(FAxios.post(`${auth_urls.get_code}`, params.payload))
}

export const login = (params) => {
    return processResponse(FAxios.post(`${auth_urls.login}`, params.payload))
}

export const addWallet = async (params) => {
    console.log('params add wallet', params)
    return processResponse(FAxios.post(`${CONFIG.API_ADD_WALLET}`, params))
}

export const get_me = (params) => {
    return processResponse(FAxios.get(`${user.get_me}`))
}

export const refresh_token = (params) => {
    return processResponse(FAxios.post(`${auth_urls.refresh_token}`, params.payload))
}

export const getWallet = async (params) => {
    return processResponse(FAxios.get(`${CONFIG.API_GET_WALLET}`))
}

export const get_code_wallet = (params) => {
    console.log("🚀 ~ file: request.js ~ line 18 ~ params", params.payload)
    return processResponse(FAxios.get(`${CONFIG.API_GET_WALLET_CODE}`))
}

export const updateClaimToken = async (params) => {
    return processResponse(FAxios.post(`${CONFIG.API_UPDATE_CLAIM_BALANCE}`, params))
}