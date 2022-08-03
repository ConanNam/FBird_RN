import React, {useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {marketActions} from '../../../redux/reducer/marketReducers';
const {utils, ethers} = require('ethers');

const DetailBird = props => {
  const item = props.route.params;
  console.log('item', item);
  const [price, setPrice] = useState(0);
  const dispatch = useDispatch();
  const onClickSale = () => {
    if (price > 0 && !item.onSale) {
      const priceBird = utils.parseUnits(price, 18).toString();
      dispatch(
        marketActions.requestSaleBird({bird: item._id, price: priceBird}),
      );
    } else if (item.onSale) {
      dispatch(marketActions.requestDeSaleBird({bird: item._id}));
    } else {
      Alert.alert('error enter price');
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.containerView}>
        <View style={[styles.btn, {width: 200, backgroundColor: '#999e9b'}]}>
          <Text style={styles.txtTypeDetail}>
            {parseInt(item.price) > 0 ? 'BUY' : 'SALE'}
          </Text>
        </View>
        <Text style={styles.txtName}>{item.name}</Text>
        <Image
          source={{uri: item.image}}
          style={styles.photo}
          resizeMode="contain"
        />
        <View>
          <View style={styles.viewId}>
            <View style={styles.viewItem}>
              <Text style={styles.textId}>#</Text>
            </View>
            <Text style={styles.textIdBird}>{item.tokenId}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.viewBody}>
            <Text style={styles.txtBody}>Star</Text>
            <Text>{item.star}</Text>
          </View>
          <View style={styles.viewBody}>
            <Text style={styles.txtBody}>Energy</Text>
            <Text>{item.energy}</Text>
          </View>
        </View>
        <View style={styles.viewFooter}>
          {!item.onSale ? (
            <TextInput
              keyboardType="numeric"
              value={price}
              onChangeText={text => setPrice(text)}
              style={styles.input}
              placeholder="Enter Price"
            />
          ) : null}
          <TouchableOpacity style={styles.btn} onPress={() => onClickSale()}>
            <Text style={styles.txtSale}>
              {parseInt(item.price) > 0 ? 'Huỷ bán' : 'Bán'}
            </Text>
          </TouchableOpacity>
        </View>
        {parseInt(item.price) === 0 && (
          <Text style={styles.txtNote}>Lưu ý: Phí bán là 5%</Text>
        )}
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewHeader: {},
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
  viewItem: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 40,
    marginRight: 4,
  },
  body: {
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    height: 90,
    width: '80%',
    marginTop: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  photo: {
    height: 80,
    width: 80,
    marginTop: 32,
  },
  txtTypeDetail: {
    fontSize: 20,
    fontWeight: '600',
  },
  txtBody: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewBody: {
    margin: 32,
  },
  btn: {
    height: 40,
    width: 120,
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
  },
  txtName: {
    marginTop: 40,
    fontSize: 20,
  },
  viewFooter: {
    flexDirection: 'row',
    marginTop: 50,
  },
  input: {
    height: 40,
    width: 150,
    borderWidth: 1,
    marginRight: 16,
    borderRadius: 20,
    paddingLeft: 10,
  },
  txtSale: {
    fontWeight: '600',
    // color: "white"
  },
  txtNote: {
    marginTop: 12,
  },
});
export default DetailBird;
