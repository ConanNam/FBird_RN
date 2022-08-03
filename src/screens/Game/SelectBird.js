import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux'
import IconFlash from 'react-native-vector-icons/Entypo';
import { navigate, navigateReplace } from '../../navigator/rootNavigation';
import { SCREEN } from '../../constants/screen';
import { marketActions } from '../../redux/reducer/marketReducers';
import FInfo from 'react-native-sensitive-info'
import { showAlert, TYPE } from '../../components/Alert';
import moment from 'moment';

const Flash = ({ item }) => {
    switch (item?.energy) {
        case 0:
            return (
                <View style={{ flexDirection: 'row' }}>
                    <IconFlash
                        name="flash"
                        size={30}
                        color={'#ccccca'}
                    />
                    <IconFlash
                        name="flash"
                        size={30}
                        color={'#ccccca'}
                    />
                </View>
            )
            break;
        case 1:
            return (
                <View style={{ flexDirection: 'row' }}>
                    <IconFlash
                        name="flash"
                        size={30}
                        color={'#ccccca'}
                    />
                    <IconFlash
                        name="flash"
                        size={30}
                        color={'#30b314'}
                    />
                </View>
            )
            break;

        default:
            return (
                <View style={{ flexDirection: 'row' }}>
                    <IconFlash
                        name="flash"
                        size={30}
                        color={'#30b314'}
                    />
                    <IconFlash
                        name="flash"
                        size={30}
                        color={'#30b314'}
                    />
                </View>
            )
            break;
    }
}


const SelectBird = () => {
    let birds = useSelector(state => state.marketReducer.myBird) || []
    const [selectedBird, setSelectedBird] = useState(birds[0] || {})
    const dispatch = useDispatch()

    const [hours, setHours] = useState('')
    const [mins, setMins] = useState('')
    const [seconds, setSeconds] = useState('')
    useEffect(() => {
        dispatch(marketActions.getMyBird())
    }, [])

    useEffect(() => {
        setSelectedBird(birds[0])
    }, [birds])

    useLayoutEffect(() => {
        const timeInterval = setInterval(() => {
            if (selectedBird?.energy < 2) {
                const timeUntil = moment(selectedBird?.lastTimePlay).add(moment.duration(2, 'hours'))
                const now = moment();
                const countDown = moment.duration(timeUntil.diff(now))
                setHours(countDown.hours())
                setMins(countDown.minutes())
                setSeconds(countDown.seconds())

                if (countDown.seconds() < 0) {
                    clearInterval(timeInterval)
                }
            }
        }, 1000)

        return () => clearInterval(timeInterval)

    }, [selectedBird])


    const handleSelectedBird = (item) => {
        setSelectedBird(item)
    }

    const handlePlay = () => {
        if (selectedBird && selectedBird?.energy > 0) {
            navigate(SCREEN.Game, selectedBird)
        } else {
            showAlert(TYPE.ERROR, "Đã hết lượt chơi!", "Vui lòng quay lại sau 2h!")
        }
    }

    const handleLogout = () => {
        navigateReplace('Login')
        FInfo.deleteItem('BearerToken', {})
    }

    const handleMintBox = () => {
        navigate("Home", {
            screen: "Marketplace"
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}>
                {birds?.length > 0 ? <>
                    <View style={styles.containerToken}>
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={{ color: 'red' }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.selected}>
                        <Flash item={selectedBird} />

                        <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 18 }}>{selectedBird?.name}</Text>

                        <Image source={{ uri: `${selectedBird?.image}` }} resizeMode='cover' style={styles?.imgSelected} />
                        <View style={styles.viewStar}>
                            <Text style={styles.txtStar}> {selectedBird?.star} </Text>
                            <Image
                                source={require('../../assets/images/star.png')}
                                resizeMode='cover'
                                style={styles.photoStar}
                            />
                        </View>
                    </View>
                </> :
                    <>
                        <View style={styles.containerToken}>
                            <TouchableOpacity onPress={handleLogout}>
                                <Text style={{ color: 'red' }}>Log out</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.selected}>
                            <Image source={require('../../assets/img/default_bird.png')}
                                resizeMode='cover'
                                style={styles?.imgSelected} />
                        </View>
                        <Text style={styles.txtNoBird}>Để có thể chơi game, bạn cần phải sở hữu ít nhất 1 con chim, Vui lòng mở hộp quà để sở hữu chim!</Text>
                    </>

                }
                {birds?.length > 0 && <FlatList
                    style={styles.flStytle}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={birds}
                    extraData={birds}
                    renderItem={({ item, index }) => {
                        const imgBird = item.image
                        return (
                            <TouchableOpacity style={[styles.containerFl, selectedBird?._id == item._id && { borderColor: '#F1BA27', borderWidth: 2 }]} key={index + "w"}
                                onPress={() => handleSelectedBird(item)}>
                                <Image source={{ uri: imgBird }} style={styles.flImgBird} />
                                <View style={styles.viewStar}>
                                    <Text style={{ fontSize: 12, fontWeight: '600' }}> {item.star} </Text>
                                    <Image
                                        source={require('../../assets/images/star.png')}
                                        resizeMode='cover'
                                        style={{ width: 20, height: 20 }}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    }} />}

                {selectedBird?.energy < 2 && <Text style={styles.txtCountDown}>{`Thời gian hồi năng lượng còn: ${hours > 9 ? hours : "0" + hours}h : ${mins > 9 ? mins : "0" + mins}m : ${seconds > 9 ? seconds : "0" + seconds}s`}</Text>}
                <TouchableOpacity style={styles.btnStart}
                    onPress={birds?.length > 0 ? handlePlay : handleMintBox}>
                    <Text>{birds?.length > 0 ? "Start" : "Go to market"}</Text>
                </TouchableOpacity>
                <View style={{width:'100%', height:100}}/>
            </ScrollView>

        </SafeAreaView>

    )
}

export default SelectBird

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    containerToken: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        padding: 8,
        borderRadius: 20
    },
    imgCoin: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    selected: {
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        borderRadius: 20,
        marginTop: 20,
        backgroundColor: 'white'
    },
    flImgBird: {
        height: 42,
        width: 60,

    },
    containerFl: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 20,
        backgroundColor: 'white'

    },
    flStytle: {
        marginVertical: 20,
        maxHeight: 90,

    },
    btnStart: {
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#F1BA27',
        borderRadius: 10,
        padding: 20,
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
    txtStar: { fontSize: 20, fontWeight: 'bold' },
    imgSelected: {
        width: 180,
        height: 130
    },
    txtNoBird: {
        color: 'red',
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginTop: 20,
        textAlign: 'center'
    },
    txtCountDown: {
        fontWeight: 'bold',
        alignSelf: 'center'
    }
})