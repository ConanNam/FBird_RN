import React from 'react';
import {
    SafeAreaView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';


export default function Welcome({ navigation }) {
    const dispatch = useDispatch();
    const createWallet = async () => {
        // const account = await web3.eth.accounts.create();
        // dispatch(walletActions.getWallet())
        
        navigation.navigate('CreateNewWallet')

    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textTitle}>
                BSC WALLET
            </Text>
            <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => {
                    createWallet();
                }}>
                <View style={styles.card}>
                    <View style={styles.textContainer}>
                        <Text
                            style={styles.textBtn}>
                            {' '}
                            Create a new wallet.{' '}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => {
                    navigation.navigate('ImportWallet')
                }}>
                <View style={[styles.card, { backgroundColor: '#f7d559' }]}>
                    <View style={styles.textContainer}>
                        <Text
                            style={styles.textBtn}>
                            {' '}
                            Import a wallet using Seed Phrase{' '}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    card: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        maxHeight: 100,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 40,
        width: '90%',
    },
    textTitle: { color: 'black', fontWeight: '600', fontSize: 18 },
    btnContainer: { width: '100%', marginTop: 20 },
    textContainer: { paddingVertical: 20 },
    textBtn: {
        color: 'black',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '600',
    },

});
