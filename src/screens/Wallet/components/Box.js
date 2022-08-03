import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';


const Box = ({ image, price, type, boxType, btnTitle, mintBox }) => {
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.photo} resizeMode="contain" />
            <View style={styles.right}>
                <View style={styles.marginTop}>
                    <Text style={styles.txtType}>{type}</Text>
                </View>
                <View style={styles.viewPrice}>
                    <Text style={styles.txtPrice}>Price: {price}</Text>
                </View>
                <TouchableOpacity style={styles.btnOpen} onPress={mintBox}>
                    <Text style={styles.txtBuy}>{btnTitle}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 20
    },
    photo: {
        height: 100,
        width: '40%'
    },
    marginTop: { marginTop: 16 },
    txtType: {
        // alignSelf: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
    },
    viewPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    txtPrice: { fontSize: 14, fontWeight: '600', color: 'black' },
    btnOpen: {
        marginTop: 20,
        width: 100,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7d559',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 20,
        height: 40,
    },
    txtBuy: {
        color: 'black',
    },
    right: {
        width: '60%',
        paddingVertical: 12,
        alignItems: 'center',
    }
});
export default Box;
