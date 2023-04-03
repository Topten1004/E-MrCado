import React, { Component } from 'react'
import AppContainerWithBottom from './src/navigation/Index'
import SplashScreen from 'react-native-splash-screen'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  LogBox
} from 'react-native'
import {
  GET_CODE,
  firstSettingCallFun,
  settingCallFun,
  getCategories,
  getBanners,
  getProducts,
  getCartProductsQuantity,
  getWishlist,
  gethotProducts,
  getfeaturedProducts,
  gettopsellerProducts,
  getonSaleProducts
} from './src/redux/actions/actions'
import OneSignal from 'react-native-onesignal'

import configSettings, { appTextStyle } from './src/common/Theme.style'
const Height = Dimensions.get('window').height
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
)
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listTotal: 0,
      isLoading: true,
      data: '',
      SpinnerTemp: false,
      categoryLimit: 10
    }
    this.toast = null

    OneSignal.init(configSettings.oneSignalAppIdForAndroid)
    OneSignal.addEventListener('opened', this.onOpened)
  }

  componentDidMount () {
    if (Object.keys(this.props.settings).length === 0) {
      this.props.firstSiteSetting(this.props, this) // first settings call
    } else { // every time call
      this.props.bannersCall(this.props, this)
      this.props.categoryCall(this.props, this)
      this.props.siteSettingFun(this.props, this)
      this.props.getProductsFun(this.props, 1, this)
      this.props.getHotProductsFun(this.props, 1, this)
      this.props.getonSaleProductsFun(this.props, 1, this)
      this.props.gettopsellerProductsFun(this.props, 1, this)
      this.props.getNewArrivalProductsFun(this.props, 1, this)

      if (Object.keys(this.props.userData).length > 0) {
        this.props.wishlistCall(this)
      }
      this.props.getLanguageCodeFun(this.props.languageCode)
    }
    if (Object.keys(this.props.userData).length > 0) {
      this.props.getCartProductsQuantityCall(this, this.props.userData)
    }
    // console.disableYellowBox = true
    this.setState({ isLoading: false })
    LogBox.ignoreAllLogs = true
    LogBox.ignoreLogs(['Animated:', 'FlatList:', 'useNativeDriver', 'headerForceInset'])
  }

  componentWillUnmount () {
    OneSignal.removeEventListener('opened', this.onOpened)
  }

  onOpened (openResult) {
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.SpinnerTemp} />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <MyStatusBar
          backgroundColor={this.props.themeStyle.StatusBarColor}
          barStyle={configSettings.barStyle}
        />
        <AppContainerWithBottom />
      </View>
    )
  }
}
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Height * 0.04 : 0

const mapDispatchToProps = dispatch => ({
  getCartProductsQuantityCall: (th, userData) => {
    dispatch(async dispatch => {
      await getCartProductsQuantity(dispatch, '', th, userData)
    })
  },
  getLanguageCodeFun: (languageCode) => {
    dispatch({
      type: GET_CODE,
      value: languageCode
    })
  },
  firstSiteSetting: (props, th) => {
    dispatch(async dispatch => {
      await firstSettingCallFun(dispatch, props.settings.language_id, th)
      SplashScreen.hide()
    })
  },
  getProductsFun: (props, page, th) => {
    dispatch(async dispatch => {
      await getProducts(dispatch, props.settings.language_id, props.settings.currency_id, page, th)
    })
  },
  getHotProductsFun: (props, page, th) => {
    dispatch(async dispatch => {
      await gethotProducts(dispatch, props.settings.language_id, props.settings.currency_id, page, th)
    })
  },

  getNewArrivalProductsFun: (props, page, th) => {
    dispatch(async dispatch => {
      await getfeaturedProducts(dispatch, props.settings.language_id, props.settings.currency_id, page, th)
    })
  },
  gettopsellerProductsFun: (props, page, th) => {
    dispatch(async dispatch => {
      await gettopsellerProducts(dispatch, props.settings.language_id, props.settings.currency_id, page, th)
    })
  },
  getonSaleProductsFun: (props, page, th) => {
    dispatch(async dispatch => {
      await getonSaleProducts(dispatch, props.settings.language_id, props.settings.currency_id, page, th)
    })
  },

  siteSettingFun: (props, th) => {
    dispatch(async dispatch => {
      await settingCallFun(dispatch, props.settings, th)
      SplashScreen.hide()
    })
  },
  bannersCall: (props, th) => {
    dispatch(async dispatch => {
      await getBanners(dispatch, th)
    })
  },
  categoryCall: (props, th) => {
    dispatch(async dispatch => {
      await getCategories(dispatch, props.settings.language_id, th)
    })
  },
  wishlistCall: (th) => {
    dispatch(async dispatch => {
      await getWishlist(dispatch, th)
    })
  }
})
const getUserData = (state) => state.userData.user

const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)
/// ///////////////////////////////////////////////
const getSettings = (state) => state.settingsCall.settings
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
const getTheme = (state) => state.appConfig.themeStyle
const getLanguageCode = (state) => state.appConfig.languageCode
const getLanguageCodeFun = createSelector(
  [getLanguageCode],
  (getLanguageCode) => {
    return getLanguageCode
  }
)
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const selectedLang = (state) => state.languagesData.selectedlang
const selectedLangFun = createSelector(
  [selectedLang],
  (selectedLang) => {
    return selectedLang
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  showIntro: state.appConfig.showIntro,
  settings: getSettingsFun(state),
  selectedlang: selectedLangFun(state),
  userData: getUserDataFun(state),
  languageCode: getLanguageCodeFun(state)
})
/// //////////////////////////////////////////
export default connect(mapStateToProps, mapDispatchToProps)(App)

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT
  }
})
