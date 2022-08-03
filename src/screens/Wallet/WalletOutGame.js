import "@ethersproject/shims";
import React, { useEffect, useState, } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import "react-native-get-random-values";
import Modal from "react-native-modal";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { walletActions } from "../../redux/reducer/walletReducer";
import { shortenAddress } from "../../utils";
import WelcomeScreen from './Welcome';
import Clipboard from '@react-native-clipboard/clipboard';
import { showAlert, TYPE } from '../../components/Alert';
import { hideLoading, showLoading } from '../../components/Loading';

export default function WalletOutGame({ navigation }) {

    const walletInGame = useSelector(state => state.walletReducer.walletInGame)
    const account = useSelector(state => state.walletReducer.account)
    const user = useSelector(state => state.authReducers.user)

    const [checkWalletExist, setCheckWalletExist] = useState(false);
    const [address, setAddress] = useState("");
    const [visibleModal, setVisibleModal] = useState(false);
    const bnbBalanceReducer = useSelector(state => state.walletReducer.bnbBalance)
    const fbtBalanceReducer = useSelector(state => state.walletReducer.fbtBalance)
    const nftBalanceReducer = useSelector(state => state.walletReducer.nftBalance)
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            checkWallet()
            setRefreshing(false)
        } catch (error) {
            console.error(error);
        }
    }, [refreshing]);
    const copyToClipboard = () => {
        Clipboard.setString(address);
        showAlert(TYPE.SUCCESS, 'Copied!')
    };
    const dispatch = useDispatch();

    useEffect(() => {
        hideLoading()
        checkWallet()
    }, [account, bnbBalanceReducer, fbtBalanceReducer, nftBalanceReducer]);

    const checkWallet = async () => {
        dispatch(walletActions.getWallet())
        const check = walletInGame?.onChainWalletStatus === "ACTIVE" && account
        if (check) {
            setAddress(account.address);
            dispatch(walletActions.getBalanceOnChain())
        }
        setCheckWalletExist(check)
    }

    return (
        <>
            {
                !checkWalletExist ? <WelcomeScreen navigation={navigation} /> :
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        contentContainerStyle={styles.container}
                        showsVerticalScrollIndicator={false}>
                        <View
                            style={styles.containerChain}>
                            <View
                                style={styles.innerChain}>
                                <Text style={styles.textChain}>
                                    BNB Smart Chain (BEP20)
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.balance}>
                                    {bnbBalanceReducer} BNB
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => copyToClipboard()}
                                style={styles.containerAddress}>
                                <Text style={styles.textChain}>
                                    {shortenAddress(address)}
                                </Text>
                            </TouchableOpacity>
                            <View
                                style={styles.containerBtn}>
                                <View style={styles.containerCol}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Receive', { address })}
                                        style={styles.btnCol}>
                                        <Feather name="download" size={24} color="#f7d559" />
                                    </TouchableOpacity>
                                    <Text style={styles.textCol}>
                                        Receive
                                    </Text>
                                </View>
                                <View style={styles.containerCol}>
                                    <TouchableOpacity
                                        onPress={() => setVisibleModal(true)}
                                        style={styles.btnCol}>
                                        <Feather name="arrow-up-right" size={24} color="#f7d559" />
                                    </TouchableOpacity>
                                    <Text style={styles.textCol}>
                                        Send
                                    </Text>
                                </View>
                                <View style={styles.containerCol}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Trade')}
                                        style={styles.btnCol}>
                                        <Feather name="refresh-cw" size={24} color="#f7d559" />
                                    </TouchableOpacity>
                                    <Text style={styles.textCol}>
                                        Trade
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={styles.containerAdd}>
                            <View style={styles.innerAdd}>
                                <Text style={styles.textWallet}>
                                    Wallet Account
                                </Text>
                            </View>
                            <View
                                style={styles.containerToken}>
                                <View
                                    style={styles.containerRow}>
                                    <Text style={styles.textCommon}>
                                        FBT
                                    </Text>
                                    <Text style={styles.textCommon}>
                                        {fbtBalanceReducer}
                                    </Text>
                                </View>
                                <View
                                    style={styles.divide}
                                />
                                <View
                                    style={styles.containerRow}>
                                    <Text style={styles.textCommon}>
                                        BNB
                                    </Text>
                                    <Text style={styles.textCommon}>
                                        {bnbBalanceReducer}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={styles.containerToken}>
                                <View
                                    style={styles.containerRow}>
                                    <Text style={styles.textCommon}>
                                        Bird boxes
                                    </Text>
                                    <Text style={styles.textCommon}>
                                        {nftBalanceReducer}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('MintBox');
                                }}
                                style={styles.btnTransfer}>
                                <Text style={styles.textTransfer}>
                                    Mint Box
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('MyBoxes');
                                }}
                                style={styles.btnTransfer}>
                                <Text style={styles.textTransfer}>
                                    My Boxes
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ height: 50 }} />
                        <Modal isVisible={visibleModal} style={styles.modal} onPress={() => setVisibleModal(false)}>
                            <View style={styles.innerModal}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setVisibleModal(false)
                                        navigation.navigate('Send', { token: "BNB" })
                                    }}
                                    style={[styles.containerToken, { marginTop: 40 }]}>
                                    <View
                                        style={styles.containerRow}>
                                        <Text style={styles.textCommon}>
                                            BNB
                                        </Text>

                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setVisibleModal(false)
                                        navigation.navigate('Send', { token: "FBT" })
                                    }}
                                    style={styles.containerToken}>
                                    <View
                                        style={styles.containerRow}>
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
                    </ScrollView>
            }
        </>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    containerChain: {
        backgroundColor: '#fef9e6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerChain: {
        height: 30,
        paddingHorizontal: 12,
        backgroundColor: '#f7d559',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    textChain: { color: 'black', fontSize: 12 },
    balance: { color: 'black', fontSize: 16, fontWeight: 'bold' },
    containerAddress: {
        paddingHorizontal: 12,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    containerBtn: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        paddingBottom: 20,
    },
    containerCol: { alignItems: 'center', justifyContent: 'center' },
    btnCol: {
        backgroundColor: 'white',
        borderRadius: 25,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 20,
    },
    textCol: { color: 'black', fontWeight: '600', fontSize: 13 },
    containerAdd: {
        padding: 16,
        // backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
    },
    innerAdd: { marginTop: 10 },
    textWallet: { fontSize: 15, fontWeight: 'bold', color: 'black' },
    containerToken: {
        width: '100%',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,
        marginTop: 20,
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    textCommon: { fontSize: 12, fontWeight: 'bold', color: 'black' },
    divide: { height: 1, backgroundColor: 'black', width: '100%' },
    modal: {
        justifyContent: "flex-end", marginLeft: 0, marginRight: 0, backgroundColor: 'rgba(0,0,0,0.0001)', flex: 1
    },
    innerModal: {
        height: "30%", width: "100%", backgroundColor: "white", borderTopRightRadius: 20, borderTopLeftRadius: 20,
        padding: 16
    },
    closeIcon: { position: "absolute", top: 10, right: 20 },
    btnContainer: {
        flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16
    },
    btnTransfer: {
        height: 50,
        width: '40%',
        backgroundColor: '#f7d559',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 60
    },
    textTransfer: { color: 'black', fontWeight: '700', fontSize: 16 },
});