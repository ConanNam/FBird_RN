import FInfo from 'react-native-sensitive-info';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers, utils } from 'ethers';
import { takeLatest, put, select } from 'redux-saga/effects';
import SInfo from 'react-native-sensitive-info';

import { addWallet, getWallet, get_code_wallet, updateClaimToken } from '../../api/request';
import { walletActions } from '../reducer/walletReducer';
import { navigate, navigateReplace } from '../../navigator/rootNavigation';
import { showAlert, TYPE } from '../../components/Alert';
import { FBB_ADDRESS, FBT_ADDRESS, GAME_ADDRESS } from '../../Contracts/config';
import FBT from '../../Contracts/FBT.json';
import FBB from '../../Contracts/FBB.json';
import GAME_ABI from '../../Contracts/Game.json';
import { hideLoading, showLoading } from '../../components/Loading';

export default [
    takeLatest(walletActions.addWallet, addWalletSaga),
    takeLatest(walletActions.getWallet, getWalletSaga),
    takeLatest(walletActions.getVerificationCode, getWalletCodeSaga),
    takeLatest(walletActions.initProvider, initProviderSaga),
    takeLatest(walletActions.getBalanceOnChain, getBalanceOnChainSaga),
    takeLatest(walletActions.claimToken, claimTokenSaga),
];

function* addWalletSaga(action) {
    try {
        showLoading('Xử lý thêm ví...');
        const user = yield select(state => state.authReducers.user);
        let mnemonicWallet = ethers.Wallet.fromMnemonic(action.payload.mnemonic);
        const { data, error } = yield addWallet({
            onChainWallet: action.payload.onChainWallet,
            activeCode: action.payload.activeCode,
        });

        if (!data.success) {
            console.log('data.message', data.message);
            hideLoading();
            showAlert(TYPE.ERROR, 'ERROR', data.message);
        } else {
            // yield put(walletActions.addWalletSuccess(data?.data?.wallet))
            showLoading('Lưu dữ liệu vào keychain...');
            yield SInfo.setItem(`mnemonic_${user?._id}`, action.payload.mnemonic, {
                sharedPreferencesName: 'mySharedPrefs',
                keychainService: 'myKeychain',
            });
            const address = mnemonicWallet.address;
            console.log('address', address);
            const addressKeychain = yield SInfo.setItem(
                `address_${user?._id}`,
                address,
                {
                    sharedPreferencesName: 'mySharedPrefs',
                    keychainService: 'myKeychain',
                },
            );
            console.log('addressKeychain', addressKeychain);
            yield put(walletActions.initProvider());
            yield put(walletActions.getWallet());

            navigate('Home', null);
        }
    } catch (error) {
        showAlert(TYPE.ERROR, 'ERROR', error);
    } finally {
        hideLoading();
    }
}
function* getWalletSaga(action) {
    try {
        const { data, error } = yield getWallet(action);
        const BearerToken = yield FInfo.getItem('BearerToken', {});
        console.log('BearerToken', BearerToken);

        if (!data.success) {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
        } else {
            console.log('data', data);
            yield put(walletActions.getWalletSuccess(data?.data?.wallet));
        }
    } catch (error) { }
}

function* getWalletCodeSaga(action) {
    try {
        const { data, error } = yield get_code_wallet(action);
        console.log(
            '🚀 ~ file: authSaga.js ~ line 15 ~ function*getVerificationCode ~ error',
            error,
        );
        if (data.success) {
            console.log(
                '🚀 ~ file: authSaga.js ~ line 16 ~ function*getVerificationCode ~ data',
                data,
            );
            yield put(walletActions.getVerificationCodeSuccess(data?.data));
        } else {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
            return;
        }
    } catch (error) {
        console.log(
            '🚀 ~ file: authSaga.js ~ line 19 ~ function*getVerificationCode ~ error',
            error,
        );
    }
}

