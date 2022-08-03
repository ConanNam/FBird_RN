import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import leaderBroadSaga from './leaderBroadSaga';
import marketSaga from './marketSagas';
import walletSaga from './walletSaga';


export default function* rootSaga() {
    yield all([
    /** 01 */ ...authSaga,
    /** 02 */...marketSaga,
    ...walletSaga,
        ... leaderBroadSaga
    ]);
}
