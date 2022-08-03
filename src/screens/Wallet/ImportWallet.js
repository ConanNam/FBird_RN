import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';

import { showAlert, TYPE } from '../../components/Alert';
import { hideLoading, showLoading } from '../../components/Loading';
import { walletActions } from '../../redux/reducer/walletReducer';

export default function ImportWallet({ navigation }) {
  const [code, setCode] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [awaitTimeSend, setAwaitTimeSend] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  let user = useSelector(state => state.authReducers.user);

  const sendCode = async () => {
    if (awaitTimeSend == 0) {
      setAwaitTimeSend(60);
      dispatch(walletActions.getVerificationCode({ email: user.email }));
    }
  };

  useEffect(() => {
    if (awaitTimeSend > 0)
      setTimeout(() => {
        setAwaitTimeSend(awaitTimeSend - 1);
      }, 1000);
  }, [awaitTimeSend]);

  const delay = (delayInms) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }


  const importWallet = async () => {
    showLoading('Xử lý thêm wallet');
    try {
      let delayres = await delay(100);
      let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
      const address = mnemonicWallet.address;
      if (address) {
        dispatch(
          walletActions.addWallet({
            onChainWallet: address,
            activeCode: code,
            mnemonic: mnemonic,
          }),
        );
      }
    } catch (error) {
      hideLoading();
      showAlert(TYPE.ERROR, 'Thông báo', error.message);
    } finally {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.containerText}>
              <TouchableOpacity
                hitSlop={60}
                onPress={() => navigation.goBack()}
                style={styles.btnBack}>
                <Feather name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.textTransfer}>IMPORT WALLET</Text>
            </View>
            <View style={styles.innerContainer}>
              <View>
                <Text style={styles.title}>Email Verification code</Text>
              </View>
              <View style={styles.codeContainer}>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={code}
                  onChangeText={setCode}
                />
                <TouchableOpacity onPress={() => sendCode()} activeOpacity={1}>
                  <Text style={styles.textSend}>
                    {awaitTimeSend > 0 ? awaitTimeSend : 'Send code'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.innerContainer}>
              <View>
                <Text style={styles.title}>Seed Phrase</Text>
              </View>
              <View style={styles.seedContainer}>
                <TextInput
                  style={styles.seedInput}
                  placeholder="Enter the Seed Phrase word and separate with space"
                  multiline={true}
                  value={mnemonic}
                  onChangeText={setMnemonic}
                  placeholderTextColor='gray'
                />
              </View>
            </View>
            <TouchableOpacity onPress={importWallet} style={styles.btnConfirm}>
              {isLoading && (
                <ActivityIndicator color="black" style={{ marginRight: 16 }} />
              )}
              <Text style={styles.textConfirm}>IMPORT WALLET</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  containerText: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row',
  },
  textTransfer: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
    marginLeft: -15,
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
    height: 200,
    color: 'black'
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
  },
  textSend: {
    color: '#f7b749',
    fontWeight: 'bold',
    fontSize: 12,
  },
  seedContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: 'black',
    marginTop: 20,
    paddingHorizontal: 12,
  },
  btnConfirm: {
    marginTop: 100,
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
    flexDirection: 'row',
  },
  textConfirm: { color: 'black', fontWeight: '700', fontSize: 16 },
});
