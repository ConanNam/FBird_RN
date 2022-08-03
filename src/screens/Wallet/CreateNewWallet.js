import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {randomBytes} from 'react-native-randombytes';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';

import {hideLoading, showLoading} from '../../components/Loading';
import {walletActions} from '../../redux/reducer/walletReducer';
import Clipboard from '@react-native-clipboard/clipboard';
import {showAlert, TYPE} from '../../components/Alert';

export default function CreateNewWallet({navigation}) {
  const [code, setCode] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [phrase, setPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(state => state.authReducers.user);
  console.log(
    '🚀 ~ file: CreateNewWallet.js ~ line 23 ~ CreateNewWallet ~ user',
    user,
  );
  const [awaitTimeSend, setAwaitTimeSend] = useState(0);
  const dispatch = useDispatch();
  let email = useSelector(state => state.authReducers.user.email);
  const copyToClipboard = () => {
    Clipboard.setString(phrase);
    showAlert(TYPE.SUCCESS, 'Copied!');
  };
  const getMnemonic = async () => {
    try {
      if (phrase.length <= 0) {
        randomBytes(16, (err, bytes) => {
            console.log('bytes', bytes)
          const mnemonic = ethers.utils.entropyToMnemonic(bytes);
          setPhrase(mnemonic);
        });
        // setIsLoading(false)
      }
    } catch (error) {
      console.log('error', error);
    } finally {
    }
  };
  // useEffect(() => {
  //     if(isLoading) showLoading('Load');
  //     else hideLoading();
  // }, [])
  useEffect(() => {
    getMnemonic();
  }, []);
  const sendCode = async () => {
    if (awaitTimeSend == 0) {
      setAwaitTimeSend(60);
      dispatch(walletActions.getVerificationCode({email: user.email}));
    }
  };
  useEffect(() => {
    if (awaitTimeSend > 0)
      setTimeout(() => {
        setAwaitTimeSend(awaitTimeSend - 1);
      }, 1000);
  }, [awaitTimeSend]);

  const importWallet = async () => {
    showLoading('Xử lý thêm wallet');
    try {
      await setTimeout(() => {
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
      }, 100);
    } catch (error) {
      hideLoading();
      showAlert(TYPE.ERROR, 'Thông báo', error.message);
    } finally {
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.containerText}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.btnBack}>
              <Feather name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.textTransfer}>CREATE WALLET</Text>
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
              <TouchableOpacity onPress={() => sendCode()}>
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
            <TouchableOpacity
              onLongPress={copyToClipboard}
              style={styles.phraseContainer}>
              <Text style={[styles.textInput, {}]} numberOfLines={3}>
                {phrase.length > 0 ? phrase : 'Loading...'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.innerContainer}>
            <View>
              <Text style={styles.title}>Enter Seed Phrase Again</Text>
            </View>
            <View style={styles.seedContainer}>
              <TextInput
                style={styles.seedInput}
                placeholder="Enter the Seed Phrase word and separate with space"
                multiline={true}
                value={mnemonic}
                onChangeText={setMnemonic}
              />
            </View>
          </View>
          <TouchableOpacity
            disabled={phrase === mnemonic ? false : true}
            onPress={() => {
              importWallet();
            }}
            style={[
              styles.btnConfirm,
              {
                backgroundColor:
                  phrase.length > 0 && phrase !== mnemonic
                    ? '#fef9e6'
                    : '#f7d559',
              },
            ]}>
            <Text
              style={[
                styles.textConfirm,
                {color: phrase === mnemonic ? 'black' : 'gray'},
              ]}>
              CREATE WALLET
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  containerText: {
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  textTransfer: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: -15,
    width: '100%',
    textAlign: 'center',
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
    // backgroundColor: 'red',
    paddingBottom: 160,
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
    lineHeight: 20,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  textSend: {
    color: '#f7b749',
    fontWeight: 'bold',
    fontSize: 12,
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
    // height: 200,
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
  textConfirm: {color: 'black', fontWeight: '700', fontSize: 16},
});
