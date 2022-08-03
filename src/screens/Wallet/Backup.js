import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import { showAlert, TYPE } from '../../components/Alert';

export default function Backup({ navigation }) {
    const user = useSelector(state => state.authReducers.user)
    const [seedPhrases, setSeedPhrases] = useState([]);
    const [seedPhrasesCopy, setSeedPhrasesCopy] = useState();
    const copyToClipboard = () => {
        Clipboard.setString(seedPhrasesCopy);
        console.log('seedPhrasesCopy', seedPhrasesCopy)
        showAlert(TYPE.SUCCESS, 'Copied!')
    };
    const getSeedPhrases = async () => {
        const mnemonic = await SInfo.getItem(`mnemonic_${user._id}`, {
            sharedPreferencesName: "mySharedPrefs",
            keychainService: "myKeychain",
        });
        setSeedPhrasesCopy(mnemonic)
        let seedPhrases = mnemonic.split(' ').filter(w => w !== '');
        setSeedPhrases(seedPhrases)
    }
    useEffect(() => {
        getSeedPhrases()
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={styles.containerText}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.btnBack}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.textTransfer}>
                    SEED PHRASE
                </Text>
            </View>
            <View style={styles.btnContainer}>
                <MaterialIcons name="security" size={24} color="black" style={styles.icon} />
                <Text style={styles.textDes} numberOfLines={2}>Write down your Seed Phrase in the correct order on paper</Text>
                {seedPhrases.map((item, index) => {
                    return <View key={index} style={styles.itemContainer}>
                        <Text style={styles.leftText}>{index + 1}</Text>
                        <Text style={styles.textSeed}>{item}</Text>
                    </View>
                })}
            </View>
            <TouchableOpacity
                style={styles.btnCopy} onPress={() => copyToClipboard()}>
                <Text style={styles.textCopy}>
                    COPY 
                </Text>
            </TouchableOpacity> 

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
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
    btnContainer: {
        width: '90%',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 12,
        alignSelf: 'center',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20
    },
    btnTop: {
        flexDirection: 'row',
        // height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20
    },
    btnBottom: {
        backgroundColor: 'white',
        // height: 60,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12
    },
    btnLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 80
    },
    textTit: {
        fontSize: 12,
        color: 'black',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    textDes: {
        fontSize: 11,
        lineHeight: 16,
        fontStyle: 'italic',
        width: 200,
        textAlign: 'center',
        marginBottom: 10,
    },
    containerPower: { alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    textPower: { fontSize: 13, fontWeight: '600', color: 'black', fontStyle: 'italic' },
    textSeed: {
        color: 'black',
        width: 100,
    },
    leftText: {
        width: 60
    },
    icon: {
        marginVertical: 20
    },
    btnCopy: {
        height: 50,
        width: '50%',
        backgroundColor: '#f7d559',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        alignSelf: 'center',
    },
    textCopy: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16
    }
});
