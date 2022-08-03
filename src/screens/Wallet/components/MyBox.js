import React from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Alert } from 'react-native'
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from 'ethers';
import { FBB_ADDRESS, TOTAL_WALLET } from '../../../Contracts/config';
import FBB from '../../../Contracts/FBB.json'
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../../components/Loading';
import { showAlert, TYPE } from '../../../components/Alert';
import { walletActions } from '../../../redux/reducer/walletReducer';
import { marketActions } from '../../../redux/reducer/marketReducers';

const { width, height } = Dimensions.get('screen');

export default function MyBox({ item, transferNFT }) {

    const account = useSelector(state => state.walletReducer.account)
    const dispatch = useDispatch()

    const { name, tokenId, image, boxType } = item

    const onTransfer = async () => {
        Alert.alert('Thông báo',
            'Bạn có chắc chắn muốn chuyển BirdBox vào game?',
            [{
                text: 'Đồng ý',
                onPress: () => transferNFT(item)
            }, {
                text: 'Huỷ',
                style: 'cancel'
            }])
    }
    return (
        <View style={styles.item}>
            <View style={styles.viewHeader}>
                <Text style={styles.headerText}>{name}</Text>
            </View>
            <Image
                source={{ uri: image }}
                style={styles.photo}
                resizeMode="contain"
            />
            <View style={styles.viewId}>
                <View style={styles.viewContainerID}>
                    <Text style={styles.textId}>#</Text>
                </View>

                <Text style={styles.textIdBird}>{tokenId}</Text>
            </View>
            <View style={styles.viewStar}>
                <Text style={styles.txtStar}> {boxType} </Text>
                <Image
                    source={require('../../../assets/images/star.png')}
                    style={styles.photoStar}
                />
            </View>
            <View style={styles.viewFooter}>
                <TouchableOpacity style={styles.btn} onPress={onTransfer}>
                    <Text style={styles.fontBtn}>Transfer</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        height: 272,
        width: (0.95 * width - 32) / 2,
        borderRadius: 20,
        borderWidth: 2,
        backgroundColor: 'white',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 1,
        shadowColor: 'black',
        shadowRadius: 0,
        margin: 8,
    },
    viewHeader: {
        alignSelf: 'center',
        height: 35,
        backgroundColor: '#e2e2e2',
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        flexDirection: 'row',
    },
    headerText: {
        fontWeight: '600',
    },
    photo: {
        height: 80,
        width: 100,
        alignSelf: 'center',
        // marginTop: 8,
    },
    viewId: {
        borderWidth: 2,
        flexDirection: 'row',
        borderRadius: 20,
        marginTop: 16,
        width: 120,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
    },
    textId: {
        color: 'white',
        fontWeight: 'bold',
        // fontSize: 18
    },
    viewStar: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 8,
        alignItems: 'center',
    },
    photoStar: {
        height: 30,
        width: 30,
    },
    viewFooter: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 8,
        alignItems: 'center',
    },
    btn: {
        height: 32,
        // width: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#69fdcb',
        borderWidth: 2,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 1,
        shadowColor: 'black',
        shadowRadius: 0,
        marginLeft: 12,
        paddingHorizontal: 12,
    },
    textIdBird: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    viewContainerID: {
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 40,
        marginRight: 4,
    },
    txtStar: { fontSize: 20, fontWeight: 'bold' },
    fontBtn: {
        fontWeight: '600',
    },
})