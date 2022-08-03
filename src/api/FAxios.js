import axios from 'axios';
import FInfo from 'react-native-sensitive-info';


const appConfigs = {
    dev: {
        baseURL: 'http://192.168.4.244:8001/v1/api',
        socketURL: 'ws://192.168.4.244:8001',
        evn: 'staging',
        fbbAddress: '0x37717a1B1154397f603a67c5A2ca6B5F4a4CF106'
    },
    prod: {
        baseURL: 'https://blockchain-fbird.dev.ftech.ai/v1/api',
        socketURL: 'wss://blockchain-fbird.dev.ftech.ai',
        evn: 'production',
        fbbAddress: '0x37717a1B1154397f603a67c5A2ca6B5F4a4CF106'
    },
    home:{
        baseURL: 'http://192.168.0.109:8001/v1/api',
        socketURL: 'ws://192.168.0.109:8001',
        evn: 'staging',
        fbbAddress: '0x37717a1B1154397f603a67c5A2ca6B5F4a4CF106'
    }
}


export const appConfig = appConfigs.home

const FAxios = axios.create({
    baseURL: appConfig.baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});


// FAxios.interceptors.request.use(
//     async function (config) {
//         console.log('config', config)
//         if (store.getState().authReducers.authnLogin.success) {
//             const BearerToken = await FInfo.getItem('BearerToken', {});
//             config.headers.common['Authorization'] = BearerToken;
//         }
//         config.baseURL = urls.BASE_URL
//         console.log('config', config)
//         return config;
//     },
//     function (error) {
//         return Promise.reject(error);
//     }
// );


// Add a response interceptor
FAxios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if ((error?.response?.data?.detail ?? '') === 'USER_BLOCKED') {
        FInfo.deleteItem('BearerToken', {}).then(() => {

        })
        return Promise.reject(Error('USER_BLOCKED'));
    }
    if (is401Error(error)) {
        // token expired
        FInfo.deleteItem('BearerToken', {}).then(() => {

        })
    }
    return Promise.reject(error);
});

export const is401Error = (error) => {
    return error && error.response && error.response.status && error.response.status === 401;
}


export default FAxios;
