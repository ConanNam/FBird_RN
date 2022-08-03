import { ethers, utils } from 'ethers';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { GAME_ADDRESS } from '../../Contracts/config';
import GAME_ABI from '../../Contracts/Game.json';
import { showAlert, TYPE } from '../../components/Alert';
import { hideLoading, showLoading } from '../../components/Loading';
import { walletActions } from '../../redux/reducer/walletReducer';


const ClaimToken = ({ navigation }) => {

    const dispatch = useDispatch()

    const wallet = useSelector(state => state.walletReducer.walletInGame)
    const account = useSelector(state => state.walletReducer.account)
    const [amount, setAmount] = useState('0')
    const maxAmount = utils.formatEther(wallet.fbtBalance ?? '0')

    const handleClaim = async () => {
        dispatch(walletActions.claimToken({ amount }))
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerText}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.btnBack}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.textTransfer}>CLAIM TOKEN</Text>
            </View>
            <View style={styles.innerContainer}>
                <View>
                    <Text style={styles.title}>Enter your amount to claim</Text>
                </View>
                <View style={styles.codeContainer}>
                    <TextInput
                        style={styles.textInput}
                        keyboardType="numeric"
                        value={amount}
                        defaultValue={'0'}
                        onChangeText={setAmount}
                    />
                    <TouchableOpacity
                        onPress={() => setAmount(maxAmount)}>
                        <Text style={styles.textSend}>Max</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 14, marginTop: 3, alignSelf: 'flex-end' }}>{`${amount}/${maxAmount} FBT`}</Text>
                <TouchableOpacity
                    style={styles.btnClaim}
                    onPress={handleClaim}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Claim</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default ClaimToken

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
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
    innerContainer: {
        padding: 16,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    seedInput: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    codeContainer: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: 'black',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    textInput: {
        flex: 1,
        color: 'black',
        lineHeight: 20,
        fontStyle: 'italic',
        fontWeight: '600',
    },
    textSend: {
        color: '#f7b749',
        fontWeight: 'bold',
        fontSize: 18,
    },
    phraseContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: 'black',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    seedContainer: {
        height: 200,
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: 'black',
        marginTop: 20,
        paddingHorizontal: 12,
    },
    btnConfirm: {
        marginTop: 50,
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
    btnClaim: {
        alignSelf: 'center',
        marginTop: 30,
        backgroundColor: '#f7d559',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10
    }

});
