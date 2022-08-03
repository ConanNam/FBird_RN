import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import IconFlash from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { marketActions } from '../../redux/reducer/marketReducers';
import { utils, ethers } from 'ethers';

const dropdown = ['Last', 'Lowest Price', 'Hight Price'];
const { width, height } = Dimensions.get('screen');

Number.prototype.format = function (n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(
    new RegExp(re, 'g'),
    '$&' + (s || ','),
  );
};
const Marketplace = () => {
  const [filterPrice, setFilterPrice] = useState('Last');
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [params, setParams] = useState({ page: 1, limit: 10 })
  const [dataMarket, setDataMarket] = useState([])

  const walletInGame = useSelector(state => state.walletReducer.walletInGame);
  const dataBirdOnSale = useSelector(state => state.marketReducer.dataMarket);
  const isLoadingDataMarket = useSelector(state => state.marketReducer.isLoadingDataMarket);
  const dataMarketPaginate = useSelector(state => state.marketReducer.dataMarketPaginate);
  const isBuyBird = useSelector(state => state.marketReducer.isBuySuccess);
  const dispatch = useDispatch();

  useEffect(() => {
    onGetDataMaket()
  }, [params])

  useEffect(() => {
    dispatch(marketActions.getDataMarket(params));
    dispatch(marketActions.getDataMyBird());
  }, [isBuyBird])


  useEffect(() => {
    const newDataMarket = dataMarket.concat(dataBirdOnSale)
    if (dataMarket.length < dataMarketPaginate.total && dataMarketPaginate.page != 1)
      setDataMarket(newDataMarket)
    else
      setDataMarket(dataBirdOnSale)
  }, [dataBirdOnSale])

  const filterStar = () => {
    if (parseInt(from) > 0 && parseInt(to) < 12 && parseInt(from) < parseInt(to)) {
      const newParams = { ...params }
      newParams.from_star = from
      newParams.to_star = to
      newParams.page = 1
      setParams(newParams)
    } else {
      Alert.alert('error enter from to');
    }
  };

  const onGetDataMaket = () => {
    dispatch(marketActions.getDataMarket(params));
  }

  const onChangeParams = (key, value) => {
    const newParams = { ...params }
    if (value == null)
      delete newParams[key]
    else
      newParams[key] = value
    setParams(newParams)
  }

  const onPaging = () => {
    const { page, totalPage } = dataMarketPaginate
    if (page < totalPage) {
      onChangeParams('page', params.page + 1)
    }
  }

  const onClickBuy = item => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc nhắn mua chim ? ",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => dispatch(marketActions.requestByBird(item)) }
      ]
    );

  };

  const renderRow = item => {
    console.log('item', item);
    return (
      <View style={styles.itemRow}>
        <Text
          style={[
            styles.txtRow,
            {
              color: item === filterPrice ? '#69fdcb' : 'black',
            },
          ]}>
          {item}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View style={styles.viewHeader}>
          {/* <Text style={styles.headerText}>{item.earn} FTB/ lượt</Text> */}
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
          <View style={styles.viewContainerID}>
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
        <View style={styles.viewFooter}>
          <View style={styles.txtPrice}>
            <Text style={styles.txtFooter} multiline>
              {utils.formatUnits(item.price, 18)} FTB
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onClickBuy(item._id)}>
            <Text style={styles.fontBtn}>BUY</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onSelectItem = (selectedItem, index) => {
    const newParams = { ...params }
    newParams.page = 1
    if (index === 1) {
      newParams.is_low_to_high = true
    } else if (index === 2) {
      newParams.is_low_to_high = false
    } else {
      delete newParams.is_low_to_high
    }
    setFilterPrice(selectedItem);
    setParams(newParams)
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/iconCoin.png')}
          resizeMode="contain"
          style={styles.iconCoin}
        />
        <Text style={styles.txtCoin}>
          {Number(utils.formatUnits(walletInGame?.fbtBalance ?? '0', 18)).format(2, 3)}
        </Text>
      </View>
      <View style={styles.viewFilterHeader}>
        {/* <TouchableOpacity style={styles.filterPrice} >
          <Text style={{fontWeight: '500', fontSize: 14}}>{filterPrice}</Text>
          <Icon name="down" size={16} />
        </TouchableOpacity> */}
        <SelectDropdown
          buttonStyle={styles.filterPriceBird}
          defaultButtonText={filterPrice}
          data={dropdown}
          onSelect={(selectedItem, index) => onSelectItem(selectedItem, index)}
          dropdownStyle={styles.dropdownStyle}
          dropdownIconPosition="right"
          renderDropdownIcon={() => <Icon name="down" size={16} />}
          renderCustomizedRowChild={item => renderRow(item)}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />
        <View style={styles.viewDropdown}>
          <View
            style={[
              styles.filterPrice,
              {
                height: Platform.OS == 'android' ? 40 : 30,
                width: Platform.OS == 'android' ? 110 : 126,
              },
            ]}>
            <Text style={styles.txtFilterStar}>Filter Star : </Text>
          </View>
          <TextInput
            style={[
              styles.filterPrice,
              {
                height: Platform.OS == 'android' ? 40 : 30,
              },
              styles.viewTextInput,
            ]}
            placeholder="From"
            value={from}
            onChangeText={setFrom}
            keyboardType="numeric"
          />
          <Icon name="arrowright" size={26} style={{ marginLeft: 8 }} />
          <TextInput
            style={[
              styles.filterPrice,
              {
                height: Platform.OS == 'android' ? 40 : 30,
              },
              styles.viewTextInput,
            ]}
            placeholder="To"
            value={to}
            onChangeText={setTo}
            keyboardType="numeric"
          />
          <Icon
            name="search1"
            size={26}
            style={styles.margin}
            onPress={() => filterStar()}
          />
        </View>
      </View>
      <FlatList
        style={styles.viewFlat}
        numColumns={2}
        horizontal={false}
        data={dataMarket}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={() => onChangeParams('page', 1)}
        refreshing={isLoadingDataMarket}
        onEndReached={onPaging}
        onEndReachedThreshold={0.1}
      />
      <View style={styles.height} />
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
  iconCoin: {
    height: 34,
    width: 34,
    borderRadius: 80,
    marginRight: 8,
  },
  txtCoin: {
    fontSize: 16,
    fontWeight: '600',
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
  viewFilterHeader: {
    height: Platform.OS == 'android' ? 88 : 78,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#d6fdf0',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginTop: 16,
  },
  viewFlat: {
    height: '100%',
    width: 0.95 * width,
    alignSelf: 'center',
    marginTop: 16,
  },
  viewTextInput: {
    width: 68,
    borderWidth: 1,
    paddingLeft: 8,
  },
  viewDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  itemRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontBtn: {
    fontWeight: '600',
  },
  txtFooter: { fontSize: 14, fontWeight: '600' },
  txtRow: {
    fontSize: 18,
    fontWeight: '600',
  },
  txtStar: { fontSize: 20, fontWeight: 'bold' },
  dropdownStyle: { borderWidth: 2, borderRadius: 20 },
  txtFilterStar: { fontWeight: '500', fontSize: 14 },
  margin: { marginLeft: 16 },
  height: { height: 50 },
  txtPrice: { width: 94 },
});

export default Marketplace;
