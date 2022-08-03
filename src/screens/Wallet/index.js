import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spending from './Spending';
import WalletOutGame from './WalletOutGame';

export default function Wallet({navigation}) {
  const [tab, setTab] = useState(true);
  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}> */}
      <View style={styles.tab}>
        <TouchableOpacity
          onPress={() => setTab(true)}
          style={!tab ? styles.btnBlur : styles.btnFocus}>
          <Text style={styles.text}>Spending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab(false)}
          style={tab ? styles.btnBlur : styles.btnFocus}>
          <Text style={styles.text}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.setting}
          onPress={() => navigation.navigate('Setting')}>
          <Ionicons name="settings-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* </View> */}

      {tab && <Spending navigation={navigation} />}
      {!tab && <WalletOutGame navigation={navigation} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
  },
  setting: {
    paddingTop: 10,
    paddingLeft: 20,
  },
  tab: {
    flexDirection: 'row',
    width: '70%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: 'center',
    marginTop: 12,
    height: 50,
    backgroundColor: '#f3f1f4',
  },
  btnBlur: {
    width: '50%',
    backgroundColor: '#f3f1f4',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFocus: {
    width: '50%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontWeight: '600',
  },
});