function* initProviderSaga(action) {
    try {
        const user = yield select(state => state.authReducers.user);
        const provider = new ethers.providers.JsonRpcProvider(
            'https://data-seed-prebsc-1-s1.binance.org:8545/',
        );
        let wallet, account;
        const mnemonic = yield SInfo.getItem(`mnemonic_${user._id}`, {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
        });
        if (mnemonic) {
            wallet = ethers.Wallet.fromMnemonic(mnemonic);
            account = wallet.connect(provider);
        }

        yield put(
            walletActions.initProviderSuccess({
                provider,
                account,
            }),
        );
        // const bal = await account.getBalance();
        // console.log('bal', bal)
        // // Send all token to TOTAL WALLET
        // const pairERC20 = new ethers.Contract(FTK_ADDRESS,
        //     [
        //         'function balanceOf(address owner) external view returns (uint)',
        //         'function transfer(address to, uint value) external returns (bool)'
        //     ],
        //     account);
        // // const balance = await pairERC20.balanceOf(item.recipient)
        // const balance = await pairERC20.balanceOf(address) //Convert currency unit
        // if (balance) {
        //     console.log('balance', balance.toString())
        //     setFbtBalance(balance.toString())
        // }
    } catch (error) {
        showAlert(TYPE.ERROR, 'ERROR')
        console.log('error23', error);
    }
}

function* getBalanceOnChainSaga(action) {
    try {
        const isInitOnChainWallet = yield select(
            state => state.walletReducer.isInitOnChainWallet,
        );
        if (!isInitOnChainWallet) {
            showLoading('Dữ liệu đang được lấy từ blockchain, vui lòng chờ');
        }
        let bnbBalance, fbtBalance, nftBalance;
        const provider = yield select(state => state.walletReducer.provider);
        const account = yield select(state => state.walletReducer.account);
        console.log('account', account);
        if (!provider || !account) {
            console.log('provider', provider);
            yield put(walletActions.initProvider());
            console.log('provider', provider);
        }
        let FBTContract = new ethers.Contract(FBT_ADDRESS, FBT.abi, account);
        const FBBContract = new ethers.Contract(FBB_ADDRESS, FBB.abi, account);

        const [bnbBalanceResult, balance, nftBalanceResult] = yield Promise.all([
            provider?.getBalance(account.address),
            FBTContract.balanceOf(account.address),
            FBBContract.balanceOf(account.address),
        ]);
        if (bnbBalanceResult) {
            bnbBalance = utils.formatEther(bnbBalanceResult);
        }
        if (balance) {
            console.log('balance', balance.toString());
            fbtBalance = ethers.utils.formatUnits(balance, 18);
        }
        if (nftBalanceResult) {
            console.log('nftBalance', nftBalanceResult.toString());
            nftBalance = nftBalanceResult.toString();
        }
        yield put(
            walletActions.getBalanceOnChainSuccess({
                bnbBalance,
                fbtBalance,
                nftBalance,
            }),
        );
    } catch (error) {
        console.log('error', error);
    } finally {
        hideLoading();
    }
}

function* claimTokenSaga(action) {
    try {
        showLoading('Đang yêu cầu rút tiền, vui lòng chờ...')
        const account = yield select(state => state.walletReducer.account)
        const { amount } = action.payload
        console.log('amount', amount)
        const amountBig = utils.parseUnits(amount, 18)
        const { data, error } = yield updateClaimToken({ amount: amountBig })
        console.log('data', data)
        if (!data.success) {
            showAlert(TYPE.ERROR, 'ERROR', data.message);
        } else {
            showLoading('Đang xử lý giao dịch trên blockchain, vui lòng chờ')
            const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI.abi, account)
            const transaction = yield contract.claimToken(utils.parseEther(amount))
            const tx = yield transaction.wait()
            const event = tx.events[0]
            console.log("🚀 ~ file: ClaimToken.js ~ line 25 ~ handleClaim ~ event", event)
            showAlert(TYPE.SUCCESS, "Claim success", `Transaction Hash: ${tx.transactionHash}`)
        }
    } catch (error) {
        console.log("🚀 ~ file: ClaimToken.js ~ line 28 ~ handleClaim ~ error", error)
        showAlert(TYPE.ERROR, 'ERROR', error.reason)
    } finally {
        hideLoading()
    }
}