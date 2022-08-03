import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
const SplashScreen = () => {

    // const dispatch = useDispatch()

    // useEffect(()=>{
    //     dispatch(authActions.init())
    // },[])

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/bird1.png')} style={styles.logo} />
            <ActivityIndicator size='large' color='red' />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 120,
        height: 96,
        marginBottom: 20
    }
})