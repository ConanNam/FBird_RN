import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';

import Box from './components/Box'
import Feather from 'react-native-vector-icons/Feather';
import FBT from '../../Contracts/FBT.json'
import FBB from '../../Contracts/FBB.json'
import { FBB_ADDRESS, FBT_ADDRESS } from '../../Contracts/config';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers, utils } from 'ethers';
import { showAlert, TYPE } from '../../components/Alert';
import { hideLoading, showLoading } from '../../components/Loading';
import { walletActions } from '../../redux/reducer/walletReducer';


export default function MintBox({ navigation }) {

  const dispatch = useDispatch()

  const account = useSelector(state => state.walletReducer.account)
  const fbtBalance = useSelector(state => state.walletReducer.fbtBalance)

  const [btnTitle, setBtnTitle] = useState('Buy')
  const [allowance, setAllowance] = useState(0.0)

  const checkAllowance = async () => {
    setBtnTitle('Loading...')
    let FBTContract = new ethers.Contract(FBT_ADDRESS, FBT.abi, account)
    const ownerAddress = account.address
    let allowance = await FBTContract.allowance(ownerAddress, FBB_ADDRESS)
    numberAllowance = ethers.utils.formatEther(allowance)
    if (allowance == 0.0)
      setBtnTitle('Approve')
    else
      setBtnTitle('Buy')
    setAllowance(numberAllowance)
  }

  useEffect(() => {
    checkAllowance()
  }, [])

  const mintBox = async (boxType) => {
    try {
      showLoading('Xin chờ, yêu cầu đang được xử lý trên blockchain')
      let FBTContract = new ethers.Contract(FBT_ADDRESS, FBT.abi, account)
      if (allowance == 0.0) {
        const amount = ethers.utils.parseUnits('10000000000', 'ether')
        setBtnTitle('Approve...')
        let approve = await FBTContract.approve(FBB_ADDRESS, amount)
        if (approve){
          setBtnTitle('Buy')
          setAllowance('10000000000')
        }
      } else {
        let fbtAmount = fbtBalance * 1
        const checkBalance = (boxType == 1 && fbtAmount >= 1000)
          || (boxType == 2 && fbtAmount >= 2000)
          || (boxType == 3 && fbtAmount >= 5000)
        if (!checkBalance) {
          showAlert(TYPE.ERROR, 'Không đủ số dư', 'Số dư FBT của bạn không đủ để thực hiện hành động này, vui lòng nạp thêm')
          return
        }
        let contract = new ethers.Contract(FBB_ADDRESS, FBB.abi, account)
        let transaction = await contract.mintBirdBox(boxType)
        let tx = await transaction.wait()
        showAlert(TYPE.SUCCESS, 'Thành công', `Mint box thành công, Transaction Hash: ${tx.transactionHash}`)
        dispatch(walletActions.getBalanceOnChain())
      }
      setTimeout(() => { }, 2000)
    } catch (error) {
      console.log('error', error)
      showAlert(TYPE.ERROR, 'Mint box failed!', error)
    } finally {
      hideLoading()
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.containerText}>
        <TouchableOpacity
          hitSlop={{ left: 20, top: 20, bottom: 20, right: 20 }}
          onPress={() => navigation.goBack()}
          style={styles.btnBack}>
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.textTransfer}>
          MINT BOX
        </Text>
      </View>
      <View style={styles.viewBox}>
        <Box
          type="COMMON"
          price={1000}
          image={require('../../assets/images/box_1.png')}
          boxType={1}
          mintBox={() => mintBox(1)}
          navigation={navigation}
          btnTitle={btnTitle}
        />
        <Box
          type="COSMETIC"
          price={2000}
          image={require('../../assets/images/box_2.png')}
          boxType={2}
          mintBox={() => mintBox(2)}
          navigation={navigation}
          btnTitle={btnTitle}
        />
        <Box
          type="LEGENDARY"
          price={5000}
          image={require('../../assets/images/box_3.png')}
          navigation={navigation}
          boxType={3}
          mintBox={() => mintBox(3)}
          btnTitle={btnTitle}
        />
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  containerText: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    flexDirection: 'row',
    width: '100%',
  },
  textTransfer: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
    marginLeft: -15
  },
  viewBox: {
    // flexDirection: 'row',
    // marginTop: 32,
    marginHorizontal: 8,
  },
  btnBack: {
    // position: 'absolute',
    // top: 20,
    // left: 20,
    marginLeft: 12,
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
