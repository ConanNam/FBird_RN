import { combineReducers } from 'redux';
import { authReducers } from '../reducer/authReducer'
import { marketReducer } from './marketReducers';
import { walletReducer } from './walletReducer';
import { leaderBroadReducer } from './leaderBroadReducer';

const allReducers = combineReducers({
    authReducers,
    marketReducer,
    walletReducer,
    leaderBroadReducer
});
export default allReducers;
