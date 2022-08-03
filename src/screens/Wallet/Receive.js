import React from 'react';
import {
    SafeAreaView,
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Feather from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import { shortenAddress } from "../../utils";
import { showAlert, TYPE } from '../../components/Alert';

export default function Receive({ navigation, route }) {
    const address = route.params.address
    const copyToClipboard = () => {
        Clipboard.setString(address);
        showAlert(TYPE.SUCCESS, 'Copied!')
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.btnBack}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.textReceive}>
                    RECEIVE
                </Text>
            </View>
            <View
                style={styles.chain}>
                <Text style={styles.textChain}>
                    BNB Smart Chain (BEP20)
                </Text>
            </View>
            {address.length > 0 &&
                <QRCode
                    size={200}
                    color="#fff"
                    backgroundColor="#0A0F24"
                    value={address}
                />}
            <View>
                <Text style={styles.textScan}>
                    Scan address to receive payment
                </Text>
            </View>
            <View
                style={styles.addressContainer}>
                <Text style={styles.textAddress}>
                    {shortenAddress(address)}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.btnCopy} onPress={() => copyToClipboard()}>
                <Text style={styles.textCopy}>
                    COPY ADDRESS
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 16,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    textReceive: { color: 'black', fontWeight: 'bold', fontSize: 18, marginLeft: -15, width: '100%', textAlign: 'center' },
    chain: {
        height: 30,
        paddingHorizontal: 12,
        backgroundColor: '#f7d559',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        marginTop: 60
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    textChain: {
        color: 'black',
        fontSize: 12
    },
    textScan: {
        color: 'black',
        fontSize: 12
    },
    addressContainer: {
        paddingHorizontal: 12,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    textAddress: {
        color: 'black',
        fontSize: 12
    },
    btnCopy: {
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
    textCopy: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16
    }
});
