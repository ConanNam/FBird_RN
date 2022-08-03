import React from 'react'
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native'
import { useDispatch } from 'react-redux'
import { marketActions } from '../../../redux/reducer/marketReducers';

const Box = (item, index) => {
    console.log('item2222', item)
    const  {image, tokenId, name, boxType} = item
    const dispatch = useDispatch();
    const openBox = ()=>{
        dispatch(marketActions.requestOpenBox(boxType))
    }
  return (
   <TouchableOpacity style = {styles.container} onPress = {() => openBox()}>
       <Image source={image} style ={styles.photo} resizeMode = "contain"/>
       <View style = {styles.marginTop}>
           <Text style = {styles.txtType}>
                {name}
           </Text>
       </View>
       <View style = {styles.viewPrice}>
            <Text>ID:</Text>
            <Text style = {styles.txtPrice}>{tokenId}</Text>
       </View>
       <View style = {styles.btnOpen}>
        <Text>Open</Text>
       </View>
   </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {borderWidth: 2, borderRadius: 20, paddingBottom: 12},
    photo:{height: 56,width: 110},
    marginTop :{marginTop: 32},
    txtType:{alignSelf: 'center', fontSize: 14, fontWeight: "600"},
    viewPrice:{flexDirection: 'row', marginHorizontal: 16, justifyContent: "space-between", marginTop: 8},
    txtPrice:{fontSize: 14, fontWeight: "600"},
    btnOpen:{marginTop: 8, height: 30, width: 60, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: '#69fdcb', alignSelf: "center"}
})
export default Box