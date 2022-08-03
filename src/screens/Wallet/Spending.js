import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking, Alert
} from 'react-native';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { walletActions } from '../../redux/reducer/walletReducer';
import { showAlert, TYPE } from '../../components/Alert';
import { utils } from 'ethers';
import { SCREEN } from '../../constants/screen';
import { ScrollView } from 'react-native-gesture-handler';

export default function Spending({ navigation }) {
    const wallet = useSelector(state => state.walletReducer.wallet);
    const walletInGame = useSelector(state => state.walletReducer.walletInGame);
    const account = useSelector(state => state.walletReducer.account);
    const url = 'https://testnet.binance.org/faucet-smart'
    const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url]);
    const dispatch = useDispatch();
    useEffect(() => {
        // if(wallet) {
        //     dispatch(walletActions.getBalanceOnChain())
        // }
        dispatch(walletActions.getWallet());
    }, []);

    const onGoTransfer = () => {
        if (!account)
            showAlert(
                TYPE.ERROR,
                'Thông báo',
                'Bạn chứ thêm ví Wallet, vui lòng thêm trước khi chuyển FBT Token',
            );
        else navigation.navigate('Transfer');
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.containerSpend}>
                <Text style={styles.textSpend}>Spending Account</Text>
            </View>
            <View style={styles.innerContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.textLabel}>FBT</Text>
                    <Text style={styles.textLabel}>
                        {walletInGame?.fbtBalance
                            ? utils.formatUnits(walletInGame?.fbtBalance, 18)
                            : 0}
                    </Text>
                </View>
                <View style={styles.divide} />
                <View style={styles.rowContainer}>
                    <Text style={styles.textLabel}>BNB</Text>
                    <Text style={styles.textLabel}>
                        {walletInGame?.bnbBalance
                            ? utils.formatEther(walletInGame?.bnbBalance)
                            : 0}
                    </Text>
                </View>
            </View>
            <View style={styles.containerPower}>
                <Text style={styles.textPower}>Powered by BNB Smart Chain</Text>
            </View>
            <TouchableOpacity onPress={onGoTransfer} style={styles.btnTransfer}>
                <Text style={styles.textTransfer}>TRANSFER</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { handlePress() }} style={styles.btnClaim}>
                <Text style={styles.textTransfer}>FAUCET BNB</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(SCREEN.ClaimToken);
                }}
                style={styles.btnClaim}>
                <Text style={styles.textTransfer}>CLAIM TOKEN</Text>
            </TouchableOpacity>
            <View style={{height:100,width:'100%'}}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    containerSpend: {
        marginTop: 40,
    },
    textSpend: { fontSize: 13, fontWeight: 'bold', color: 'black' },
    innerContainer: {
        width: '95%',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,
        marginTop: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    textLabel: { fontSize: 12, fontWeight: 'bold', color: 'black' },
    divide: { height: 1, backgroundColor: 'black', width: '100%' },
    containerPower: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    textPower: { fontSize: 13, fontWeight: '600', color: 'black' },
    btnTransfer: {
        marginTop: 140,
        height: 50,
        width: '80%',
        backgroundColor: '#f7d559',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnClaim: {
        marginTop: 20,
        height: 50,
        width: '80%',
        backgroundColor: '#f7d559',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textTransfer: { color: 'black', fontWeight: '700', fontSize: 16 },
});
