import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import Box from './components/Box';
import { useDispatch, useSelector } from 'react-redux';
import { marketActions } from '../../redux/reducer/marketReducers';
import IconFlash from 'react-native-vector-icons/Entypo';
import ModalBox from './components/ModalBox';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {utils, ethers} from 'ethers';

const { width, height } = Dimensions.get('screen');

Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = this.toFixed(Math.max(0, ~~n));
  
  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
const Gallery = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [dataOnSale, setDataOnSale] = useState([]);
  const [dataMyBox, setDataMyBox] = useState([])
  const dispatch = useDispatch();
  const dataMyBird = useSelector(state => state.marketReducer.myBird);
  const dataMyBirdOnSale = useSelector(state => state.marketReducer.myBirdOnSale);
  const dataMyBirdBox =  useSelector(state => state.marketReducer.myBirdBox)
  const isOpen = useSelector(state => state.marketReducer.isOpen);
  const openBird = useSelector(state => state.marketReducer.openBird);
  const walletInGame = useSelector(state => state.walletReducer.walletInGame);
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    dispatch(marketActions.getDataMyBird());
    dispatch(marketActions.requestGetMyBirdBox())
    setRefreshing(true);
    setTimeout(()=>setRefreshing(false), 3000)}
  useEffect(() => {
    dispatch(marketActions.getDataMyBird());
    dispatch(marketActions.requestGetMyBirdBox())
  }, []);

  useEffect(() => {
    setData(dataMyBird);
  }, [dataMyBird]);
  useEffect(() => {
    setDataMyBox(dataMyBirdBox);
  }, [dataMyBirdBox]);
  useEffect(() => {
    setDataOnSale(dataMyBirdOnSale);
  }, [dataMyBirdOnSale]);

  const onChangeScreen = (item) => {
    navigation.navigate("DetailBird", item)
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => onChangeScreen(item)}>
        <View style={styles.viewHeader}>
          <IconFlash
            name="flash"
            size={30}
            color={item.energy > 0 ? '#30b314' : 'gray'}
          />
          <IconFlash
            name="flash"
            size={30}
            color={item.energy > 1 ? '#30b314' : 'gray'}
          />
        </View>
        <Image
          source={{ uri: item.image }}
          style={styles.photo}
          resizeMode="contain"
        />
        <View style={styles.viewId}>
          <View style={styles.viewItem}>
            <Text style={styles.textId}>#</Text>
          </View>

          <Text style={styles.textIdBird}>{item.tokenId}</Text>
        </View>
        <View style={styles.viewStar}>
          <Text style={styles.txtStar}> {item.star} </Text>
          <Image
            source={require('../../assets/images/star.png')}
            style={styles.photoStar}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemBox = ({item, index}) => {
    console.log('item2222', item)
    const  {image, tokenId, name, boxType} = item
    const openBox = ()=>{
        dispatch(marketActions.requestOpenBox({birdBoxId: item._id}))
    }
  return (
   <TouchableOpacity style = {styles.item} onPress = {() => openBox()}>
       <Image source={{uri: image }} style ={styles.photoBox} resizeMode = "contain"/>
       <View style = {styles.marginTop}>
           <Text style = {styles.txtType}>
                {name}
           </Text>
       </View>
       <View style={styles.viewId}>
          <View style={styles.viewItem}>
            <Text style={styles.textId}>#</Text>
          </View>

          <Text style={styles.textIdBird}>{item.tokenId}</Text>
        </View>
       <View style={styles.viewStar}>
                <Text style={styles.txtStar}> {boxType} </Text>
                <Image
                    source={require('../../assets/images/star.png')}
                    style={styles.photoStar}
                />
            </View>
       <View style = {styles.btnOpen}>
        <Text>Open</Text>
       </View>
   </TouchableOpacity>
  )
}

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        } >
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/iconCoin.png')}
          resizeMode="contain"
          style={styles.iconCoin}
        />
        <Text style={styles.txtIconCoin}>{Number(utils.formatUnits(walletInGame?.fbtBalance ?? '0', 18)||0).format(2, 3)}</Text>
      </View>
      <View style={styles.viewText}>
        <Text style={styles.txtTitle}>My Bird</Text>
      </View>
      <FlatList
        style={styles.viewFlat}
        numColumns={2}
        horizontal={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent = {()=><LottieView
          source={require('../../assets/lottieFiles/67812-empty-box-animation.json')}
          autoPlay
          style = {styles.lottie}
          loop
        />}
      />
      <View style={styles.viewOpen}>
        <Text style={styles.txtOpen}>Open Box</Text>
      </View>
      <View style={styles.viewBox}>
        <FlatList
         style={styles.viewFlat}
         numColumns={2}
         horizontal={false}
         data={dataMyBox}
         renderItem={renderItemBox}
         keyExtractor={item => item.id}
         showsVerticalScrollIndicator={false}
        />
      </View>
      <ModalBox item={openBird} isVisible={isOpen && openBird} />
      <View style={styles.viewText}>
        <Text style={styles.txtTitle}>My Bird on Sale</Text>
      </View>
      <FlatList
        style={styles.viewFlat}
        numColumns={2}
        horizontal={false}
        data={dataOnSale}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        
      />
      <View style={styles.height} />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    height: 256,
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
    height: 56,
    width: 56,
    alignSelf: 'center',
    marginTop: 8,
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
    marginTop: 16,
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
    width: 60,
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
  },
  textIdBird: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterPrice: {
    flexDirection: 'row',
    height: 32,
    width: 126,
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
  },
  filterPriceBird: {
    flexDirection: 'row',
    height: 32,
    width: 200,
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
  },
  header: {
    alignSelf: 'flex-end',
    height: 36,
    width: 256,
    borderWidth: 1,
    marginRight: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  viewItem: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 40,
    marginRight: 4,
  },
  txtStar: { fontSize: 20, fontWeight: 'bold' },
  iconCoin: { height: 34, width: 34, borderRadius: 80, marginRight: 8 },
  txtIconCoin: { fontSize: 16, fontWeight: '600' },
  viewText: {
    height: 56,
    width: 0.95 * width,
    alignSelf: 'center',
    backgroundColor: '#69fdcb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  txtTitle: { fontSize: 20, fontWeight: '600', color: 'white' },
  viewFlat: {
    // height: '100%',
    width: 0.95 * width,
    alignSelf: 'center',
    marginTop: 16,
  },
  viewOpen: {
    height: 56,
    width: 0.95 * width,
    alignSelf: 'center',
    backgroundColor: '#ccccca',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  txtOpen: { fontSize: 20, fontWeight: '600', color: 'white' },
  viewBox: {
    flexDirection: 'row',
    marginTop: 32,
    marginHorizontal: 8,
    justifyContent: 'space-between',
  },
  height: {height: 100},
  lottie: {height: 200, alignSelf: 'center'},
  photoBox:{height: 56,width: 110, alignSelf: "center", marginTop: 8},
  marginTop :{marginTop: 16},
  txtType:{alignSelf: 'center', fontSize: 14, fontWeight: "600"},
  viewPrice:{flexDirection: 'row', marginHorizontal: 16, justifyContent: "space-between", marginTop: 8},
  txtPrice:{fontSize: 14, fontWeight: "600"},
  btnOpen:{marginTop: 8, height: 30, width: 60, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: '#69fdcb', alignSelf: "center"},
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
});

export default Gallery;
