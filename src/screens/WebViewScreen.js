import React, { Component } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import { View, Dimensions, I18nManager, Platform } from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { WebView } from 'react-native-webview'
import { NavigationEvents } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import { Icon } from 'native-base'
import { createSelector } from 'reselect'
import themeStyle, { appTextStyle } from '../common/Theme.style'
import { getCartProductsQuantity } from '../redux/actions/actions'
import Toast from 'react-native-easy-toast'

class WebViewScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const backButton2 = navigation.getParam('backButton')
    const props = navigation.getParam('props1')
    const webViewState = navigation.getParam('webViewState')
    const iconColor = navigation.getParam('iconColor')
    const colorProps = navigation.getParam('colorProps')

    const headerTitle2 = navigation.getParam('headerTitle')
    return {
      headerTitle: headerTitle2,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'center',
      headerTintColor: iconColor,
      headerStyle: {
        backgroundColor: colorProps
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      headerLeft: () => (
        <Icon
          onPress={() => {
            if (props !== undefined) {
              if (webViewState.canGoBack) {
                backButton2.goBack()
              } else {
                props.props.navigation.pop()
              }
            }
          }}
          name={!I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
          style={{
            color: iconColor,
            fontSize: 25,
            padding: 5,
            paddingLeft: 16,
            paddingRight: 16,
            marginRight: 16
          }}
        />
      )
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      uri: this.props.navigation.state.params.url,
      spinnerTemp: false,
      canGoBack: false
    }
    this.toast = null
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language[
        'Place Your Order'
      ],
      props1: this,
      backButton: this.webview,
      iconColor: this.props.themeStyle.textColor,
      colorProps: this.props.themeStyle.primaryBackgroundColor

    })
  }

  /// //////////////////////////////////////////////
  _onNavigationStateChange = webViewState => {
    if (webViewState.url.indexOf('thankyou') !== -1) {
      this.props.getCartProductsQuantityFun(this)
      this.props.navigation.navigate('ThankUScreen')
    }

    this.props.navigation.setParams({
      backButton: this.webview,
      props1: this,
      webViewState
    })
    this.setState({
      canGoBack: webViewState.canGoBack,
      spinnerTemp: false
    })
  }

  /// ///////////////
  _refWebView = webview => {
    if (!webview) {
      return
    }
    this.webview = webview
  }

  /// /////////////////////////////////////////////////////
  render () {
    return this.state.uri === '' ? (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: this.props.themeStyle.primaryBackgroundColor
      }}>
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <NavigationEvents
          onDidFocus={() => {
            this.setState({})
          }}
        />
        <UIActivityIndicator
          size={27}
          color={this.props.themeStyle.primary}
        />
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: this.props.themeStyle.primaryBackgroundColor
        }}>
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <Spinner visible={this.state.spinnerTemp} />
        <NavigationEvents
          onDidFocus={() => {
            this.setState({})
          }}
        />
        <WebView
          ref={r => this._refWebView(r)}
          onLoadProgress={() => this.setState({ spinnerTemp: true })}
          onLoadEnd={() => this.setState({ spinnerTemp: false })}
          onNavigationStateChange={this._onNavigationStateChange}
          source={{ uri: this.state.uri }}
          style={{ marginTop: 0, flex: 1, width: Dimensions.get('window').width }}
        />
      </View>
    )
  }
}

const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getUserData = (state) => state.userData.user
const getSettings = (state) => state.settingsCall.settings
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  settings: getSettingsFun(state),
  userData: getUserDataFun(state)
})
const mapDispatchToProps = dispatch => ({
  getCartProductsQuantityFun: (th) => {
    dispatch(async dispatch => {
      await getCartProductsQuantity(dispatch, '', th,
        th.props.userData, false)
    })
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(WebViewScreen)
