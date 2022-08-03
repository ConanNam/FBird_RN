import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Setting({ navigation }) {
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
                    SETTINGS
                </Text>
            </View>
            <TouchableOpacity style={styles.btnContainer} onPress={() => navigation.navigate('Backup')}>
                <View style={styles.btnTop}>
                    <View style={styles.btnLeft}>
                        <MaterialIcons name="security" size={24} color="black" />
                        <Text style={styles.textTit}>Backup</Text>
                    </View>

                    <Feather name="chevron-right" size={24} color="gray" />
                </View>
                <View style={styles.btnBottom}>
                    <Text style={styles.textDes}>Your 12-word Seed Phrase is the ONLY way to recover your funds if you lose access to your wallet</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnContainer} onPress={() => navigation.navigate('ImportWallet')}>
                <View style={styles.btnTop}>
                    <View style={[styles.btnLeft, { width: 120 }]}>
                        <MaterialCommunityIcons name="restore" size={24} color="black" />
                        <Text style={styles.textTit}>Restore Wallet</Text>
                    </View>

                    <Feather name="chevron-right" size={24} color="gray" />
                </View>
                <View style={styles.btnBottom}>
                    <Text style={styles.textDes}>Overwrite your current Mobile wallet using a Seed Phrase</Text>
                </View>
            </TouchableOpacity>
            <View
                style={styles.containerPower}>
                <Text style={styles.textPower}>
                    Powered by BNB Smart Chain
                </Text>
            </View>

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
    btnContainer: {
        width: '90%',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 12,
        alignSelf: 'center',
        backgroundColor: '#fef9e6',
        marginTop: 20
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
        fontSize: 10
    },
    containerPower: { alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    textPower: { fontSize: 13, fontWeight: '600', color: 'black', fontStyle: 'italic' },

});
