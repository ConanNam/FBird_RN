
export const auth_urls = {
    get_code: "/auth/get_code",
    login :"/auth/login",
    refresh_token:'/auth/refresh_token'
}

export const user = {
  get_me:'/user/me'
}

export default {
    auth_urls,
    user
}
export const CONFIG = {
  //base url..
  API_DATA_MARKETPLACE: '/bird/bird_on_sale',
  API_DATA_MY_BIRD:'/bird/get_my_birds',
  API_ADD_WALLET: '/wallet/add_wallet',
  API_GET_WALLET: '/wallet/get_balance',
  API_GET_WALLET_CODE: '/wallet/get_code',
  API_UPDATE_CLAIM_BALANCE: '/wallet/update_claim_balance',
  API_OPEN_BOX:'/bird/open_bird_box',
  API_BUY_BIRD:'/bird/buy_bird',
  API_ADD_WALLET: '/wallet/add_wallet',
  API_SALE_BIRD: '/bird/sale_bird',
  API_DE_SALE_BIRD: '/bird/de_sale_bird',
  API_FILTER_PRICE: '/bird/bird_on_sale',
  API_GET_LEADER_BROAD: '/wallet/leaderbroad',
  API_OPEN_MY_BOX : '/birdbox/my_bird_box'
};
