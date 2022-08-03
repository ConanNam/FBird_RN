import { takeLatest, put, select } from 'redux-saga/effects';
import {
    getDataMarketPlace,
    requireGetBirdByStar,
    requireGetMyBirdBox,
    postBuyBird,
    postOpenBox,
    postSaleBird,
    requireGetMyBird,
    requireGetMyBirdOnSale,
    postDeSaleBird,
    requireGetMyBirdByPrice,
    requireGetMyBirdByStar,
} from '../../api/request';
import { marketActions } from '../reducer/marketReducers';
import { Alert } from 'react-native';
import { navigate } from '../../navigator/rootNavigation';
import { showAlert, TYPE } from '../../components/Alert';
import { hideLoading, showLoading } from '../../components/Loading';

export default [
    takeLatest(marketActions.getDataMarket, getDataMarket),
    takeLatest(marketActions.getDataMyBird, getDataMyBird),
    takeLatest(marketActions.getMyBird, getMyBird),
    takeLatest(marketActions.requestOpenBox, openBox),
    takeLatest(marketActions.requestByBird, buyBird),
    takeLatest(marketActions.requestSaleBird, saleBird),
    takeLatest(marketActions.requestDeSaleBird, deSaleBird),
    // takeLatest(marketActions.getFilterDataMarket, getFilterDataMarket),
    // takeLatest(
    //     marketActions.getFilterDataMarketByStar,
    //     getFilterDataMarketByStar,
    // ),
    // takeLatest(marketActions.getDataMarketByStar, getDataMarketByStar),
    takeLatest(marketActions.requestGetMyBirdBox, getDataMyOpenBox),
];

function* getDataMarket(action) {
    try {
        const { data, error } = yield getDataMarketPlace(action.payload);
        console.log('getDataMarket', data)
        if (!data.success) {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
            return;
        }
        yield put(marketActions.getDataMarketSuccess({ birds: data?.data?.birds, paginate: data?.data?.paginate }));
    } catch (error) { }
}

// function* getDataMarketByStar(action) {
//     try {
//         const { data, error } = yield requireGetBirdByStar(action);
//         if (!data.success) {
//             showAlert(TYPE.ERROR, 'ERROR', data.message);
//             return;
//         }
//         yield put(marketActions.getDataMarketSuccess(data?.data?.birds));
//     } catch (error) { }
// }

// function* getFilterDataMarket(action) {
//     try {
//         const { data, error } = yield requireGetMyBirdByPrice(action);
//         if (!data.success) {
//             showAlert(TYPE.ERROR, 'ERROR', data.message);
//             return;
//         }
//         yield put(marketActions.getDataMarketSuccess(data?.data?.birds));
//     } catch (error) { }
// }

// function* getFilterDataMarketByStar(action) {
//     try {
//         const { data, error } = yield requireGetMyBirdByStar(action);
//         if (!data.success) {
//             showAlert(TYPE.ERROR, 'ERROR', data.message);
//             return;
//         }
//         yield put(marketActions.getDataMarketSuccess(data?.data?.birds));
//     } catch (error) { }
// }

function* getDataMyBird(action) {
    console.log(
        '🚀 ~ file: marketSagas.js ~ line 27 ~ function*getDataMyBird ~ action',
        action,
    );
    try {
        const { data, error } = yield requireGetMyBird();
        console.log('getDataMyBird', data);
        const dataOnSale = yield requireGetMyBirdOnSale();
        console.log('dataOnSale', dataOnSale);
        if (!data.success || !dataOnSale.data) {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
            return;
        }
        yield put(marketActions.getDataMyBirdSuccess(data?.data?.birds));
        yield put(
            marketActions.getDataMyBirdOnSaleSuccess(dataOnSale.data?.data?.birds),
        );
    } catch (error) { }
}
function* getMyBird(action) {
    try {
        showLoading('Đang tải dữ liệu, xin chờ')
        const { data, error } = yield requireGetMyBird();
        if (!data.success) {
            showAlert(TYPE.ERROR, 'ERROR', data.message)
            return
        }
        yield put(marketActions.getDataMyBirdSuccess(data?.data?.birds))
    } catch (error) {

    } finally {
        hideLoading()
    }
}

function* getDataMyOpenBox() {
    try {
        const { data, error } = yield requireGetMyBirdBox();
        if (!data.success) {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
            return;
        }
        yield put(marketActions.requestGetMyBirdBoxSuccess(data?.data?.birdBoxs));
    } catch (error) { }
}

function* openBox(action) {
    try {
        const { data, error } = yield postOpenBox(action.payload);
        if (!data.success) {
            console.log('error', error);
            showAlert(TYPE.ERROR, 'Thông báo', data.message);
        } else yield put(marketActions.requestOpenBoxSuccess(data?.data?.bird));
    } catch (error) { }
}

function* buyBird(action) {
    console.log('action123', action);
    try {
        const { data, error } = yield postBuyBird(action);
        if (!data.success) {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
            return;
        }
        showAlert(TYPE.SUCCESS, 'Thông báo', data.message);
        yield put(marketActions.requestByBirdSuccess());
    } catch (error) { }
}

function* saleBird(action) {
    console.log('action123', action);
    try {
        const { data, error } = yield postSaleBird(action);
        if (!data.success) {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
            return;
        }
        yield put(marketActions.getDataMarket());
        navigate('Marketplace');
    } catch (error) { }
}

function* deSaleBird(action) {
    console.log('action123', action);
    try {
        const { data, error } = yield postDeSaleBird(action);
        if (!data.success) {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
            return;
        }
        navigate('Gallery');
    } catch (error) { }
}
