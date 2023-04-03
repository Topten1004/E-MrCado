/* eslint-disable no-useless-escape */
import React, { PureComponent } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native'
import { createSelector } from 'reselect'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux'
import { appleAuth } from '@invertase/react-native-apple-authentication'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin'
import FBLoginButton from '../common/FBLoginButton'
import Spinner from 'react-native-loading-spinner-overlay'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import themeStyle, { appTextStyle } from '../common/Theme.style'
import {
  signUp,
  signIn,
  socialLogin
} from '../redux/actions/actions'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
class Login extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Login
    })
    GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      // iosClientId: '930506877678-469k3k9qcobe44ol761hevm4sa65mfqo.apps.googleusercontent.com', // only for iOS
      webClientId: themeStyle.webClientIdForGoogleSign, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // forceCodeForRefreshToken: true // [Android] related to `serverAuthCode`, read the docs link below *.

      // hostedDomain: '', // specifies a hosted domain restriction
      // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
      // accountName: '', // [Android] specifies an account name on the device that should be used
    })

    /**
     * subscribe to credential updates.This returns a function which can be used to remove the event listener
     * when the component unmounts.
     */

    if (Platform.OS === 'ios') {
      this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
        this.fetchAndUpdateCredentialState().catch(error =>
          this.setState({ credentialStateForUser: `Error: ${error.code}` })
        )
      })

      this.fetchAndUpdateCredentialState()
        .then(res => this.setState({ credentialStateForUser: res }))
        .catch(error => this.setState({ credentialStateForUser: `Error: ${error.code}` }))
    }
  }

  componentWillUnmount () {
    /**
     * cleans up event listener
     */
    if (Platform.OS === 'ios') { this.authCredentialListener() }
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      errorMessage: '',
      spinnerTemp: false,
      selectedTab: '1',
      checkBox: false,

      /// ////

      firstNameSignUp: '',
      lastNameSignUp: '',
      userNamesignUp: '',
      email: '',
      emailSignUp: '',
      passwordSignUp: '',
      confirmPasswordSignUp: '',
      errorMessageSignUp: '',
      emailSignIn: '',
      passwordSignIn: '',
      credentialStateForUser: -1
    }

    this.authCredentialListener = null
    this.user = null
    // if (Platform.OS === 'ios') {
    //   appleAuth.onCredentialRevoked(async () => {
    //   })
    // }
    this.toast = null
  }

  ///

  onAppleButtonPress = async () => {
    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
          appleAuth.Scope.EMAIL,
          appleAuth.Scope.FULL_NAME
        ]
      })

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */
      } = appleAuthRequestResponse

      this.user = newUser

      this.fetchAndUpdateCredentialState()
        .then(res => this.setState({ credentialStateForUser: res }))
        .catch(error =>
          this.setState({ credentialStateForUser: `Error: ${error.code}` })
        )

      if (identityToken) {
        this.createAccount(identityToken, 'apple')
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!")
      }
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.')
      } else {
        console.error(error)
      }
    }
  };

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      this.setState({ credentialStateForUser: 'N/A' })
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(this.user)
      if (credentialState === appleAuth.State.AUTHORIZED) {
        this.setState({ credentialStateForUser: 'AUTHORIZED' })
      } else {
        this.setState({ credentialStateForUser: credentialState })
      }
    }
  }

  //  onAppleButtonPress = async () => {
  //    // performs login request
  //    const appleAuthRequestResponse = await appleAuth.performRequest({
  //      requestedOperation: appleAuth.Operation.LOGIN,
  //      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
  //    })

  //    // get current authentication state for user
  //    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  //    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

  //    // use credentialState response to ensure the user is authenticated
  //    if (credentialState === appleAuth.State.AUTHORIZED) {

  //      const {
  //       user: newUser,
  //       email,
  //       nonce,
  //       identityToken,
  //       realUserStatus /* etc */,
  //     } = appleAuthRequestResponse;
  //      // user is authenticated
  //    }
  //  }

  // Somewhere in your code
  signInFun = () => {
    this.setState({
      spinnerTemp: true
    }, () => {
      this.props.signInCall(this.state.emailSignIn, this.state.passwordSignIn,
        this.props.sessionId,
        this)
    })
  };

      /// //////////////////////////////////////
      createAccount = async (info, type, h) => {
        var dat = {}
        var url = ''
        if (type === 'fb') {
          url = 'customer_login/facebook/callback'
          url += '?code=' + info + '&scope=public_profile&authuser=email&prompt=prompt&fromApp=1'
        } else if (type === 'phone') {
          url = 'phoneregistration'
          dat.phone = info
        } else if (type === 'google') {
          url = 'customer_login/google/callback'
          url += '?code=' + info + '&scope=public_profile&authuser=email&prompt=prompt&fromApp=1'
        } else if (type === 'apple') {
          url = 'customer_login/apple/callback'
          url += '?code=' + info + '&scope=public_profile&authuser=email&prompt=prompt&fromApp=1'
        }
        this.props.socialLoginCall(url, this)
        this.setState({ SpinnerTemp: false })
      }
      //

    // Somewhere in your code
    signInGoogle = async () => {
      try {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()
        const token = await GoogleSignin.getTokens()
        if (token.accessToken !== undefined) {
          this.createAccount(token.accessToken, 'google')
        }
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          Alert.alert(this.props.isLoading.Config.languageJson2['user cancelled the login flow'])
        } else if (error.code === statusCodes.IN_PROGRESS) {
          Alert.alert(this.props.isLoading.Config.languageJson2['operation (e.g. sign in) is in progress already'])
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          Alert.alert(this.props.isLoading.Config.languageJson2['play services not available or outdated'])
        } else {
          // some other error happened
        }
      }
    };

    /// ///////////////////////////////////////////////////
    createAccountSignUp () {
      this.setState({
        spinnerTemp: true

      }, () => {
        this.props.signUpCall(this.state.firstNameSignUp,
          this.state.lastNameSignUp,
          this.state.emailSignUp,
          this.state.passwordSignUp,
          this.state.confirmPasswordSignUp,
          this,
          this.props.sessionId
        )
      })
    }

    /// /////////////////////////////////////

    canBeSubmitted () {
      const { lastNameSignUp, firstNameSignUp, confirmPasswordSignUp, emailSignUp, passwordSignUp } = this.state
      return (
        lastNameSignUp.length > 0 &&
      firstNameSignUp.length > 0 &&

      this.EmailNumberCheckSignUp(emailSignUp) &&
      passwordSignUp.length >= 6 &&
      confirmPasswordSignUp === passwordSignUp
      )
    }

    canBeSubmittedSignIn () {
      const { emailSignIn, passwordSignIn } = this.state
      return (
        emailSignIn.length > 0 &&
      passwordSignIn.length >= 6 &&
      this.EmailNumberCheckSignUp(emailSignIn)
      )
    }

    EmailNumberCheckSignUp2 (text) {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return (
        (text.length === 0) || reg.test(text) === true
      )
    }

    EmailNumberCheckSignUp (text) {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return (
        reg.test(text) === true

      )
    }

    passLength (text) {
      return (
        text.length >= 6 || text.length === 0
      )
    }

    confirmPassword () {
      const { confirmPasswordSignUp, passwordSignUp } = this.state
      return (
        confirmPasswordSignUp === passwordSignUp || confirmPasswordSignUp.length === 0
      )
    }

    /// //////

    /// //////
    render () {
      const isEnabled = this.canBeSubmitted()
      const isEnableSignIn = this.canBeSubmittedSignIn()
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>
          <Toast
            ref={ref => { this.toast = ref }}
            style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
            position='top'
            positionValue={400}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: 15 }}
          />
          <View
            style={[styles.container, {
              backgroundColor: this.props.themeStyle.primaryBackgroundColor
            }]}>
            <TouchableOpacity
              style={styles.backIconView}
              onPress={() => {
                this.props.navigation.pop()
              }}
            >
              <Ionicons
                name={I18nManager.isRTL
                  ? 'chevron-forward-outline'
                  : 'chevron-back-outline'}
                style={[styles.backIconStyle, {
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.largeSize + 14
                }]}
              />
            </TouchableOpacity>

            <Spinner
              visible={this.state.spinnerTemp}
              textStyle={{
                backgroundColor: this.props.themeStyle.primary,
                color: this.props.themeStyle.primary
              }}
            />
            {this.state.selectedTab === '1'
              ? <Text style={{
                fontSize: appTextStyle.largeSize + 2,
                color: this.props.themeStyle.textColor,
                paddingTop: HEIGHT * 0.05,
                fontFamily: appTextStyle.fontFamily
              }}>{this.props.language['Welcome Back!']}</Text>
              : <Text style={{
                fontSize: appTextStyle.largeSize + 2,
                color: this.props.themeStyle.textColor,
                paddingTop: HEIGHT * 0.05,
                fontFamily: appTextStyle.fontFamily
              }}>{this.props.language['Create a new Account!']}</Text>
            }

            <View style={[styles.tabContainer, {
              borderBottomColor: this.props.themeStyle.primaryLight
            }]}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ selectedTab: '1' })
                }}
                style={[styles.tabText, {
                  borderBottomColor: this.state.selectedTab === '1' ? this.props.themeStyle.primary : 'transparent'
                }]}>
                <Text style={{
                  fontSize: appTextStyle.largeSize + 3,
                  fontFamily: appTextStyle.fontFamily,
                  color: this.state.selectedTab === '1' ? this.props.themeStyle.primary : this.props.themeStyle.iconPrimaryColor
                }}>{this.props.language.SignIn}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ selectedTab: '2' })
                }}
                style={[styles.tabText, {
                  borderBottomColor: this.state.selectedTab === '2' ? this.props.themeStyle.primary : 'transparent'
                }]}>
                <Text style={{
                  fontSize: appTextStyle.largeSize + 3,
                  fontFamily: appTextStyle.fontFamily,
                  color: this.state.selectedTab === '2' ? this.props.themeStyle.primary : this.props.themeStyle.iconPrimaryColor
                }}>{this.props.language.signUp}</Text>
              </TouchableOpacity>
            </View>

            <View
              style={styles.screenContainer}>
              {this.state.selectedTab === '2'
                ? <View
                  style={styles.screenInnerContainer}>
                  <View style={[styles.textInputContainer, {
                    borderColor: this.props.themeStyle.primaryLight
                  }]} >
                    <Ionicons
                      name={'person-outline'}
                      style={[styles.textInputIcon, {
                        color: this.props.themeStyle.textColor,
                        fontSize: appTextStyle.largeSize + 4
                      }]}
                    />
                    <TextInput
                      style={[styles.textInputStyle, {
                        color: this.props.themeStyle.textColor
                      }]}
                      placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                      selectionColor={this.props.themeStyle.iconPrimaryColor}
                      placeholder={
                        this.props.language['First Name']
                      }
                      onChangeText={firstNameSignUp =>
                        this.setState({ firstNameSignUp, errorMessageSignUp: '' })
                      }
                      value={this.state.firstNameSignUp}
                    />
                  </View>
                  <View style={[styles.textInputContainer, {
                    borderColor: this.props.themeStyle.primaryLight
                  }]} >
                    <Ionicons
                      name={'people-outline'}
                      style={[styles.textInputIcon, {
                        color: this.props.themeStyle.textColor,
                        fontSize: appTextStyle.largeSize + 4
                      }]}
                    />
                    <TextInput
                      style={[styles.textInputStyle, {
                        color: this.props.themeStyle.textColor
                      }]}
                      placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                      selectionColor={this.props.themeStyle.iconPrimaryColor}
                      placeholder={
                        this.props.language['Last Name']
                      }
                      onChangeText={lastNameSignUp =>
                        this.setState({ lastNameSignUp, errorMessageSignUp: '' })
                      }
                      value={this.state.lastNameSignUp}
                    />
                  </View>

                  <View style={[styles.containerTextinput, {
                    marginTop: 20,
                    borderColor: this.EmailNumberCheckSignUp2(this.state.emailSignUp) ? this.props.themeStyle.primaryLight : 'red'
                  }]} >
                    <Ionicons
                      name={'mail-outline'}
                      style={[styles.textInputIcon, {
                        color: this.props.themeStyle.textColor,
                        fontSize: appTextStyle.largeSize + 4
                      }]}
                    />
                    <TextInput
                      style={[styles.textInputStyle, {
                        color: this.props.themeStyle.textColor
                      }]}
                      secureTextEntry={false}
                      placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                      dataDetectorTypes={'address'}
                      selectionColor={this.props.themeStyle.iconPrimaryColor}
                      placeholder={this.props.language.Email}
                      onChangeText={emailSignUp => this.setState({ emailSignUp, errorMessageSignUp: '' })}
                      value={this.state.emailSignUp}
                    />

                  </View>
                  {!this.EmailNumberCheckSignUp2(this.state.emailSignUp) ? (
                    <Text
                      style={styles.validationText}>
                      {this.props.language['The email address is not valid']}
                    </Text>
                  ) : null}

                  <View style={[styles.containerTextinput, {

                    marginTop: !this.EmailNumberCheckSignUp2(this.state.emailSignUp) ? 0 : 20,
                    borderColor: !this.passLength(this.state.passwordSignUp) ? 'red' : this.props.themeStyle.primaryLight
                  }]} >
                    <Ionicons
                      name={'lock-closed-outline'}
                      style={[styles.textInputIcon, {
                        color: this.props.themeStyle.textColor,
                        fontSize: appTextStyle.largeSize + 4
                      }]}
                    />
                    <TextInput
                      style={[styles.textInputStyle, {
                        color: this.props.themeStyle.textColor
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

                  <View style={[styles.containerTextinput, {
                    marginTop: 20,
                    borderColor: !this.confirmPassword() ? 'red' : this.props.themeStyle.primaryLight

                  }]} >
                    <Ionicons
                      name={'lock-closed-outline'}
                      style={[styles.textInputIcon, {
                        color: this.props.themeStyle.textColor,
                        fontSize: appTextStyle.largeSize + 4
                      }]}
                    />
                    <TextInput
                      style={[styles.textInputStyle, {
                        color: this.props.themeStyle.textColor
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
                  {this.state.errorMessageSignUp !== '' ? (
                    <Text
                      style={{
                        marginTop: 15,
                        color:
                        this.state.errorMessageSignUp ===
                          'User Created. Login Using your Username & Password'
                          ? 'green'
                          : 'red',
                        fontFamily: appTextStyle.fontFamily
                      }}>
                      {this.state.errorMessageSignUp}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    disabled={!isEnabled}
                    onPress={() => this.createAccountSignUp()}>
                    <View
                      style={[styles.signUpView, {
                        opacity: !isEnabled ? 0.4 : 0.9,
                        backgroundColor: this.props.themeStyle.primary

                      }]}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: this.props.themeStyle.textTintColor,
                          fontSize: appTextStyle.largeSize + 3,
                          fontWeight: '500',
                          fontFamily: appTextStyle.fontFamily
                        }}>
                        {this.props.language.signUp}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <View style={[styles.textInputContainer, {
                    borderColor: this.EmailNumberCheckSignUp2(this.state.emailSignIn) ? this.props.themeStyle.primaryLight : 'red'
                  }]} >
                    <Ionicons
                      name={'mail-outline'}
                      style={[
                        styles.textInputIcon, {
                          color: this.props.themeStyle.textColor,
                          fontSize: appTextStyle.largeSize + 4,
                          borderColor: this.EmailNumberCheckSignUp2(this.state.emailSignIn) ? this.props.themeStyle.primaryLight : 'red',
                          borderBottomWidth: 1

                        }]}
                    />
                    <TextInput
                      style={[styles.textInputStyle, {
                        color: this.props.themeStyle.textColor
                      }]}
                      placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                      selectionColor={this.props.themeStyle.iconPrimaryColor}
                      placeholder={this.props.language.Emailcom}
                      onChangeText={emailSignIn =>
                        this.setState({ emailSignIn, errorMessage: '' })
                      }
                      value={this.state.emailSignIn}
                    />
                  </View>

                  {!this.EmailNumberCheckSignUp2(this.state.emailSignIn) ? (
                    <Text
                      style={styles.validationText}>
                      {this.props.language['The email address is not valid']}
                    </Text>
                  ) : null}

                  <View style={[styles.textInputContainer, {
                    borderColor: !this.passLength(this.state.passwordSignIn) ? 'red' : this.props.themeStyle.primaryLight
                  }]} >
                    <Ionicons
                      name={'lock-closed-outline'}
                      style={[styles.textInputIcon, {
                        color: this.props.themeStyle.textColor,
                        fontSize: appTextStyle.largeSize + 4
                      }]}
                    />
                    <TextInput
                      style={[styles.textInputStyle, {
                        color: this.props.themeStyle.textColor
                      }]}
                      placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                      secureTextEntry
                      selectionColor={this.props.themeStyle.iconPrimaryColor}
                      placeholder={this.props.language.Password}
                      onChangeText={passwordSignIn =>
                        this.setState({ passwordSignIn, errorMessage: '' })
                      }
                      value={this.state.passwordSignIn}
                    />
                  </View>
                  {!this.passLength(this.state.passwordSignIn) ? (
                    <Text
                      style={styles.validationText}>
                      {this.props.language.PasswordCharacters}
                    </Text>
                  ) : null}
                  {this.state.errorMessage !== '' ? (
                    <Text
                      style={{
                        marginTop: 18,
                        color: 'red',
                        fontFamily: appTextStyle.fontFamily
                      }}>
                      {this.state.errorMessage}
                    </Text>
                  ) : null}

                  <View style={styles.forgotRow}>

                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ChangePassScreen')
                      }}
                    >

                      <Text
                        style={{
                          fontSize: appTextStyle.mediumSize - 1,
                          fontWeight: '500',
                          color: this.props.themeStyle.iconPrimaryColor,
                          fontFamily: appTextStyle.fontFamily
                        }}>
                        {
                          this.props.language[
                            'Forgot your password?'
                          ]
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* : null} */}

                  <TouchableOpacity
                    disabled={!isEnableSignIn}
                    onPress={() => this.signInFun()}>
                    <View
                      style={[styles.signBtnView, {
                        backgroundColor: this.props.themeStyle.primary,
                        opacity: (!isEnableSignIn)
                          ? 0.4
                          : 0.9
                      }]}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: this.props.themeStyle.textTintColor,
                          fontSize: appTextStyle.largeSize + 3,
                          fontWeight: '500',
                          fontFamily: appTextStyle.fontFamily
                        }}>
                        {this.props.language.SignIn}
                      </Text>
                    </View>
                  </TouchableOpacity>

                </View>}
              <View style={styles.containerDevi}>
                <View style={[styles.childContainerView, {
                  backgroundColor: this.props.themeStyle.iconPrimaryColor
                }]} />
                <View>
                  <Text style={[styles.deviderText, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.iconPrimaryColor,
                    fontFamily: appTextStyle.fontFamily

                  }]}>{this.props.language['Or sign in with']}</Text>
                </View>
                <View style={[styles.childContainerView, {
                  backgroundColor: this.props.themeStyle.iconPrimaryColor
                }]} />
              </View>

              <View style={styles.socialLoginRow}>

                <FBLoginButton
                  onRef={ref => (this.parentReference = ref)}
                  parentReference={(a, s, d) =>
                    this.setState({ spinnerTemp: true }, () => {
                      this.createAccount(a, s, d)
                    })
                  }
                />

                <TouchableOpacity
                  onPress={this.signInGoogle}
                  // onPress={this.onAppleButtonPress}
                  style={styles.googleView}>
                  <FontAwesome
                    name={'google'}
                    style={styles.googleIcon}
                  />
                  <Text style={{
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.iconPrimaryColor,
                    paddingTop: 2,
                    fontFamily: appTextStyle.fontFamily
                  }}>{'google'}</Text>
                </TouchableOpacity>

                { Platform.OS === 'ios'
                  ? <TouchableOpacity
                    // onPress={this.signInGoogle}
                    onPress={this.onAppleButtonPress}
                    style={styles.googleView}>
                    <FontAwesome
                      name={'apple'}
                      style={[styles.googleIcon, { color: '#A2AAAD' }]}
                    />
                    <Text style={{
                      fontSize: appTextStyle.mediumSize,
                      color: this.props.themeStyle.iconPrimaryColor,
                      paddingTop: 2,
                      fontFamily: appTextStyle.fontFamily
                    }}>{'google'}</Text>
                  </TouchableOpacity>

                  : null }
              </View>
              <View style={styles.policyView}>
                <Text style={{
                  fontSize: appTextStyle.mediumSize,
                  color: this.props.themeStyle.iconPrimaryColor,
                  textAlign: 'center',
                  fontFamily: appTextStyle.fontFamily
                }}>{this.props.language['We keep your data safe. for further assistance please refer to our ']}
                  <Text
                    onPress={() => {
                      this.props.navigation.navigate('PrivacyPolicyScreen')
                    }}
                    style={{
                      fontSize: appTextStyle.mediumSize,
                      color: this.props.themeStyle.iconPrimaryColor,
                      textDecorationLine: 'underline',
                      textAlign: 'center',
                      fontFamily: appTextStyle.fontFamily
                    }}>{this.props.language['Privacy Policy']}</Text>

                </Text>

              </View>

            </View>
          </View>
        </ScrollView>
      )
    }
}
const mapDispatchToProps = dispatch => ({
  signUpCall: (firstNameSignUp, lastNameSignUp, emailSignUp, passwordSignUp, confirmPasswordSignUp
    , th, sessionId) => {
    dispatch(async dispatch => {
      await signUp(dispatch, firstNameSignUp, lastNameSignUp, emailSignUp, passwordSignUp, confirmPasswordSignUp, th,
        sessionId)
    })
  },
  signInCall: (emailSignIn, passwordSignIn, sessionId, th) => {
    dispatch(async dispatch => {
      await signIn(dispatch, emailSignIn, passwordSignIn, sessionId, th)
    })
  },
  socialLoginCall: (url, th) => {
    dispatch(async dispatch => {
      await socialLogin(dispatch, url, th)
    })
  }
})

