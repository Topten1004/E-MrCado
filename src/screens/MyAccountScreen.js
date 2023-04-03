import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform, ScrollView,
  StyleSheet
} from 'react-native'
import { createSelector } from 'reselect'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { getUrl, putHttp } from '../common/WooComFetch'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
import Spinner from 'react-native-loading-spinner-overlay'
import { appTextStyle } from '../common/Theme.style'
import Ionicons from 'react-native-vector-icons/Ionicons'
const WIDTH = Dimensions.get('window').width
class CreateAccount extends Component {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'center',
      headerTintColor: iconColor,
      headerStyle: {
        backgroundColor: colorProps,
        elevation: 0,
        borderBottomWidth: 0,
        shadowOpacity: 0
      },
      headerLeft: () => <Ionicons
        onPress={() => { navigation.pop() }}
        name={I18nManager.isRTL
          ? 'chevron-forward-outline'
          : 'chevron-back-outline'}
        style={{
          color: iconColor,
          fontSize: appTextStyle.largeSize + 14,
          alignSelf: 'flex-start'
        }}
      />,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 6,
        color: iconColor
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      gestureEnabled: false
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language['Edit Profile'],
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      spinnerTemp: false,
      firstName: this.props.userData.first_name,
      lastName: this.props.userData.last_name,
      userNamesignUp: '',
      email: '',
      emailSignUp: '',
      passwordSignUp: '',
      confirmPasswordSignUp: '',
      errorMessageSignUp: '',
      emailSignIn: '',
      passwordSignIn: ''
    }
    this.toast = null
  }

  /// ///////////////////////////////////////////////////

  updateInfo = async () => {
    this.setState({ spinnerTemp: true })
    const data = {}
    data.first_name = this.state.firstName
    data.last_name = this.state.lastName
    data.password_confirmation = this.state.confirmPasswordSignUp
    data.password = this.state.passwordSignUp
    const json = await putHttp(getUrl() + 'profile/' + this.props.userData.id, data)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        this.setState({
          password_confirmation: '',
          password: '',
          spinnerTemp: false
        }, () => {
          this.toast.show(json.data.message)
        })
      } else {
        this.toast.show(json.data.message)
        this.setState({
          spinnerTemp: false
        })
      }
    } else {
      this.toast.show(json.data.data.message)
      this.setState({
        spinnerTemp: false
      })
    }
  }
  /// ///////////////////////////////////////////////////

  passLength (text) {
    return (
      text.length >= 6 || text.length === 0
    )
  }

  confirmPassword () {
    const { confirmPasswordSignUp, passwordSignUp } = this.state
    return (
      confirmPasswordSignUp === passwordSignUp && confirmPasswordSignUp.length > 0
    )
  }

  /// //////
  render () {
    return (
      <ScrollView style={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>
        <View
          style={[styles.container, {
            backgroundColor: this.props.themeStyle.primaryBackgroundColor
          }]}>
          <Spinner
            visible={this.state.spinnerTemp}
          />
          <Toast
            ref={ref => { this.toast = ref }}
            style={styles.toastStyle}
            position='bottom'
            positionValue={600}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.mediumSize }}
          />
          <View
            style={styles.innerContainer}>
            <Text
              style={[styles.headingText, {
                color: this.props.themeStyle.textColor
              }]}>
              {'* ' + this.props.language['First Name']}
            </Text>
            <View style={[styles.textInputContainer, {
              borderColor: this.props.themeStyle.primaryLight
            }]} >

              <TextInput
                style={[styles.textInputStyle, {
                  color: this.props.themeStyle.textColor
                }]}
                placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                selectionColor={this.props.themeStyle.iconPrimaryColor}
                placeholder={
                  this.props.language['First Name']
                }
                onChangeText={firstName =>
                  this.setState({ firstName, errorMessageSignUp: '' })
                }
                value={this.state.firstName}
              />
            </View>
            <Text
              style={[styles.headingText, {
                color: this.props.themeStyle.textColor
              }]}>
              {'* ' + this.props.language['Last Name']}
            </Text>
            <View style={[styles.textInputContainer, {
              borderColor: this.props.themeStyle.primaryLight
            }]} >

              <TextInput
                style={[styles.textInputStyle, {
                  color: this.props.themeStyle.textColor
                }]}
                placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                selectionColor={this.props.themeStyle.iconPrimaryColor}
                placeholder={
                  this.props.language['Last Name']
                }
                onChangeText={lastName =>
                  this.setState({ lastName, errorMessageSignUp: '' })
                }
                value={this.state.lastName}
              />
            </View>

            <Text
              style={[styles.headingText, {
                color: this.props.themeStyle.textColor
              }]}>
              {'* ' + this.props.language.Password}
            </Text>
            <View style={[styles.containerTextinput, {
              borderWidth: !this.passLength(this.state.passwordSignUp) ? 1 : 2,
              marginTop: 10,
              borderColor: !this.passLength(this.state.passwordSignUp) ? 'red' : this.props.themeStyle.primaryLight
            }]} >

              <TextInput
                style={[styles.textInputStyle, {
                  color: this.props.themeStyle.textColor,
                  paddingBottom: Platform.OS === 'ios' ? 0 : 9
                }]}
                placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                secureTextEntry
                selectionColor={this.props.themeStyle.iconPrimaryColor}
                placeholder={this.props.language.PasswordCharacters}
                onChangeText={passwordSignUp =>
                  this.setState({ passwordSignUp, errorMessageSignUp: '' })
                }
                value={this.state.passwordSignUp}
              />
            </View>

            {!this.passLength(this.state.passwordSignUp) ? (
              <Text
                style={styles.validationText}>
                {this.props.language.PasswordCharacters}
              </Text>
            ) : null}
            <Text
              style={[styles.headingText, {
                color: this.props.themeStyle.textColor
              }]}>
              {'* ' + this.props.language['Confirm Password']}
            </Text>
            <View style={[styles.containerTextinput, {
              marginTop: 10,
              borderWidth: !this.confirmPassword() ? 1 : 2,
              borderColor: !this.confirmPassword() ? 'red' : this.props.themeStyle.primaryLight

            }]} >

              <TextInput
                style={[styles.textInputStyle, {
                  color: this.props.themeStyle.textColor,
                  paddingBottom: Platform.OS === 'ios' ? 0 : 9

                }]}
                placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                secureTextEntry
                selectionColor={this.props.themeStyle.iconPrimaryColor}
                placeholder={this.props.language['Confirm Password']}
                onChangeText={confirmPasswordSignUp =>
                  this.setState({ confirmPasswordSignUp, errorMessageSignUp: '' })
                }
                value={this.state.confirmPasswordSignUp}
              />
            </View>

            {!this.confirmPassword() ? (
              <Text
                style={styles.validationText}>
                {this.props.language['New password and confirm password must be same']}
              </Text>
            ) : null}

            <TouchableOpacity onPress={() =>
              (this.state.firstName.length > 0 &&
                      this.state.lastName.length > 0 &&
                      !this.confirmPassword())
                ? null : this.updateInfo()}>
              <View
                style={[styles.btnStyle, {
                  backgroundColor: this.props.themeStyle.primary,
                  opacity:
                    this.state.firstName.length > 0 &&
                      this.state.lastName.length > 0 &&
                      !this.confirmPassword()
                      ? 0.4
                      : 0.9
                }]}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: this.props.themeStyle.textTintColor,
                    fontSize: appTextStyle.mediumSize,
                    fontWeight: '500',
                    fontFamily: appTextStyle.fontFamily
                  }}>
                  {this.props.language.Update}
                </Text>
              </View>
            </TouchableOpacity>

            {this.state.errorMessage !== '' ? (
              <Text
                style={{
                  marginTop: 18,
                  color: this.state.success !== '1' ? 'red' : 'green',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {this.state.errorMessage}
              </Text>
            ) : null}

          </View>
        </View>
      </ScrollView>
    )
  }
}

