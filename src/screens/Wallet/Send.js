import { ethers, utils } from 'ethers';
import React, { useState, useEffect } from 'react';
import {
    ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity, View,
    SafeAreaView, Platform
} from 'react-native';
import SInfo from "react-native-sensitive-info";
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { showAlert, TYPE } from '../../components/Alert';
import { hideLoading, showLoading } from '../../components/Loading';
import { FBT_ADDRESS, TOTAL_WALLET } from '../../Contracts/config';
import FBT from '../../Contracts/FBT.json';
import { walletActions } from '../../redux/reducer/walletReducer';

export default function Send({ navigation, route }) {
    const wallet = useSelector(state => state.walletReducer.wallet)
    const bnbBalance = useSelector(state => state.walletReducer.bnbBalance)
    const fbtBalance = useSelector(state => state.walletReducer.fbtBalance)

    const user = useSelector(state => state.authReducers.user)
    const account = useSelector(state => state.walletReducer.account)

    // const [token, setToken] = useState("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
    const token = route.params.token
    const [amount, setAmount] = useState("");
    const [addressTo, setAddressTo] = useState("");
    const [overMoney, setOverMoney] = useState(true);
    const provider = useSelector(state => state.walletReducer.provider)
    const getBalance = (token) => {
        if (token === "BNB") return bnbBalance
        else return fbtBalance
    }
    useEffect(() => {
        if (parseFloat(amount)) {
            setOverMoney(parseFloat(amount) > (getBalance(token)))
        }
        else setOverMoney(true)
    }, [amount]);

    const confirmSend = async () => {
        if (token == "BNB") confirmSendBNB();
        else confirmSendFBT()
    }
    const confirmSendBNB = async () => {
        try {
            // console.log('overMoney', overMoney)
            if (overMoney)
                showAlert(TYPE.ERROR, 'Số dư không đủ', 'Số dư của bạn không đủ để thực hiện hành động này')
            else {
                showLoading('Giao dịch đang được xử lý, vui lòng chờ')
                let tx = {
                    to: addressTo,
                    value: ethers.utils.parseEther(amount)
                }
                // Send a transaction
                const transfer = await account.sendTransaction(tx)
                console.log('transfer', transfer)
                // dispatch(walletActions.getWallet())

                showAlert(TYPE.SUCCESS, 'Thành công', `Chuyển tiền vào ví thành công, giao dịch sẽ được xử lý trong 1 đên 2 phút. Transaction Hash: ${transfer.hash}`)
                dispatch(walletActions.getBalanceOnChain())
            }
        } catch (error) {
            console.log('error', error.message)
            showAlert(TYPE.ERROR, 'Thất bại', error.message)
        } finally {
            // dispatch(walletActions.getBalanceOnChain())
            hideLoading()
        }

    }
    const confirmSendFBT = async () => {
        try {
            if (overMoney)
                showAlert(TYPE.ERROR, 'Số dư không đủ', 'Số dư của bạn không đủ để thực hiện hành động này')
            else {
                showLoading('Giao dịch đang được xử lý, vui lòng chờ')
                const FBTContract = new ethers.Contract(FBT_ADDRESS, FBT.abi, account)
                const transfer = await FBTContract.transfer(addressTo, utils.parseUnits(amount, 18))
                console.log('transfer', transfer)
                // dispatch(walletActions.getWallet())
                showAlert(TYPE.SUCCESS, 'Thành công', `Chuyển tiền vào ví thành công, giao dịch sẽ được xử lý trong 1 đên 2 phút. Transaction Hash: ${transfer.hash}`)
                dispatch(walletActions.getBalanceOnChain())
            }
        } catch (error) {
            showAlert(TYPE.SUCCESS, 'Thành công', `Chuyển tiền vào ví thành công, giao dịch sẽ được xử lý trong 1 đên 2 phút. Transaction Hash: ${transfer.hash}`)
        } finally {
            // dispatch(walletActions.getBalanceOnChain())
            hideLoading()
        }
    }

    const padding = Platform.OS == 'ios' ? { paddingVertical: 8 } : {}

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <View
                    style={styles.containerText}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.btnBack}>
                        <Feather name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.textTransfer}>
                        SEND TO
                    </Text>
                    <View
                        style={styles.containerImage}>
                        <Text>image</Text>
                    </View>
                </View>
                <View style={styles.assetContainer}>
                    <Text style={styles.title}>To Address</Text>
                    <View
                        style={styles.containerAmount}>
                        <View style={styles.amountInput}>
                            <TextInput
                                numberOfLines={1}
                                value={addressTo}
                                onChangeText={setAddressTo}
                                style={[styles.textInput, padding]}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.assetContainer}>
                    <Text style={styles.title}>Amount</Text>
                    <View
                        style={styles.containerAmount}>
                        <View style={styles.amountInput}>
                            <TextInput
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                style={[styles.textInput, padding]}
                            />
                        </View>
                    </View>
                    <Text style={styles.available}>
                        Available: {getBalance(token)} {token}
                    </Text>
                </View>
                <TouchableOpacity
                    disabled={addressTo.length > 0 || !overMoney ? false : true}
                    onPress={() => { confirmSend() }}
                    style={[styles.btnConfirm, { backgroundColor: addressTo.length <= 0 || overMoney ? '#fef9e6' : '#f7d559' }]}>
                    <Text style={styles.textConfirm}>
                        CONFIRM
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    containerImage: {
        width: '100%',
        marginTop: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerRow: { flexDirection: 'row', alignItems: 'center', padding: 30 },
    textFrom: {
        fontSize: 12,
        color: 'black',
        marginRight: 30,
        width: 100,
    },
    textSpend: { fontSize: 12, fontWeight: 'bold', color: 'black' },
    divide: { height: 1, backgroundColor: 'black', width: '100%' },
    assetContainer: { padding: 16 },
    title: { fontSize: 12, marginRight: 30, width: 100 },
    assetInner: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    assetText: {
        fontSize: 14,
        color: 'black',
        marginRight: 30,
        width: 100,
        fontWeight: 'bold',
    },
    containerAmount: {
        width: '100%',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: 'white',
    },
    amountInput: { flexDirection: 'row', alignItems: 'center' },
    textInput: {
        fontSize: 14,
        color: 'black',
        fontWeight: '600',
        flex: 1,
        marginLeft: 12,
    },
    available: { fontSize: 12, marginRight: 30 },
    btnConfirm: {
        alignSelf: 'center',
        height: 50,
        width: '80%',
        backgroundColor: '#f7d559',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    textConfirm: { color: 'black', fontWeight: '700', fontSize: 16 },
    containerText: {
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    textTransfer: { color: 'black', fontWeight: 'bold', fontSize: 18, marginLeft: -15, width: '100%', textAlign: 'center' },
    btnBack: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7d559',
    },
});
