import React, { PureComponent } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  I18nManager,
  StyleSheet,
  Dimensions
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { createSelector } from 'reselect'
import Toast from 'react-native-easy-toast'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import { appTextStyle } from '../common/Theme.style'
import { ForgotPasswordFun } from '../redux/actions/actions'

const WIDTH = Dimensions.get('window').width

class ForgotPassword extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      headerTitleAlign: 'center',
      headerTintColor: iconColor,
      headerStyle: {
        backgroundColor: colorProps,
        elevation: 0,
        borderBottomWidth: 0,
        shadowOpacity: 0
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 6
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language['Forgot Password'],
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      errorMessage: '',
      spinnerTemp: false,
      success: 0
    }
    this.toast = null
  }

  /// ///////////////////////////////////////
  forgetPassword = async () => {
    this.setState({ spinnerTemp: true })
    this.props.forgotPassCall(this, this.state.email)
  }

  EmailNumberCheck () {
    const { email } = this.state
    const reg = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
    return (
      (email.length > 0) && reg.test(this.state.email) === true
    )
  }

  render () {
    const isEnabled = this.EmailNumberCheck()
    return (
      <View
        style={[styles.container, {
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }]}>
        <Spinner
          visible={this.state.spinnerTemp}
          textStyle={{
            color: this.props.themeStyle.primary
          }}
        />

        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='bottom'
          positionValue={200}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <View style={[styles.containerTextinput, {
          marginTop: 10,
          backgroundColor: this.props.themeStyle.primaryBackgroundColor,
          borderColor: this.EmailNumberCheck() ? this.props.themeStyle.primaryLight : 'red'
        }]} >
          <Ionicons
            name={'mail-outline'}
            style={[styles.textInputIcon, {
              color: this.props.themeStyle.textColor,
              fontSize: appTextStyle.largeSize + 4
            }]}
          />
          <TextInput
            key={1}
            style={[styles.textInputStyle, {
              color: this.props.themeStyle.textColor
            }]}
            placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
            dataDetectorTypes={'address'}
            selectionColor={this.props.themeStyle.iconPrimaryColor}
            placeholder={this.props.language.Email}
            onChangeText={email => this.setState({ email, errorMessage: '' })}
            value={this.state.email}
          />

        </View>

        {!this.EmailNumberCheck() ? (
          <Text
            style={{
              marginTop: 5,
              color: 'red',
              fontSize: appTextStyle.mediumSize,
              fontFamily: appTextStyle.fontFamily
            }}>
            {this.props.language['The email address is not valid']}
          </Text>
        ) : null}

        <TouchableOpacity
          disabled={!isEnabled}
          onPress={() => this.forgetPassword()}>
          <View
            style={[styles.sendFunStyle, {
              backgroundColor: this.props.themeStyle.primary,
              opacity: !isEnabled ? 0.4 : 0.9
            }]}>
            <Text
              style={{
                textAlign: 'center',
                color: this.props.themeStyle.textTintColor,
                fontSize: appTextStyle.largeSize,
                fontFamily: appTextStyle.fontFamily
              }}>
              {this.props.language.Send}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson

const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state)
})

const mapDispatchToProps = dispatch => ({
  forgotPassCall: (th, email) => {
    dispatch(async dispatch => {
      await ForgotPasswordFun(dispatch, th, email)
    })
  }

})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  sendFunStyle: {
    marginTop: 15,
    alignItems: 'center',
    height: 38,
    width: wp('90%'),
    justifyContent: 'center',
    borderRadius: appTextStyle.customRadius
  },
  containerTextinput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1
  },
  textInputIcon: {
    paddingHorizontal: 10,
    paddingLeft: 29,
    marginBottom: Platform.OS === 'android' ? 5 : 0
  },
  textInputStyle: {
    height: 42,
    width: WIDTH * 0.9,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 6,
    fontSize: appTextStyle.mediumSize + 1
  }

})
