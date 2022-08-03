import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { navigate } from '../../navigator/rootNavigation';
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../redux/reducer/authReducer';


const Login = () => {
    const [email, setEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');
    const [awaitTimeSend, setAwaitTimeSend] = useState(0)
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(authActions.login({
            email,
            activeCode: emailCode
        }))
    }

    const handleSendcode = () => {
        if (awaitTimeSend == 0) {
            setAwaitTimeSend(60)
            dispatch(authActions.getVerificationCode({ email }))
        }
    }

    useEffect(() => {
        if (awaitTimeSend > 0)
            setTimeout(() => {
                setAwaitTimeSend(awaitTimeSend - 1)
            }, 1000)
    }, [awaitTimeSend])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>

                <View style={styles.containerSmall}>
                    <View style={styles.fbirdlogo}>
                        <Text style={styles.fbirdTitle}>FBird</Text>
                        <Image source={require('../../assets/img/bird1.png')}
                            style={styles.logo} />
                    </View>
                    <View style={styles.codeContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Email'
                            value={email}
                            placeholderTextColor='gray'
                            onChangeText={setEmail}
                        />
                      
                    </View>
                    <View style={styles.codeContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Email verification code'
                            value={emailCode}
                            placeholderTextColor='gray'
                            onChangeText={setEmailCode}
                        />
                        <TouchableOpacity
                            style={{justifyContent:'center'}}
                            onPress={handleSendcode}>
                            {awaitTimeSend > 0 ?
                            <Text style={{paddingRight: 8, fontWeight: 'bold' }}>{awaitTimeSend}</Text>:<Text style={styles.textSend}>Send</Text>}
                        </TouchableOpacity>
                    </View>
                    <Text style={{ alignSelf: 'center', marginTop: 10 }}>Account will be automatically registered</Text>
                    <TouchableOpacity
                        style={styles.btnlogin}
                        onPress={handleLogin}><Text style={{color:'white'}}>Login</Text></TouchableOpacity>
                </View>

            </View>
        </TouchableWithoutFeedback>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerSmall: {
        marginTop: 200,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 20,
    },
    fbirdlogo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    btnlogin: {
        marginTop: 20,
        backgroundColor: 'black',
        justifyContent:'center',
        alignItems:'center',
        height:40,
        borderRadius:10
    },
    txtInput: {
        marginBottom: 20,
        backgroundColor: 'white',
        color: 'black'
    },
    fbirdTitle: {
        fontSize: 25,
        marginRight: 10
    },
    logo: {
        width: 40,
        height: 30,
        resizeMode: 'cover'
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
        fontWeight: '600',
    },
    textSend:{
        fontWeight:'bold'
    }
})