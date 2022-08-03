import React from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import IconFlash from 'react-native-vector-icons/Entypo';
import { useDispatch } from 'react-redux';
import { marketActions } from '../../../redux/reducer/marketReducers';

const {width, height} = Dimensions.get('screen');

const ModalBox = ({isVisible, item}) => {
    const dispatch = useDispatch()
    const  onConfirm =() =>{
        dispatch(marketActions.getDataMyBird())
        dispatch(marketActions.requestGetMyBirdBox())
    }

  return (
    <Modal
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={300}
      animationOutTiming={200}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      isVisible={isVisible}
      style={styles.container}>

      <LottieView
        source={require('../../../assets/lottieFiles/fireworks.json')}
        autoPlay
        loop
      />
      <View style={styles.item}>
        <View style={styles.viewHeader}>
          <Text>{item?.name}</Text>
        </View>
        <Image
          source={{uri: item.image}}
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
            source={require('../../../assets/images/star.png')}
            style={styles.photoStar}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress= {()=> onConfirm()}>
          <Text>OK</Text>
        </TouchableOpacity>
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    height: 256,
    width: width / 2,
    borderRadius: 20,
    backgroundColor: 'white',
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
    width: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#69fdcb',
    marginTop: 16,
    alignSelf: 'center',
  },
  textIdBird: {
    fontWeight: 'bold',
    fontSize: 16,
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
  txtStar: {fontSize: 20, fontWeight: 'bold'},
});

export default ModalBox;