const getTheme = (state) => state.appConfig.themeStyle
const getSessionId = (state) => state.userData.sessionId
const getSettings = (state) => state.settingsCall.settings

const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
const getSessionIdFun = createSelector(
  [getSessionId],
  (getSessionId) => {
    return getSessionId
  }
)
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const getLanguage = (state) => state.appConfig.languageJson
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  sessionId: getSessionIdFun(state),
  settings: getSettingsFun(state)

})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  policyView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 38,
    paddingBottom: 38,
    width: WIDTH * 0.7
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 1
  },
  validationText: {
    marginTop: 5,
    color: 'red',
    fontSize: appTextStyle.mediumSize,
    alignSelf: 'center',
    fontFamily: appTextStyle.fontFamily
  },
  googleView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabContainer: {
    justifyContent: 'space-around',
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingTop: HEIGHT * 0.05
  },
  tabText: {
    borderBottomWidth: 1,
    paddingBottom: 3
  },
  containerTextinput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1
  },
  socialIcon: {
    color: '#ffffff'
  },
  textInputStyle: {
    height: 38,
    width: WIDTH * 0.9,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 6,
    fontSize: appTextStyle.mediumSize + 1
  },
  signBtnView: {
    marginTop: 8,
    alignItems: 'center',
    height: 38,
    width: WIDTH * 0.9,
    justifyContent: 'center',
    borderRadius: appTextStyle.customRadius
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  screenInnerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  socialLoginRow: {
    flexDirection: 'row',
    width: WIDTH,
    justifyContent: 'space-evenly',
    marginBottom: 5
  },
  textInputIcon: {
    paddingHorizontal: 10,
    paddingLeft: 29,
    marginBottom: Platform.OS === 'android' ? 5 : 0
  },
  containerDevi: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%',
    marginBottom: '10%',
    width: '60%',
    alignSelf: 'center'
  },
  googleIcon: {
    color: '#dd4b39',
    fontSize: 40
  },
  forgotView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  forgotRow: {
    justifyContent: 'flex-end',
    width: WIDTH,
    padding: Platform.OS === 'android' ? 16 : 19,
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backIconView: {
    padding: 10,
    alignSelf: 'flex-start'
  },
  backIconStyle: {
    alignSelf: 'flex-start'
  },
  signUpView: {
    marginTop: 18,
    alignItems: 'center',
    height: 38,
    width: wp('90%'),
    borderRadius: appTextStyle.customRadius,
    justifyContent: 'center'
  },
  childContainerView: {
    flex: 1,
    height: 1
  },
  deviderText: {
    marginHorizontal: 12,
    textAlign: 'center'
  }

})
export default connect(mapStateToProps, mapDispatchToProps)(Login)
