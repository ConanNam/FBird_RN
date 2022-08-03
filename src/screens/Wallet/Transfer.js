import "@ethersproject/shims";
import { ethers, utils } from 'ethers';
import React, { useState } from 'react';
import {
    Image, SafeAreaView, StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native';
import "react-native-get-random-values";
import Modal from "react-native-modal";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert, TYPE } from '../../components/Alert';
import { hideLoading, showLoading } from '../../components/Loading';
import { FBT_ADDRESS, TOTAL_WALLET } from '../../Contracts/config';
import FBT from '../../Contracts/FBT.json';
import { walletActions } from '../../redux/reducer/walletReducer';


export default function Transfer({ navigation }) {

    const dispatch = useDispatch()

    const wallet = useSelector(state => state.walletReducer.wallet)
    const account = useSelector(state => state.walletReducer.account)
    const fbtBalance = useSelector(state => state.walletReducer.fbtBalance)
    const bnbBalance = useSelector(state => state.walletReducer.bnbBalance)

    const [visibleModal, setVisibleModal] = useState(false);
    const [asset, setAsset] = useState("BNB");
    const [from, setFrom] = useState("Wallet");
    const [to, setTo] = useState("Spending");
    const [amount, setAmount] = useState("0")
    const confirmTransfer = async () => {
        // transfer from BNB to token FBT (call ether(swap))
    }

    const exchange = () => {
        // if (from === "Spending") {
        //     setFrom("Wallet")
        //     setTo("Spending")
        // } else {
        //     setFrom("Spending")
        //     setTo("Wallet")
        // }
    }

    const tranferFBT = async () => {
        try {
            const overMoney = parseInt(amount) > (asset == 'BNB' ? bnbBalance : fbtBalance)
            console.log('overMoney', overMoney)
            if (overMoney)
                showAlert(TYPE.ERROR, 'Số dư không đủ', 'Số dư của bạn không đủ để thực hiện hành động này')
            else
                if (asset == 'BNB') {
                    showAlert(TYPE.INFO, 'Thông báo', 'Hệ thống đang tạm ngưng giao dịch này')
                } else {
                    showLoading('Giao dịch đang được xử lý, vui lòng chờ')
                    const FBTContract = new ethers.Contract(FBT_ADDRESS, FBT.abi, account)
                    const transfer = await FBTContract.transfer(TOTAL_WALLET, utils.parseUnits(amount, 18))
                    console.log('transfer', transfer)
                    dispatch(walletActions.getWallet())
                    dispatch(walletActions.getBalanceOnChain())
                    showAlert(TYPE.SUCCESS, 'Thành công', `Chuyển tiền vào ví thành công, giao dịch sẽ được xử lý trong 1 đên 2 phút. Transaction Hash: ${transfer.hash}`)
                }
        } catch (error) {

        } finally {
            // dispatch(walletActions.getBalanceOnChain())
            hideLoading()
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={styles.containerText}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.btnBack}>
                        <Feather name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.textTransfer}>
                        TRANSFER
                    </Text>
                </View>

                <View
                    style={styles.containerTransfer}>
                    <View
                        style={styles.containerRow}>
                        <Text
                            style={styles.textFrom}>
                            From
                        </Text>
                        <Text style={styles.textSpend}>
                            {from}
                        </Text>
                    </View>
                    <View style={styles.divide} />
                    <View
                        style={styles.containerRow}>
                        <Text
                            style={styles.textFrom}>
                            To
                        </Text>
                        <Text style={styles.textSpend}>
                            {to}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => { exchange() }}
                        style={styles.containerExchange}>
                        <Image
                            style={styles.iconExchange}
                            source={require('../../assets/images/exchange.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.assetContainer}>
                <Text style={styles.title}>Asset</Text>
                <TouchableOpacity
                    onPress={() => setVisibleModal(true)}
                    style={styles.containerAmount}>
                    <View
                        style={styles.assetInner}>
                        <Text
                            style={styles.assetText}>
                            {asset}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.assetContainer}>
                <Text style={styles.title}>Amount</Text>
                <View
                    style={styles.containerAmount}>
                    <View style={styles.amountInput}>
                        <TextInput
                            style={styles.textInput}
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <TouchableOpacity
                            onPress={() => setAmount(asset == 'BNB' ? bnbBalance : fbtBalance)}>
                            <Text style={styles.textSend}>Max</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.available}>
                    Available: {asset == 'BNB' ? bnbBalance : fbtBalance} {asset}
                </Text>
            </View>
            <TouchableOpacity
                onPress={tranferFBT}
                style={styles.btnConfirm}>
                <Text style={styles.textConfirm}>
                    CONFIRM TRANSFER
                </Text>
            </TouchableOpacity>

            <Modal isVisible={visibleModal} style={styles.modal} onPress={() => setVisibleModal(false)}>
                <View style={styles.innerModal}>
                    <TouchableOpacity
                        onPress={() => {
                            setVisibleModal(false)
                            setAsset("BNB")
                        }}
                        style={[styles.containerAmount, { marginVertical: 40 }]}>
                        <View
                            style={styles.assetInner}>
                            <Text style={styles.textCommon}>
                                BNB
                            </Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setVisibleModal(false)
                            setAsset("FBT")
                        }}
                        style={styles.containerAmount}>
                        <View
                            style={styles.assetInner}>
                            <Text style={styles.textCommon}>
                                FBT
                            </Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeIcon} onPress={() => setVisibleModal(false)}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    containerText: {
        backgroundColor: '#fef9e6',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    textTransfer: { color: 'black', fontWeight: 'bold', fontSize: 18 },
    containerTransfer: {
        width: '100%',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,
        marginTop: 30,
        backgroundColor: 'white',
    },
    containerRow: { flexDirection: 'row', alignItems: 'center', padding: 24 },
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
    amountInput: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, },
    textInput: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
        flex: 1,
        paddingVertical: 12
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
        marginVertical: 20,
    },
    textConfirm: { color: 'black', fontWeight: '700', fontSize: 16 },
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
    modal: {
        justifyContent: "flex-end", marginLeft: 0, marginRight: 0, backgroundColor: 'rgba(0,0,0,0.0001)', flex: 1
    },
    innerModal: {
        height: "30%", width: "100%", backgroundColor: "white", borderTopRightRadius: 20, borderTopLeftRadius: 20,
        padding: 16
    },
    closeIcon: { position: "absolute", top: 10, right: 20 },
    textCommon: { fontSize: 12, fontWeight: 'bold', color: 'black' },
    containerExchange: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#f3f1f4',
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        alignSelf: 'center',
    },
    iconExchange: { height: 16, width: 16 },
    textSend: {
        color: '#f7b749',
        fontWeight: 'bold',
        fontSize: 16,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    textTransfer: { color: 'black', fontWeight: 'bold', fontSize: 18, marginLeft: -15, width: '100%', textAlign: 'center'},
    
});
