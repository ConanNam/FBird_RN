import '@ethersproject/shims';
import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import 'react-native-get-random-values';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../components/Loading';
import FBB from '../../Contracts/FBB.json';
import MyBox from './components/MyBox';
import { FBB_ADDRESS, TOTAL_WALLET } from '../../Contracts/config';
import { walletActions } from '../../redux/reducer/walletReducer';

const numColumns = 2;
const WIDTH = Dimensions.get('screen').width;

export default function MyBoxes({ navigation }) {
    const account = useSelector(state => state.walletReducer.account);
    const [nfts, setNfts] = useState([]);
    const formatData = (datas, numColumns) => {
        const totalRows = Math.floor(datas.length / numColumns);
        let totalLastRow = datas.length - totalRows * numColumns;
        while (totalLastRow !== 0 && totalLastRow !== numColumns) {
            datas.push({ key: 'blank', empty: true });
            totalLastRow++;
        }
        return datas;
    };
    const loadListBox = async () => {
        try {
            showLoading('Xin chờ, đang lấy danh sách NFT của bạn từ blockchain');
            const fbbContract = new ethers.Contract(FBB_ADDRESS, FBB.abi, account);
            const owner = account.getAddress();
            const nftBalance = await fbbContract.balanceOf(owner);

            let items = [];
            if(nftBalance.toString() > 0) {
                for (let i = 0; i < nftBalance.toString(); i++) {
                    const tokenId = await fbbContract.tokenOfOwnerByIndex(owner, i);
                    const tokenUri = await fbbContract.tokenURI(tokenId);
                    console.log("🚀 ~ file: MyBoxes.js ~ line 50 ~ loadListBox ~ tokenUri", tokenUri)
                    const meta = await axios.get(tokenUri);
                    let item = {
                        tokenId: tokenId.toString(),
                        name: meta.data.name,
                        boxType: meta.data.boxType,
                        image: meta.data.image,
                    };
                    items.push(item);
                }
                console.log('items', items);
            }
            setNfts(items);
            hideLoading();
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        loadListBox();
    }, []);
    const transferNFT = async (item) => {
        try {
            console.log("Transfer");
            showLoading('Giao dịch đang được xử lý trên blockchain, vui lòng chờ')
            const FBBContract = new ethers.Contract(FBB_ADDRESS, FBB.abi, account)
            const transaction = await FBBContract["safeTransferFrom(address,address,uint256)"](account.address, TOTAL_WALLET, parseInt(item.tokenId))
            let tx = await transaction.wait()
            console.log('tx.transactionHash', tx.transactionHash)
            removeItem(item.tokenId)
            hideLoading()
            showAlert(TYPE.SUCCESS, 'Thành công', `Chuyển BirdBox vào game thành công, giao dịch sẽ được xử lý trong 1 đên 2 phút. Transaction hash: ${tx.transactionHash}`)
            // setTimeout(() => { loadListBox() }, 2000)m
            dispatch(walletActions.getBalanceOnChain())
        } catch (error) {

        } finally {
            hideLoading()
        }
    }
    const removeItem = (tokenId) => {
        const newNfts = nfts.filter(item => item.tokenId !== tokenId)
        setNfts(newNfts)
    }
    const renderItem = ({ item, index }) => {
        if (item.empty) {
            return <View style={[styles.itemStyle, styles.itemInvisible]}></View>;
        }
        return <MyBox item={item} transferNFT={transferNFT} />;
    };
    return (
        <SafeAreaView style={styles.container}>
            {nfts.length <= 0 ? (
                <>
                    <View style={styles.containerText}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.btnBack}>
                            <Feather name="chevron-left" size={24} color="black" />
                        </TouchableOpacity>

                        <Text style={styles.textTransfer}>MY BOXES</Text>
                    </View>
                    <Text style={styles.empty}>You have no box. Go to mint box.</Text>
                </>
            ) : (
                <>
                    <View style={styles.containerText}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.btnBack}>
                            <Feather name="chevron-left" size={24} color="black" />
                        </TouchableOpacity>

                        <Text style={styles.textTransfer}>MY BOXES</Text>
                    </View>

                    <FlatList
                        data={formatData(nfts, numColumns)}
                        keyExtractor={(item, index) => item?.tokenId}
                        numColumns={numColumns}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text style={styles.empty}>You have no box. Go to mint box.</Text>
                        }
                    />
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        // justifyContent: 'center',
    },
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
        marginLeft: 16,
    },
    itemInvisible: {
        width: (0.9 * WIDTH - 32) / 2,
    },
    itemStyle: {
        backgroundColor: 'transparent',
        flex: 1,
        margin: 8,
        borderRadius: 16,
        justifyContent: 'center',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
});
