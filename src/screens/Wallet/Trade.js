import { ethers, utils } from 'ethers';
import React, { useEffect, useState, useRef } from 'react';
import {
    Image,
    ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity, View, SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { debounce } from 'lodash';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { WBNB_ADDRESS, FBT_ADDRESS, PAIR, ROUTE } from '../../Contracts/config'
import { showAlert, TYPE } from '../../components/Alert'
import { walletActions } from '../../redux/reducer/walletReducer';
import FBT from '../../Contracts/FBT.json'

Number.prototype.format = function (num, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (num > 0 ? '\\D' : '$') + ')',
        number = this.toFixed(Math.max(0, ~~num));

    return (c ? number.replace('.', c) : number).replace(
        new RegExp(re, 'g'),
        '$&' + (s || ','),
    );
};

const swapToken = async (account, amountIn, amountOutMin, contract, from) => {
    console.log("🚀 ~ file: Trade.js ~ line 28 ~ swapToken ~ from", from)
    try {

        if (from === 'BNB') {
            const tx = await contract.swapExactETHForTokens(
                // amountIn,
                amountOutMin,
                [WBNB_ADDRESS, FBT_ADDRESS],
                account.address,
                Date.now() + 1000 * 60 * 10, //10 minutes
                {
                    'value': amountIn,
                    'gasLimit': '500000',
                    'gasPrice': ethers.utils.parseUnits(`12`, 'gwei')
                }
            );

            const receipt = await tx.wait();
            showAlert(TYPE.SUCCESS, 'Success', `Success... Transaction`)
        } else {
            let FBTContract = new ethers.Contract(FBT_ADDRESS, FBT.abi, account)
            const amount = ethers.utils.parseUnits('10000000000', 'ether')
            let approve = await FBTContract.approve(ROUTE, amount)
            const tx = await contract.swapExactTokensForETH(
                amountIn,
                amountOutMin,
                [FBT_ADDRESS, WBNB_ADDRESS],
                account.address,
                Date.now() + 1000 * 60 * 10, //10 minutes
                {
                    'gasLimit': '500000',
                    'gasPrice': ethers.utils.parseUnits(`12`, 'gwei')
                }
            );

            const receipt = await tx.wait();
            showAlert(TYPE.SUCCESS, 'Success', `Success... Transaction`)


        }

    } catch (error) {
        console.log("🚀 ~ file: Trade.js ~ line 50 ~ swapToken ~ error", error)
        showAlert(TYPE.ERROR, 'ERROR', error.reason)
    }
}

const getAmountsOut = async (tokenIn, tokenOut, amountIn, contract) => {
    const tx = await contract.getAmountsOut(
        amountIn,
        [tokenIn, tokenOut],
        //   {
        //     'gasLimit': data.gasLimit,
        //     'gasPrice': ethers.utils.parseUnits(`${data.gasPrice}`, 'gwei')
        //   }
    );
    return tx
}


export default function Trade({ navigation }) {
    const account = useSelector(state => state.walletReducer.account)
    const bnbBalance = useSelector(state => state.walletReducer.bnbBalance)
    const fbtBalance = useSelector(state => state.walletReducer.fbtBalance)
    const [amountIn, setAmountIn] = useState('0.002')
    const [amountOut, setAmountOut] = useState('0')
    const [from, setFrom] = useState("BNB");
    const [to, setTo] = useState("FBT");
    const contractSwap = useRef({})
    const contractPair = useRef({})
    const [showLoading, setShowLoading] = useState(false)
    const dispatch = useDispatch()
    const [bnbInPool, setBnbInPool] = useState('0')
    console.log("🚀 ~ file: Trade.js ~ line 99 ~ Trade ~ bnbInPool", bnbInPool)
    const [fbtInPool, setFbtInPool] = useState('0')
    console.log("🚀 ~ file: Trade.js ~ line 101 ~ Trade ~ fbtInPool", fbtInPool)
    const [slippage, setSlippage] = useState('10')

    useEffect(() => {
        const router = new ethers.Contract(
            ROUTE,
            [
                'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
                'function getAmountsOut(uint amountIn, address[] memory path) internal view returns (uint[] memory amounts)',
                'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',

            ],
            account
        );

        contractSwap.current = router

        const pair = new ethers.Contract(
            PAIR,
            ['function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'],
            account
        )

        contractPair.current = pair

        pair.getReserves().then(rs => {
            setBnbInPool(utils.formatEther(rs[0]))
            setFbtInPool(utils.formatEther(rs[1]))
        })


    }, [account])

    const trade = async () => {
        setShowLoading(true)
        await swapToken(account, utils.parseEther(amountIn), utils.parseEther(caculateAmountMin()), contractSwap.current, from)
        setShowLoading(false)
        dispatch(walletActions.getBalanceOnChain())

    }
    const exchange = () => {
        if (from === "BNB") {
            setFrom("FBT")
            setTo("BNB")

        } else {
            setFrom("BNB")
            setTo("FBT")
        }
        setAmountIn(amountOut)
    }
    const getBalance = (from) => {
        if (from === "BNB") return Number(bnbBalance).format(4, 3)
        else return Number(fbtBalance).format(2, 3)
    }

    const getAmountCanTrade = async () => {
        if (from === 'BNB') {
            console.log('amountIn', amountIn)
            return await getAmountsOut(WBNB_ADDRESS, FBT_ADDRESS, utils.parseEther(amountIn), contractSwap.current)
        } else {
            console.log('amountIn', amountIn)
            return await getAmountsOut(FBT_ADDRESS, WBNB_ADDRESS, utils.parseEther(amountIn), contractSwap.current)
        }
    }

    const caculateAmountMin = () => {
        return (parseFloat(amountOut) * (1 - parseFloat(slippage) / 100)).toString()
    }

    const caculatePriceImpact = () => {
        const amoutOut = parseFloat(amountOut)
        const fbtPool = parseFloat(fbtInPool)
        const bnbPool = parseFloat(bnbInPool)
        if(from === 'BNB'){
            let price_impact = amoutOut / (amoutOut + fbtPool)
            console.log("🚀 ~ file: Trade.js ~ line 176 ~ caculatePriceImpact ~ price_impact", price_impact)
            return (price_impact * 100).toString()
        }else{
            let price_impact = amoutOut / (amoutOut + bnbPool)
            return (price_impact * 100).toString()
        }
    }

    useEffect(() => {
        if (amountIn > 0) {
            setShowLoading(true)
            getAmountCanTrade().then(rs => {
                console.log("🚀 ~ file: Trade.js ~ line 103 ~ useEffect ~ rs", utils.formatEther(rs[1]))
                setAmountOut(utils.formatEther(rs[1]))
                setShowLoading(false)
            })
        }

    }, [amountIn])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View
                    style={styles.containerText}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.btnBack}>
                        <Feather name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.textTransfer}>
                        TRADE
                    </Text>
                </View>
                <View style={styles.containerToken}>
                    <View
                        style={styles.containerBorder}>
                        <View
                            style={styles.containerRow}>
                            <Text style={styles.textInner}>From</Text>
                            <Text style={styles.textInner}>Balance: {getBalance(from)}</Text>
                        </View>
                        <View
                            style={styles.containerRow}>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.textBalance}
                                placeholder="0.00"
                                value={amountIn}
                                onChangeText={setAmountIn}
                            />
                            <Text
                                style={styles.textToken}>
                                {from}
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={exchange}
                    style={styles.containerExchange}>
                    <Image
                        style={styles.iconExchange}
                        source={require('../../assets/images/exchange.png')}
                    />
                </TouchableOpacity>
                <View style={styles.containerToken}>
                    <View
                        style={styles.containerBorder}>
                        <View
                            style={styles.containerRow}>
                            <Text style={styles.textInner}>To (Estimate)</Text>
                        </View>
                        <View
                            style={styles.containerRow}>
                            <Text style={styles.textBalance}>{Number(amountOut).format(4, 3)}</Text>
                            <Text
                                style={styles.textToken}>
                                {to}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 12 }}>Slippage Tolerance</Text>
                    <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, borderColor: 'black', padding: 10, justifyContent:'center', alignItems:'center' }}>
                        <TextInput
                            placeholder='10'
                            defaultValue='10'
                            value={slippage}
                            onChangeText={setSlippage}
                            keyboardType='numeric'
                            style={{ fontWeight: 'bold', color:'black', padding:0 }}
                        />
                        <Text style={{ fontWeight: 'bold' }}> %</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 12 }}>Minimum received</Text>
                    <Text style={{ fontWeight: 'bold', padding: 10 }}>{Number(caculateAmountMin()).format(4, 3)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 12 }}>Price Impact</Text>
                    <Text style={{ fontWeight: 'bold', padding: 10 }}>{Number(caculatePriceImpact()).format(2, 3)} %</Text>
                </View>
                {showLoading && <ActivityIndicator collapsable={true} size='large' color='#f7d559' />}
                <TouchableOpacity
                    onPress={() => trade()}
                    style={styles.btnTrade}>
                    <Text style={styles.textTrade}>
                        TRADE
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

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
    textTrade: { color: 'black', fontWeight: 'bold', fontSize: 18 },
    containerToken: { padding: 16 },
    containerBorder: {
        width: '100%',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: 'white',
    },
    containerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        justifyContent: 'space-between',
    },
    textInner: { fontSize: 12, width: 100 },
    textBalance: { fontSize: 12, width: 100, fontWeight: '600', color: 'black' },
    textToken: {
        fontSize: 16,
        width: 100,
        fontWeight: 'bold',
        color: 'black',
    },
    containerExchange: {
        backgroundColor: '#f3f1f4',
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        alignSelf: 'center',
    },
    iconExchange: { height: 16, width: 16 },
    btnTrade: {
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
    },
});
