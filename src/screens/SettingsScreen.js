/* eslint-disable no-unused-expressions */
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Switch,
  Dimensions,
  Platform,
  I18nManager,
  SafeAreaView,
  Modal,
  Image
} from 'react-native'
import Toast from 'react-native-easy-toast'
import { createSelector } from 'reselect'
import {
  setModeValue,
  logOut
} from '../redux/actions/actions'
import ImageLoad from '../common/RnImagePlaceH'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { NavigationEvents } from 'react-navigation'
import { appConfigStyle, appTextStyle } from '../common/Theme.style'
import RateUsButton from './RateUs'
import { Icon } from 'native-base'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import FontIcon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import SyncStorage from 'sync-storage'
import ShoppingCartIcon from '../common/ShoppingCartIcon1'
import Spinner from 'react-native-loading-spinner-overlay'
import { ScrollView } from 'react-native-gesture-handler'
import {
  LoginManager,
  AccessToken,
  GraphRequestManager,
  GraphRequest
} from 'react-native-fbsdk'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
class CreateAccount extends Component {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerTitle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerTitle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerLeft: () => <TouchableOpacity onPress={navigation.getParam('setModalFun')}>
        <Ionicons
          name={'settings-outline'}
          style={{
            color: iconColor,
            fontSize: appTextStyle.largeSize + 4,
            padding: 10
          }}
        />
      </TouchableOpacity>,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: colorProps,
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0 // remove shadow on iOS
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 2,
        color: iconColor
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      gestureEnabled: false
    }
  }

  /// /////////////////////////////////////////////////////////

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.appConfig.languageJson.Account,
      colorProps: this.props.themeStyle.primary,
      iconColor: this.props.themeStyle.textTintColor,
      setModalFun: this.setModal
    })
  }

  setModal = () => {
    this.setState({ isModalVisible: true })
  };

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      errorMessage: '',
      spinnerTemp: false,
      switch1Value: false,
      switch2Value: false,
      isModalVisible: false
    }
    this.toast = null
  }

  /// ////////////////////////////////////////////////////
  toggleSwitch1 = value => {
    this.props.setModeValue(!this.props.isDarkMode)
    this.setState({ isModalVisible: false }, () => {
      this.props.navigation.navigate('Home')
    })
  }
  /// /////////////////////////////////////////

  signOut = async () => {
    try {
      await GoogleSignin.signOut()
      await GoogleSignin.revokeAccess()
    } catch (error) {
      console.log(error)
    }
  };

  checkShareComponent = (heading, points, icon, backColor, borderColor) => (
    <TouchableOpacity style={{
      width: WIDTH * 0.45,
      backgroundColor: backColor,
      flexDirection: 'row',
      borderRadius: 4,
      margin: 8,
      padding: 5,
      paddingHorizontal: 0,
      borderWidth: 1,
      borderColor: borderColor
    }}>

      <View style={{ padding: 18 }}>
        <Text
          style={{
            color: '#000',
            fontSize: appTextStyle.mediumSize,
            fontFamily: appTextStyle.fontFamily,
            paddingBottom: 6
          }}>
          {heading}
        </Text>

        <Text style={{
          color: this.props.themeStyle.primary,
          fontSize: appTextStyle.smallSize - 1,
          fontFamily: appTextStyle.fontFamily
        }}>
          {points}
        </Text>
      </View>

      <View style={{
        backgroundColor: borderColor,
        padding: 12,
        alignSelf: 'center',
        borderRadius: 30,
        right: 10,
        position: 'absolute'
      }}>
        <Image style={{ height: 28, width: 30 }}
          source={icon}
        />
      </View>

    </TouchableOpacity>
  )

  pointsComponent = (value, text) => (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{
        textAlign: 'center',
        color: this.props.themeStyle.textTintColor,
        fontSize: this.props.language.Wallat === text
          ? appTextStyle.largeSize + 8
          : appTextStyle.largeSize + 3,
        fontFamily: appTextStyle.fontFamily
      }}>
        {this.props.language.Wallat === text
          ? this.props.settings.currency_symbol + value : value}
      </Text>
      <Text style={{
        textAlign: 'center',
        color: this.props.themeStyle.textTintColor,
        fontSize: appTextStyle.smallSize,
        fontFamily: appTextStyle.fontFamily
      }}>
        {text}
      </Text>
    </View>
  )

  /// ////////////////////////////////////////////
  categoryFun (text, iconName, nav, font, borderWidth) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: 0,
            paddingBottom: 0,
            paddingTop: 0,
            width: WIDTH * 0.94,
            alignSelf: 'center'
          }}>
          {nav === 'rate1' ? (
            <RateUsButton
              text={text}
              iconName={iconName}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onPress={() => {
                text ===
                  this.props.isLoading.appConfig.languageJson['Official Website']
                  ? Linking.openURL(nav)
                  : text !==
                    this.props.isLoading.appConfig.languageJson[
                      'Dark Mode'
                    ] &&
                    text !==
                    this.props.isLoading.appConfig.languageJson[
                      'Light Mode'
                    ] ? this.setState({
                      isModalVisible: false
                    }, () => {
                      this.props.navigation.navigate(nav)
                    }) : null
              }}>
              <View style={styles.tabComponents}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{
                    fontSize: appTextStyle.mediumSize + 1,
                    fontFamily: appTextStyle.fontFamily,
                    color: this.props.themeStyle.textColor
                  }}>{text}</Text>
                </View>

                {text ===
                  this.props.isLoading.appConfig.languageJson[
                    'Dark Mode'
                  ] ? (
                    <View style={{ marginLeft: 60, position: 'absolute', right: 0 }}>
                      <Switch
                        thumbColor={this.props.themeStyle.primary}
                        style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
                        onValueChange={() => this.toggleSwitch1(false)}
                        value={this.state.switch1Value}
                      />
                    </View>
                  ) : text ===
                  this.props.isLoading.appConfig.languageJson[
                    'Light Mode'
                  ] ? (
                      <View style={{ marginLeft: 60, position: 'absolute', right: 0 }}>
                        <Switch
                          thumbColor={this.props.themeStyle.primary}
                          style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
                          onValueChange={() => this.toggleSwitch1(true)}
                          value={this.state.switch2Value}
                        />
                      </View>
                    ) : (
                      <Ionicons
                        name={I18nManager.isRTL ? 'chevron-back-outline' : 'chevron-forward-outline'}
                        style={{
                          color: this.props.themeStyle.iconPrimaryColor,
                          fontSize: appTextStyle.largeSize
                        }}
                      />
                    )}
              </View>
            </TouchableOpacity>
          )}
        </View>
        {!borderWidth
          ? <View
            style={{
              width: WIDTH * 0.9299,
              height: 1,
              backgroundColor: this.props.themeStyle.primary
            }}
          /> : null}
      </View>
    )
  }

  /// /////////////////////////////////////////////
  render () {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }}>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Toast
            ref={ref => { this.toast = ref }}
            style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
            position='top'
            positionValue={400}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: 15 }}
          />
          <Modal onRequestClose={() => {
            this.setState({
              isModalVisible: false
            })
          }} visible={this.state.isModalVisible} animationType={'fade'}>

            <SafeAreaView style={[styles.modalContainer, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: WIDTH
              }}>

                <TouchableOpacity style={{
                  zIndex: 12
                }} onPress={() => this.setState({
                  isModalVisible: false
                })}>
                  <Ionicons
                    name={'close'}
                    style={{
                      color: this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 6,
                      padding: 15
                    }}
                  />
                </TouchableOpacity>
                <Text style={{
                  fontSize: appTextStyle.largeSize + 2,
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.textColor,
                  alignSelf: 'center',
                  position: 'absolute',
                  width: WIDTH,
                  textAlign: 'center',
                  fontWeight: 'bold'

                }}>
                  {
                    this.props.isLoading.appConfig.languageJson.Settings
                  }
                </Text>
              </View>

              <View style={{
                borderRadius: appTextStyle.customRadius,
                backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                width: WIDTH * 0.93,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: this.props.themeStyle.primary
              }}>

                {this.categoryFun(!this.props.isDarkMode
                  ? this.props.isLoading.appConfig.languageJson[
                    'Dark Mode'
                  ] : this.props.isLoading.appConfig.languageJson[
                    'Light Mode'
                  ],
                'globe',
                'LanguageScreen'
                )}

                {this.categoryFun(
                  this.props.isLoading.appConfig.languageJson['Select Language'],
                  'globe',
                  'LanguageScreen'
                )}
                {this.categoryFun(
                  this.props.isLoading.appConfig.languageJson['Select Currency'],
                  'logo-usd',
                  'CurrencyScreen'
                )}
                {this.categoryFun(
                  this.props.isLoading.appConfig.languageJson['About Us'],
                  'md-albums',
                  'AboutScreen'
                )}
                {this.categoryFun(
                  this.props.isLoading.appConfig.languageJson['Privacy Policy'],
                  'cart',
                  'PrivacyPolicyScreen'
                )
                }
                {this.categoryFun(
                  this.props.isLoading.appConfig.languageJson['Term and Services'],
                  'md-call',
                  'TermAndServiceScreen'
                )}

                {this.categoryFun(
                  this.props.isLoading.appConfig.languageJson['Refund Policy'],
                  'md-albums',
                  'RefundPolicy'
                )}

                {this.categoryFun(
                  this.props.isLoading.appConfig.languageJson['Contact Us'],
                  'md-call',
                  'ContactUsScreen',
                  false,
                  true
                )}
              </View>

              {this.props.userData !== undefined

                ? Object.keys(this.props.userData).length !== 0
                  ? (
                    <TouchableOpacity
                      style={{
                        paddingTop: 25,
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: appTextStyle.customRadius
                      }}
                      onPress={() => {
                        this.setState({
                          spinnerTemp: true,
                          isModalVisible: false
                        }, () => {
                          this.props.logOutCall(this)
                          let currentAccessToken = ''
                          AccessToken.getCurrentAccessToken()
                            .then(data => {
                              currentAccessToken = data.accessToken.toString()
                            })
                            .then(() => {
                              const logout = new GraphRequest(
                                'me/permissions/',
                                {
                                  accessToken: currentAccessToken,
                                  httpMethod: 'DELETE'
                                },
                                error => {
                                  if (error) {
                                  } else {
                                    LoginManager.logOut()
                                  }
                                }
                              )
                              new GraphRequestManager().addRequest(logout).start()
                            })
                            .catch(() => {
                            })
                          this.signOut()
                        })
                      }}
                    >
                      <View
                        style={{
                          alignItems: 'center',
                          width: WIDTH * 0.93,
                          backgroundColor: this.props.themeStyle.primary,
                          justifyContent: 'center',
                          borderRadius: appTextStyle.customRadius

                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontFamily: appTextStyle.fontFamily,
                            fontSize: appTextStyle.largeSize,
                            color: this.props.themeStyle.textTintColor,
                            padding: 10
                          }}>
                          {this.props.isLoading.appConfig.languageJson['Log Out']}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null : null}
            </SafeAreaView>
          </Modal>
          <View
            style={{
              flex: 1,
              backgroundColor: this.props.themeStyle.secondryBackgroundColor,
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 30
            }}>
            <Spinner
              visible={this.state.spinnerTemp}
              textStyle={styles.spinnerTextStyle}
            />
            <NavigationEvents
              onDidFocus={() => {
                this.setState({})
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: this.props.themeStyle.primary,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <TouchableOpacity
                onPress={() => {
                  SyncStorage.set('cartScreen', 0)
                  if (
                    SyncStorage.get('customerData') !== '' &&
                    !SyncStorage.get('gustLogin')) { } else {
                    this.props.navigation.navigate('LOGIN', {
                      updateCart: () => this.setState({})
                    })
                  }
                }}>
                <View
                  style={{
                    height: 100,
                    width: WIDTH,
                    backgroundColor: this.props.themeStyle.primary
                  }} >
                  <View style={styles.textImageContainer}>
                    <ImageLoad
                      key={0}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 30
                      }}

                      source={require('../images/avatar.png')}
                      borderRadius={50 / 2}
                    />
                    <View>

                      <TouchableOpacity
                        onPress={() => {
                          if (Object.keys(this.props.userData).length === 0) { this.props.navigation.navigate('LOGIN') }
                        }}>
                        <Text style={{
                          fontSize: appTextStyle.largeSize + 2,
                          fontFamily: appTextStyle.fontFamily,
                          fontWeight: '600',
                          color: this.props.themeStyle.textTintColor,
                          paddingTop: 0,
                          marginLeft: 15
                        }}>

                          {
                            this.props.userData !== undefined

                              ? Object.keys(this.props.userData).length === 0
                                ? this.props.isLoading.appConfig.languageJson[
                                  'Login & Register'
                                ] : this.props.userData.first_name + ' ' +
                                this.props.userData.last_name : this.props.isLoading.appConfig.languageJson[
                                'Login & Register'
                              ]
                          }
                        </Text>

                      </TouchableOpacity>

                    </View>
                  </View>
                </View>

                {/* <View style={{
                  marginBottom: 40,
                  width: WIDTH,
                  flexDirection: 'row',
                  justifyContent: 'space-around'

                }}>
                  {
                    this.pointsComponent('0', this.props.language.Rewards)
                  }
                  {
                    this.pointsComponent('0.00', this.props.language.Wallat)
                  }
                  {
                    this.pointsComponent('0', this.props.language.Points)
                  }
                </View> */}
              </TouchableOpacity>

            </View>

            {/* <View style={{
              backgroundColor: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
              width: '94%',
              height: HEIGHT * 0.11,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -HEIGHT * 0.03,
              borderRadius: 4
            }}>

              <View style={{
                flexDirection: 'row',
                width: '92%',
                justifyContent: 'space-between',
                padding: 5,
                paddingTop: 0,
                alignItems: 'center',
                marginTop: -HEIGHT * 0.01
              }}>
                <Text style={{
                  color: '#d8ac4e',
                  fontSize: appTextStyle.smallSize,
                  fontFamily: appTextStyle.fontFamily
                }}>membership benifits</Text>
                <FontIcon
                  name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                  style={{
                    color: '#d8ac4e',
                    fontSize: appTextStyle.mediumSize - 5
                  }}
                />
              </View>

              <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}>
                <View>
                  <Text style={{
                    color: '#d8ac4e',
                    fontSize: appTextStyle.largeSize,
                    fontFamily: appTextStyle.fontFamily,
                    fontWeight: 'bold'

                  }}>New Member Git</Text>
                  <Text style={{
                    paddingTop: 4,
                    color: '#d8ac4e',
                    fontSize: appTextStyle.largeSize,
                    fontFamily: appTextStyle.fontFamily,
                    fontWeight: 'bold'
                  }}>5% OFF</Text>
                </View>
                <View>
                  <Text style={{
                    color: '#d8ac4e',
                    fontSize: appTextStyle.largeSize,
                    fontFamily: appTextStyle.fontFamily,
                    fontWeight: 'bold'
                  }}>Birthday Gift Item</Text>
                  <Text style={{
                    paddingTop: 4,
                    color: '#d8ac4e',
                    fontSize: appTextStyle.largeSize,
                    fontFamily: appTextStyle.fontFamily,
                    fontWeight: 'bold'
                  }}>5% OFF</Text>
                </View>

              </View>

            </View> */}

            {/* ///////////////////////////// */}
            {/* <View style={{ flexDirection: 'row', margin: 10 }}>
              {this.checkShareComponent('Check In', 'Claim your 20 points', require('../images/calender.png'), '#ffe9a5', '#ffdf8c')}
              {this.checkShareComponent('Share', 'Up to $1000 wallet', require('../images/gift.png'), '#d7f2fe', '#addafa')}
            </View> */}

            {/* ///////////////////////////// */}

            <View style={{
              backgroundColor: appConfigStyle.settingsPageColor ? '#eaf3de'
                : this.props.themeStyle.primaryBackgroundColor,
              width: '94%',
              height: HEIGHT * 0.1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              marginTop: 16,
              borderWidth: appConfigStyle.settingsPageColor ? 1 : 0,
              borderColor: '#afdf93',
              paddingTop: Platform.OS === 'android' ? '12%' : '10%',

              shadowOffset: { width: 1, height: 1 },
              shadowColor: '#000',
              shadowOpacity: appConfigStyle.settingsPageColor ? 0 : 0.2,
              elevation: appConfigStyle.settingsPageColor ? 0 : 2
            }}>

              <TouchableOpacity
                onPress={() => {
                  if (Object.keys(this.props.userData).length !== 0) {
                    this.props.navigation.navigate('MyOrdersScreen', {
                      selectedTab: '1'
                    })
                  } else {
                    this.props.navigation.navigate('LOGIN')
                  }
                }}
                style={{
                  flexDirection: 'row',
                  width: '92%',
                  justifyContent: 'space-between',
                  padding: 5,
                  paddingTop: 0,
                  alignItems: 'center',
                  marginTop: Platform.OS === 'android' ? -45 : -42,
                  marginBottom: '2%'
                }}>
                <Text style={{
                  color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontFamily: appTextStyle.fontFamily
                }}>{this.props.language['My Orders']}</Text>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.smallSize,
                    fontFamily: appTextStyle.fontFamily,
                    paddingLeft: 5,
                    paddingRight: 5
                  }}>{this.props.language['View All']}</Text>

                  <FontIcon
                    name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.mediumSize - 5
                    }}
                  />
                </View>
              </TouchableOpacity>

              <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}>
                <TouchableOpacity
                  onPress={() => {
                    if (Object.keys(this.props.userData).length !== 0) {
                      this.props.navigation.navigate('MyOrdersScreen', {
                        selectedTab: '1'
                      })
                    } else {
                      this.props.navigation.navigate('LOGIN')
                    }
                  }}style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons
                    name={'cube-outline'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 16
                    }}
                  />
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>{this.props.language.InProgress}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (Object.keys(this.props.userData).length !== 0) {
                      this.props.navigation.navigate('MyOrdersScreen', {
                        selectedTab: '2'
                      })
                    } else {
                      this.props.navigation.navigate('LOGIN')
                    }
                  }}
                  style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons
                    name={'airplane-outline'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 16
                    }}
                  />
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>{this.props.language.Delivered}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (Object.keys(this.props.userData).length !== 0) {
                      this.props.navigation.navigate('MyOrdersScreen', {
                        selectedTab: '3'
                      })
                    } else {
                      this.props.navigation.navigate('LOGIN')
                    }
                  }}
                  style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons
                    name={'chatbox-ellipses-outline'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 16
                    }}
                  />
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>{this.props.language.Reviews}</Text>
                </TouchableOpacity>

              </View>

            </View>

            <View height={1} />
            {/* {Object.keys(this.props.userData).length !== 0
              ?  */}
            <View style={{
              width: '94%',
              borderRadius: 4,
              height: Platform.OS === 'android' ? HEIGHT * 0.3 : HEIGHT * 0.26, // for two rows              // height: HEIGHT * 0.1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '3%',
              paddingTop: Platform.OS === 'android' ? '16%' : '13%',
              backgroundColor: appConfigStyle.settingsPageColor ? '#fbe5e2'
                : this.props.themeStyle.primaryBackgroundColor,
              borderWidth: appConfigStyle.settingsPageColor ? 1 : 0,
              borderColor: '#ffd8d2',

              shadowOffset: { width: 1, height: 1 },
              shadowColor: '#000',
              shadowOpacity: appConfigStyle.settingsPageColor ? 0 : 0.2,
              elevation: appConfigStyle.settingsPageColor ? 0 : 2
            }}>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  width: '92%',
                  justifyContent: 'space-between',
                  padding: 5,
                  paddingTop: 0,
                  alignItems: 'center',
                  marginTop: Platform.OS === 'android' ? -52 : -42,
                  marginBottom: 5
                }}>
                <Text style={{
                  color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontFamily: appTextStyle.fontFamily
                }}>{this.props.language['Help & info']}</Text>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.smallSize,
                    fontFamily: appTextStyle.fontFamily,
                    paddingLeft: 5,
                    paddingRight: 5
                  }}></Text>
                </View>
              </TouchableOpacity>

              <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: '4%',
                marginLeft: 10
              }}>
                <TouchableOpacity
                  onPress={() => {
                    if (Object.keys(this.props.userData).length !== 0) { this.props.navigation.navigate('MyAccountScreen') } else {
                      this.props.navigation.navigate('LOGIN')
                    }
                  }}
                  style={{ justifyContent: 'center', alignItems: 'center' }}>

                  <Ionicons
                    name={'md-call-outline'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 12,
                      alignSelf: 'center',
                      paddingVertical: 1
                    }}
                  />
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>{this.props.isLoading.appConfig.languageJson['Edit Profile']}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 9
                }}
                onPress={() => {
                  if (Object.keys(this.props.userData).length !== 0) { this.props.navigation.navigate('AdressesScreen') } else {
                    this.props.navigation.navigate('LOGIN')
                  }
                }}>
                  <Ionicons
                    name={'location-outline'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 12,
                      alignSelf: 'center',
                      paddingVertical: 1
                    }}
                  />
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>{this.props.isLoading.appConfig.languageJson.Address}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    if (Object.keys(this.props.userData).length !== 0) { this.props.navigation.navigate('RewardPoints') } else {
                      this.props.navigation.navigate('LOGIN')
                    }
                  }}>
                  <Ionicons
                    name={'gift-outline'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 12,
                      alignSelf: 'center',
                      paddingVertical: 1
                    }}
                  />
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>{this.props.isLoading.appConfig.languageJson['Reward Points']}</Text>
                </TouchableOpacity>

              </View>
              <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: 12
              }}>
                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    if (Object.keys(this.props.userData).length !== 0) { this.props.navigation.navigate('ContactUsScreen') } else {
                      this.props.navigation.navigate('LOGIN')
                    }
                  }}>
                  <Ionicons
                    name={'chatbox-outline'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 12,
                      alignSelf: 'center',
                      paddingVertical: 1
                    }}
                  />
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>{this.props.isLoading.appConfig.languageJson['Contact Us']}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 2,
                    marginBottom: 9
                  }}>
                  <RateUsButton
                    text={'text'}
                    iconName={'md-star-half'}
                    iconColor= {appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor}
                  />

                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 0,
                    marginBottom: 18

                  }}>
                  <ShoppingCartIcon iconColor= {appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor} navigation={this.props.navigation} />

                </TouchableOpacity>
              </View>

              <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: 12,
                paddingHorizontal: 46
              }}>
                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    if (Object.keys(this.props.userData).length !== 0) { this.props.navigation.navigate('WalletScreen') } else {
                      this.props.navigation.navigate('LOGIN')
                    }
                  }}>
                  <Ionicons
                    name={'wallet-outline'}
                    style={{
                      color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                      fontSize: appTextStyle.largeSize + 12,
                      alignSelf: 'center',
                      paddingVertical: 1
                    }}
                  />
                  <Text style={{
                    color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>{this.props.isLoading.appConfig.languageJson['Wallet']}</Text>
                </TouchableOpacity>

              </View>
            </View>

          </View>

        </ScrollView>

      </View>
    )
  }
}

const getTheme = (state) => state.appConfig.themeStyle
const getUserData = (state) => state.userData.user
const getLanguage = (state) => state.appConfig.languageJson
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
/// ///////////////////////////////////////////////
const mapStateToProps = state => {
  return {
    themeStyle: getThemeFun(state),
    userData: getUserDataFun(state),
    isLoading: state,
    isDarkMode: state.appConfig.isDarkMode,
    language: getLanguageFun(state),
    settings: getSettingsFun(state)

  }
}
const mapDispatchToProps = dispatch => ({
  logOutCall: (th) => {
    dispatch(async dispatch => {
      await logOut(dispatch, th)
    })
  },
  setModeValue: (id) => dispatch(setModeValue(id))
})
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount)

const styles = StyleSheet.create({
  textImageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: WIDTH,
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    padding: 15,
    paddingTop: 20,
    flexDirection: 'row'
  },
  modalContainer: {
    flex: 1
  },
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  }
})
