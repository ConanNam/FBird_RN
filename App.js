/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { Provider, useDispatch } from 'react-redux'
import CodePush from 'react-native-code-push'

import Router from './src/navigator';
import store from './src/redux/store'
import { Alert } from './src/components/Alert'
import { authActions } from './src/redux/reducer/authReducer';
import { Loading } from './src/components/Loading';



const AppRedux = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authActions.init())
    return () => {
    }
  }, [])

  return (
      < >
        <Router />
        <Loading />
      </>

  )
}

const App = () => {
  return (
    <Provider store={store}>
      <AppRedux />
      <Alert />
    </Provider>
  );
};

const styles = StyleSheet.create({

});

let codePushOptions = { checkFrequency: CodePush.CheckFrequency.ON_APP_START, installMode: CodePush.InstallMode.IMMEDIATE }
export default CodePush(codePushOptions)(App)

