import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LottieView from 'lottie-react-native';
import { utils, ethers } from "ethers";

import { leaderBroadActions } from '../../redux/reducer/leaderBroadReducer'

const LeaderBoard = () => {
  const dispatch= useDispatch()
  const [data, setData] = useState([])
  const dataLeader = useSelector(state => state.leaderBroadReducer.dataLeaderBroad)  
 console.log('data222', data)
  useEffect(() => {
    dispatch(leaderBroadActions.getDataLeaderBoards())
  }, [])

  useEffect(() => {
    setData(dataLeader)
  }, [dataLeader])

  const renderItem =({item, index})=>{
    return(
      <View style = {styles.item}>
        <View style = {[styles.imageItem,{backgroundColor: index === 0? "#d7e32b": index ===1? "#2b96e3" : index ===2 ?"#9c6903": "#a1a09f"}]}>
          <Text style = {styles.txtIndex}># {index +1}</Text>
        </View>
        <View>
          <Text style ={styles.txtUser}>{item.user}</Text>
          <Text style = {styles.txtFTB}>{utils.formatUnits(item.fbtBalance, 18)} FBT</Text>
        </View>
      </View>
    )
  }
  
  
  return (
    <SafeAreaView style = {styles.container}>
      <LottieView
        source={require('../../assets/lottieFiles/leaderboard.json')}
        autoPlay
        loop
        style = {styles.lottie}
      />
      <FlatList
      style = {styles.flat}
      data = {data}
      renderItem = {renderItem}
      />
      {/* <View style = {styles.height}/> */}
    </SafeAreaView>
  )
}

export default LeaderBoard

const styles = StyleSheet.create({
  container: {
    flex :1
  },
  item: {
    borderWidth: 1,
    marginHorizontal: 32,
    height: 78,
    // width :"80%",
    // alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 16
  },
  flat: {
   
  },
  lottie: {
    height: 200,
    width: "100%",
    alignSelf :"center"
  },
  imageItem: {
    height: 56,
    width: 56,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center", 
    marginHorizontal: 16
  },
  txtIndex: {
    fontSize: 20,
    fontWeight: "800",
    // color: "white"
  }, 
  txtUser: {
    fontSize: 16, 
  },
  txtFTB: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8
  },
  height: {
    height: 100
  }
})