const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)

const getLanguage = (state) => state.appConfig.languageJson
const getUserData = (state) => state.userData.user
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
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  userData: getUserDataFun(state)

})
const styles = StyleSheet.create({
  btnStyle: {
    marginTop: 18,
    alignItems: 'center',
    height: 38,
    borderRadius: appTextStyle.customRadius,
    width: WIDTH * 0.9,
    justifyContent: 'center'
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  toastStyle: {
    backgroundColor: '#c1c1c1'
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 8
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  validationText: {
    marginTop: 5,
    color: 'red',
    fontSize: appTextStyle.mediumSize,
    alignSelf: 'center',
    fontFamily: appTextStyle.fontFamily
  },
  headingText: {
    fontSize: appTextStyle.mediumSize,
    alignSelf: 'flex-start',
    fontFamily: appTextStyle.fontFamily,
    marginTop: 15
  },
  containerTextinput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8
  },
  textInputStyle: {
    height: 34,
    width: WIDTH * 0.9,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 6,
    fontSize: appTextStyle.mediumSize + 1
  },
  textInputIcon: {
    paddingHorizontal: 10,
    paddingLeft: 29,
    marginBottom: Platform.OS === 'android' ? 5 : 0
  }
})
export default connect(mapStateToProps, null)(CreateAccount)
