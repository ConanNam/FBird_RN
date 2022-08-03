import { takeLatest, put } from 'redux-saga/effects'
import {requireGetLeaderBroad} from '../../api/request';

import {Alert} from 'react-native'
import { leaderBroadActions } from '../reducer/leaderBroadReducer';
import { showAlert, TYPE } from '../../components/Alert';



export default [
    takeLatest(leaderBroadActions.getDataLeaderBoards, getDataLeaders),
]

function* getDataLeaders() {
    try {
        const {data, error} = yield requireGetLeaderBroad();
        console.log("🚀 ~ file: leaderBroadSaga.js ~ line 17 ~ function*getDataLeaders ~ data", data)
        if(!data.success){
            showAlert(TYPE.ERROR,'ERROR',data.message)
            return
        }
       yield put(leaderBroadActions.getDataLeaderBoardSuccess(data?.data.wallets))
    } catch (error) {
      
    }
}
