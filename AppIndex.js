import React, { Component } from 'react'
import 'react-native-gesture-handler'
import { Root } from 'native-base'
import { Platform, View, Text, TouchableOpacity, Alert } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import RNRestart from 'react-native-restart'
import ImageLoad from './src/common/RnImagePlaceH'
import { store, persistor } from './src/redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Appp from './App'
import { NetworkProvider, NetworkConsumer, ReduxNetworkProvider } from 'react-native-offline'
import ThemeStyle, { appTextStyle } from './src/common/Theme.style'
export default class AppIndex extends Component {
  CheckConnectivity = () => {
    if (Platform.OS === 'android') {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
        } else {
          Alert.alert('Please connect to the internet')
        }
      })
    } else {
      // For iOS devices
      this.dimensionsSubscription = NetInfo.addEventListener(
        this.handleFirstConnectivityChange
      )
    }
  };

  handleFirstConnectivityChange = state => {
    // NetInfo.removeEventListener(
    //   this.handleFirstConnectivityChange
    // )

    if (state.isConnected === false) {
      Alert.alert('Please connect to the internet')
    } else {
    }
  };

  componentDidMount () {
    this.CheckConnectivity()
  }

  componentWillUnmount () {
    if (this.dimensionsSubscription !== undefined && this.dimensionsSubscription !== null) {
      if (this.dimensionsSubscription.remove !== undefined) { this.dimensionsSubscription.remove() }
    }
  }

  render () {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NetworkProvider >
            <NetworkConsumer>
              {({ isConnected }) =>
                isConnected ? (
                  <ReduxNetworkProvider>
                    <Root>
                      <Appp />
                    </Root>

                  </ReduxNetworkProvider>
                ) : (
                  <View style={{ flex: 1, backgroundColor: ThemeStyle.backgroundColor }}>
                    {Platform.OS === 'ios' ? (
                      <View style={{ height: 36, backgroundColor: '#51688F' }} />
                    ) : null}

                    <View
                      style={{
                        flex: 1,
                        backgroundColor: ThemeStyle.backgroundColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: 170
                      }}
                    >
                      <ImageLoad
                        key={'key'}
                        style={{ width: 200, height: 200 }}
                        loadingStyle={{ size: 'large', color: ThemeStyle.primary }}
                        placeholderSource={require('./src/images/wifi.png')}
                        placeholderStyle={{ width: 200, height: 300 }}
                        source={require('./src/images/wifi.png')}
                      />
                      <Text style={{
                        fontSize: 22,
                        fontFamily: appTextStyle.fontFamily
                      }}>
                        No internet {'\n'}
                        Try:{'\n'}
                        Reconnecting to Wi-Fi
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          RNRestart.Restart()
                        }
                      >
                        <View
                          style={{
                            marginTop: 18,
                            borderColor: '#51688F',
                            alignItems: 'center',
                            height: 38,
                            width: 90,
                            backgroundColor: '#51688F',
                            justifyContent: 'center'
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              color: '#fff',
                              fontSize: 15,
                              fontFamily: appTextStyle.fontFamily
                            }}
                          >
                            Try Again
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }
            </NetworkConsumer>
          </NetworkProvider>
        </PersistGate>
      </Provider>
    )
  }
}
