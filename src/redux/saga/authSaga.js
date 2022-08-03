import { takeLatest, put, select } from 'redux-saga/effects'
import FAxios from '../../api/FAxios';
import { get_code, get_me, login, refresh_token } from '../../api/request';
import { navigate, navigateReplace } from '../../navigator/rootNavigation';
import { authActions } from '../reducer/authReducer'
import FInfo from 'react-native-sensitive-info'
import { SCREEN } from '../../constants/screen';
import { showAlert, TYPE } from '../../components/Alert';
import { hideLoading, showLoading } from '../../components/Loading';
import { walletActions } from '../reducer/walletReducer';
export default [
    takeLatest(authActions.getVerificationCode, getVerificationCode),
    takeLatest(authActions.login, loginWithCode),
    takeLatest(authActions.init, initSaga),
]

function* initSaga(action) {
    try {
        const bear = yield FInfo.getItem('BearerToken', {})
        const refreshToken = yield FInfo.getItem('RefreshToken', {})
        if (bear) {
            try {
                FAxios.defaults.headers.common['Authorization'] = bear
                let getMeResponse = yield get_me()
                console.log('getMeResponse.data.code', getMeResponse)
                if (getMeResponse.data.code == 401) {
                    const { data, error } = yield refresh_token({ refreshToken })
                    if (data && data.success) {
                        const BearerToken = `Bearer ${data.data.token}`;
                        const RefreshToken = data.data.refreshToken
                        FAxios.defaults.headers.common['Authorization'] = BearerToken;
                        FInfo.setItem('BearerToken', BearerToken, {});
                        FInfo.setItem('RefreshToken', RefreshToken, {})
                        getMeResponse = yield get_me()
                    }
                }
                if (!getMeResponse.data.success) {
                    showAlert(TYPE.ERROR, 'ERROR', getMeResponse.data.message)
                } else
                    yield put(authActions.loginSuccess({
                        user: getMeResponse.data.data.user
                    }))
                showAlert(TYPE.SUCCESS, 'Welcome back!')
                navigateReplace('Home', null)
                yield put(walletActions.initProvider())
                yield put(walletActions.getWallet())
            } catch (error) {
                showAlert(TYPE.ERROR, 'ERROR')
            }
            finally {
                hideLoading()
            }
        } else {
            navigateReplace('Login')
        }
    } catch (error) {
        console.log('error', error)
    }
}

function* getVerificationCode(action) {
    console.log('action', action)
    try {
        const { data, error } = yield get_code(action);
        console.log("🚀 ~ file: authSaga.js ~ line 15 ~ function*getVerificationCode ~ error", error)
        if (data) {
            console.log("🚀 ~ file: authSaga.js ~ line 16 ~ function*getVerificationCode ~ data", data)
            yield put(authActions.getVerificationCodeSuccess(data))
        } else {
            showAlert(TYPE.ERROR, 'ERROR')
        }

    } catch (error) {
        console.log("🚀 ~ file: authSaga.js ~ line 19 ~ function*getVerificationCode ~ error", error)
        showAlert(TYPE.ERROR, 'ERROR')
    }
}

function* loginWithCode(action) {
    try {
        const { data, error } = yield login(action)
        console.log("🚀 ~ file: authSaga.js ~ line 30 ~ function*loginWithCode ~ data", data)
        if (data && data.success) {
            const BearerToken = `Bearer ${data.data.token}`;
            const RefreshToken = data.data.refreshToken
            console.log("🚀 ~ file: authSaga.js ~ line 32 ~ function*loginWithCode ~ BearerToken", BearerToken)
            FAxios.defaults.headers.common['Authorization'] = BearerToken;
            FInfo.setItem('BearerToken', BearerToken, {});
            FInfo.setItem('RefreshToken', RefreshToken, {})
            yield put(authActions.loginSuccess(data.data))
            showAlert(TYPE.SUCCESS, 'Success', 'Đăng nhập thành công!')
            navigateReplace('Home', null)
        } else {
            showAlert(TYPE.ERROR, 'Thông báo', data.message)
        }
    } catch (error) {
        console.log("🚀 ~ file: authSaga.js ~ line 34 ~ function*loginWithCode ~ error", error)
        showAlert(TYPE.ERROR, 'ERROR')
    }
}