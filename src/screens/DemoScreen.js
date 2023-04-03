import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  I18nManager,
  Image,
  ScrollView,
  Platform
} from 'react-native'
import { createSelector } from 'reselect'
import { UIActivityIndicator } from 'react-native-indicators'
import { connect } from 'react-redux'
import {
  setModeValue, setThemeColor, LANG_CODE, CLEAR_LANGUAGES, getLanguages, SET_LANGUAGE, SET_LANGUAGE_ID,
  SET_CURRENCY_ID, getCurrency, SET_CURRENCY, CLEAR_CURRENCY, SET_BANNER_STYLE, SET_HOME_STYLE, SET_CARD_STYLE, SET_CATEGORY_STYLE
} from '../redux/actions/actions'
import Toast from 'react-native-easy-toast'
import Spinner from 'react-native-loading-spinner-overlay'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { appDarkTheme, appLightTheme, appTextStyle } from '../common/Theme.style'
import SyncStorage from 'sync-storage'
import RNRestart from 'react-native-restart'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import Image2 from 'react-native-scalable-image'
import { NavigationEvents } from 'react-navigation'
import { ListItem, CheckBox, Body } from 'native-base'

const WIDTH = Dimensions.get('window').width
const colors = [
  {
    primary: '#47a9ff',
    primary2: 'rgb(236, 63, 52',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#ffffff',
    secondry: '#ffc854'
  },
  {
    primary: '#44b3ff',
    primary2: 'rgb(68, 179, 255',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#3c9ee0',
    secondry: '#57bbff'
  },
  {
    primary: '#fcad8e',
    primary2: 'rgb(252, 173, 142',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#de987d',
    secondry: '#fcb599'
  },
  {
    primary: '#ff8ea6',
    primary2: 'rgb(255, 142, 166',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#e07d92',
    secondry: '#ff99af'
  },
  {
    primary: '#9546fe',
    primary2: 'rgb(149, 70, 254)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#833ee0',
    secondry: '#a059fe'
  },
  {
    primary: '#a6633c',
    primary2: 'rgb(166, 99, 60)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#925735',
    secondry: '#af7350'
  },
  {
    primary: '#3ca68d',
    primary2: 'rgb(60, 166, 141)',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#35927c',
    secondry: '#50af98'
  },
  {
    primary: '#3c51a6',
    primary2: 'rgb(60, 81, 166)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#354792',
    secondry: '#5062af'
  },
  {
    primary: '#726dff',
    primary2: 'rgb(114, 109, 255)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#6460e0',
    secondry: '#807cff'
  },
  {
    primary: '#bf04a0',
    primary2: 'rgb(191, 4, 160)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#a8048d',
    secondry: '#c51daa'
  },
  {
    primary: '#9437ff',
    primary2: 'rgb(148, 55, 255)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#8230e0',
    secondry: '#9f4bff'
  },
  {
    primary: '#76d6ff',
    primary2: 'rgb(118, 214, 255)',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#68bce0',
    secondry: '#84daff'
  },
  {
    primary: '#ff6d6d',
    primary2: 'rgb(255, 109, 109)',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#e06060',
    secondry: '#ff7c7c'
  },
  {
    primary: '#b3182a',
    primary2: 'rgb(179, 24, 42)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#9e1525',
    secondry: '#bb2f3f'
  },
  {
    primary: '#3980ff',
    primary2: 'rgb(81, 104, 143)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#0055cb',
    secondry: '#7dafff'
  },
  {
    primary: '#483a6f',
    primary2: 'rgb(72, 58, 111)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#3f3362',
    secondry: '#5a4e7d'
  },
  {
    primary: '#621529',
    primary2: 'rgb(98, 21, 41)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#561224',
    secondry: '#722c3e'
  }
]
class RewardPoints extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
      headerForceInset: { top: 'never', vertical: 'never' }
    }
  }

  getListOfLanguage = () => {
    for (const val of this.props.getLanguagesArray) {
      if (val.language_name === this.props.getSelectedlang.language_name) {
        this.state.tick[val.language_name] = true
      }
    }
    this.setState({
      isLoading: false,
      tick: this.state.tick
    })
  }

  async componentDidMount () {
    this.props.clearLanguagesFun()
    this.props.getLanguageCall(this)
    this.props.clearCurrencyFun()
    this.props.getCurrencyCall(this)
    this.props.navigation.setParams({
      headerTitle: this.props.language.Settings,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      languages: '',
      selectedLanguage: '',
      translate: '',
      prviousLanguageId: 0,
      temp: 0,
      tick: [],
      isLoading: true,
      spinnerTemp: false,

      currency: {},
      currencyList: [],
      currentCurrencySymbol: SyncStorage.get('currencyCode'),
      temp2: 0,
      isLoading2: true,
      bannerStyle: 1
    }
    this.toast = null
    this.state.tick[SyncStorage.get('langId')] = true
  }

  /// //////////////////////////////////////////
  updateCurrency (item) {
    this.props.setCurrencyIdFun(item.currency_id,
      item.decimal_place,
      item.symbol,
      item.symbol_position,
      item.code)
    this.props.setSelectedCurrency(item)
  }

  updateLanguage (item) {
    this.props.setLanguageIdFun(item.id)
    this.props.setLanguageCodeFun(item.code)
    if (item.direction === 'rtl') {
      I18nManager.forceRTL(true)
    } else {
      I18nManager.forceRTL(false)
    }
    this.props.getTranslationData(item, this)
  }

  toggleSwitch2 = value => {
    if (value) {
      this.props.setModeValue(value)
    } else
    if (this.props.isDarkMode) {
      this.props.setModeValue(value)
    }
    this.props.navigation.pop()
  }

  headerFun (text) {
    return (
      <View
        style={{
          width: WIDTH,
          backgroundColor: this.props.themeStyle.primary,
          marginTop: 15,
          marginBottom: 15,
          alignItems: 'flex-start'
        }}>
        <Text
          style={{
            color: this.props.themeStyle.textTintColor,
            padding: 10,
            fontSize: appTextStyle.largeSize + 3,
            fontFamily: appTextStyle.fontFamily
          }}>
          {text}
        </Text>
      </View>
    )
  }

  bannerFun (id, src) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.changeBanners(id.toString(), this)
          this.props.navigation.pop()
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: this.props.settings.banner_style === id ? 0.5 : 1
        }}>
        <Image
          key={0}
          style={{ width: WIDTH * 0.8, height: 200 }}
          loadingStyle={{
            size: 'large',
            color: this.props.themeStyle.primary
          }}
          resizeMode={'cover'}
          placeholder={false}
          ActivityIndicator={true}
          placeholderStyle={{ width: 0, height: 0 }}
          source={src}
        />
      </TouchableOpacity>
    )
  }

  homeFun2 (id) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.changeHome(id.toString(), this)
          this.props.navigation.pop()
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: this.props.settings.home_style === id ? 1 : 0,
          borderColor: this.props.themeStyle.primary,
          margin: 22,
          backgroundColor: this.props.themeStyle.secondryBackgroundColor,
          padding: 50,
          paddingHorizontal: 60,
          borderRadius: 5,
          shadowOffset: {
            width: 0,
            height: 6
          },
          shadowColor: '#000',
          shadowOpacity: 0.1,
          elevation: 2
        }}>
        <Text style={{
          fontSize: appTextStyle.largeSize,
          color: this.props.themeStyle.textColor,
          fontFamily: appTextStyle.fontFamily
        }}>
          {id}
        </Text>

      </TouchableOpacity>
    )
  }

  categoryFun (id, src) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.changeCategory(id, this)
          this.props.navigation.pop()
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: this.props.settings.category_style === id ? 1 : 0,
          borderColor: this.props.themeStyle.primary,
          marginTop: 28
        }}>
        <Image
          key={0}
          style={{ width: WIDTH * 0.8, height: 400 }}
          loadingStyle={{
            size: 'large',
            color: this.props.themeStyle.primary
          }}
          resizeMode={'contain'}
          placeholder={false}
          ActivityIndicator={true}
          placeholderStyle={{ width: 0, height: 0 }}
          source={src}
        />
      </TouchableOpacity>
    )
  }

  cardStyleFun (id, src) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.changeCardS(id.toString(), this)
          this.props.navigation.pop()
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: this.props.settings.card_style.toString() === id.toString() ? 2 : 0,
          margin: 5,
          borderColor: this.props.themeStyle.primary
        }}>
        <Image2
          resizeMode={'contain'}
          width={Dimensions.get('window').width * 0.47}
          source={src}
        />
      </TouchableOpacity>
    )
  }

  themeChangeFun (item) {
    /// /////////////////////////
    const lightThemeTemp = {
      StatusBarColor: appLightTheme.StatusBarColor,
      barStyle: appLightTheme.barStyle, // dark-content, default
      primary: item.primary,
      cardTextColor: appLightTheme.cardTextColor,
      primaryLight: appLightTheme.primaryLight,
      primaryBackgroundColor: appLightTheme.primaryBackgroundColor, // 2b2024
      secondryBackgroundColor: appLightTheme.secondryBackgroundColor, // full black
      textColor: appLightTheme.textColor,
      secondryTextColor: appLightTheme.secondryTextColor,
      primaryTextColor: appLightTheme.primaryTextColor,
      secondry: item.secondry,
      textTintColor: appLightTheme.textTintColor,
      iconPrimaryColor: appLightTheme.iconPrimaryColor,
      iconSecondryColor: appLightTheme.iconSecondryColor
    }

    const darkThemeTemp = {
      StatusBarColor: appDarkTheme.StatusBarColor,
      barStyle: appDarkTheme.barStyle, // dark-content, default
      primary: item.primary,
      cardTextColor: appDarkTheme.cardTextColor,
      primaryLight: appDarkTheme.primaryLight,
      primaryBackgroundColor: appDarkTheme.primaryBackgroundColor, // 2b2024
      secondryBackgroundColor: appDarkTheme.secondryBackgroundColor, // full black
      textColor: appDarkTheme.textColor,
      secondryTextColor: appDarkTheme.secondryTextColor,
      primaryTextColor: appDarkTheme.primaryTextColor,
      secondry: item.secondry,
      textTintColor: appLightTheme.textTintColor,
      iconPrimaryColor: appDarkTheme.iconPrimaryColor,
      iconSecondryColor: appDarkTheme.iconSecondryColor
    }
    this.props.setThemeColor(lightThemeTemp, darkThemeTemp)
  }

  render () {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>
        <NavigationEvents
          onDidFocus={() => {
            this.setState({})
          }}
        />
        <Spinner visible={this.state.spinnerTemp} />
        {this.headerFun(
          this.props.language['Change App Theme']
        )}
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          listKey={(item, index) => `C${index.toString()}`}
          contentContainerStyle={{
            backgroundColor: '#c1c1c1',
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            alignContent: 'center',
            padding: 8,
            width: WIDTH
          }}

          data={colors}
          numColumns={6}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={item => (
            <TouchableOpacity
              onPress={() => this.themeChangeFun(item.item)}
              style={{
                backgroundColor: item.item.primary,
                height: 50,
                width: 50,
                margin: 10,
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 5,
                marginTop: 5,
                borderWidth: 4,
                borderColor:
                  item.item.primary === this.props.themeStyle.primary
                    ? this.props.themeStyle.primaryBackgroundColor
                    : 'transparent'
              }}></TouchableOpacity>
          )} />
        {this.headerFun(
          this.props.language['Chose Color Mode']
        )}
        <View
          style={{
            flexDirection: 'row',
            width: WIDTH,
            justifyContent: 'space-evenly',
            alignItems: 'center'
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              backgroundColor: '#c1c1c1',
              borderRadius: 12,
              padding: 3
            }}>
            <TouchableOpacity
              onPress={() => this.toggleSwitch2(true)}
              style={{
                width: WIDTH * 0.45,
                backgroundColor:
                  this.props.isDarkMode
                    ? this.props.themeStyle.secondryBackgroundColor
                    : '#c1c1c1',
                height: 135,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowOffset: {
                  width:
                    !this.props.isDarkMode
                      ? 0
                      : 1,
                  height: !SyncStorage.get('bottom') ? 0 : 1
                },
                shadowColor: '#c1c1c1',
                shadowOpacity:
                  !this.props.isDarkMode
                    ? 0
                    : 0.5,
                elevation:
                  !this.props.isDarkMode
                    ? 0
                    : 3
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons
                  style={{
                    color: this.props.themeStyle.textColor,
                    fontSize: 34,
                    marginBottom: 2
                  }}
                  active
                  name='paint-brush'
                />
                <Text
                  style={{
                    color: this.props.themeStyle.textColor,
                    fontWeight: 'bold',
                    fontSize: appTextStyle.largeSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>
                  {this.props.language['Dark Mode']}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleSwitch2(false)}
              style={{
                width: WIDTH * 0.45,
                backgroundColor:
                  !this.props.isDarkMode
                    ? '#fdfdfd'
                    : '#c1c1c1',
                height: 135,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowOffset: {
                  width:
                    this.props.isDarkMode
                      ? 0
                      : 1,
                  height:
                    this.props.isDarkMode ? 0 : 1
                },
                shadowColor: '#c1c1c1',
                shadowOpacity:
                  this.props.isDarkMode
                    ? 0
                    : 0.5,
                elevation:
                  this.props.isDarkMode
                    ? 0
                    : 3
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons
                  style={{
                    color: this.props.themeStyle.textColor,
                    fontSize: 34,
                    marginBottom: 2
                  }}
                  active
                  name='paint-brush'
                />
                <Text
                  style={{
                    color: this.props.themeStyle.textColor,
                    fontWeight: 'bold',
                    fontSize: appTextStyle.largeSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>
                  {this.props.language['Light Mode']}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {this.headerFun(
          this.props.language['Multi Language']
        )}

        {this.props.getLanguagesArray.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: this.props.themeStyle.primaryBackgroundColor
            }}>
            <UIActivityIndicator
              size={27}
              color={this.props.themeStyle.primary}
            />
          </View>
        ) : (
          <FlatList
            style={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}
            data={this.props.getLanguagesArray}
            horizontal={false}
            extraData={this.state || this.props}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
              <View
                style={{ marginRight: '4%', marginBottom: 1, marginTop: -10 }}>
                <ListItem>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ spinnerTemp: true }, () =>
                        this.updateLanguage(item.item)
                      )
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 7 }}>

                    <Body>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: appTextStyle.largeSize,
                          color: this.props.themeStyle.textColor,
                          marginRight: 10,
                          marginLeft: 10,
                          fontFamily: appTextStyle.fontFamily
                        }}>
                        {item.item.language_name}
                      </Text>
                    </Body>
                    <CheckBox
                      color={this.props.themeStyle.primary}
                      onPress={() => {
                        this.setState({ spinnerTemp: true }, () =>
                          this.updateLanguage(item.item)
                        )
                      }}
                      checked={this.props.getSelectedlang.code === item.item.code}
                    />
                  </TouchableOpacity>
                </ListItem>
              </View>
            )}
          />
        )}
        {this.headerFun(
          this.props.language['Multi Currency']
        )}
        {this.props.currency.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: this.props.themeStyle.primaryBackgroundColor
            }}>
            <UIActivityIndicator
              size={27}
              color={this.props.themeStyle.primary}
            />
          </View>
        ) : (
          <FlatList
            data={this.props.currency}
            horizontal={false}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
              <View
                style={{ marginRight: '4%', marginBottom: 10, marginTop: 0 }}>
                <ListItem>
                  <TouchableOpacity
                    onPress={() => this.updateCurrency(item.item)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Body>
                      {item.item.symbol !== '' &&
                        item.item.symbol !== null &&
                        item.item.symbol !== undefined ? (
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: appTextStyle.largeSize,
                              color: this.props.themeStyle.textColor,
                              marginRight: 10,
                              marginLeft: 10,
                              fontFamily: appTextStyle.fontFamily
                            }}>
                            {item.item.title + '(' + item.item.symbol + ')'}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: appTextStyle.largeSize,
                              color: this.props.themeStyle.textColor,
                              marginRight: 10,
                              marginLeft: 10,
                              fontFamily: appTextStyle.fontFamily
                            }}>
                            {item.item.title + '(' + item.item.code + ')'}
                          </Text>
                        )}
                    </Body>
                    <CheckBox
                      onPress={() => this.updateCurrency(item.item)}
                      color={this.props.themeStyle.primary}
                      checked={this.props.settings.currency_id.toString() === item.item.currency_id.toString()}
                    />
                  </TouchableOpacity>
                </ListItem>
              </View>
            )}
          />
        )}

        {this.headerFun(
          this.props.language['Home Style']
        )}
        <View style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {this.homeFun2('1')}
          {this.homeFun2('2')}
          {this.homeFun2('3')}
          {this.homeFun2('4')}
          {this.homeFun2('5')}
          {this.homeFun2('6')}
          {this.homeFun2('7')}
          {this.homeFun2('8')}
          {this.homeFun2('9')}
        </View>

        {/* {this.homeFun2('10', require('../images/home_style/hs10.png'))} */}

         {this.headerFun(
          this.props.language['Category Style']
        )}

        {this.categoryFun('1', require('../images/category_style/cat1.png'))}
        {this.categoryFun('2', require('../images/category_style/cat2.png'))}
        {this.categoryFun('3', require('../images/category_style/cat3.png'))}
        {this.categoryFun('4', require('../images/category_style/cat4.png'))}
        {this.categoryFun('5', require('../images/category_style/cat5.png'))}
        {this.categoryFun('6', require('../images/category_style/cat6.png'))}

        {this.headerFun(
          this.props.language['Product Card Styles']
        )}
        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          listKey={(item, index) => `C${index.toString()}`}
          contentContainerStyle={{
            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            alignContent: 'center',
            flexGrow: 1
          }}
          data={[
            require('../images/cardStyles/rcard1.png'),
            require('../images/cardStyles/rcard2.png'),
            require('../images/cardStyles/rcard3.png'),
            require('../images/cardStyles/rcard7.png'),
            require('../images/cardStyles/rcard11.png'),
            require('../images/cardStyles/rcard19.png'),
            require('../images/cardStyles/rcard13.png'),
            require('../images/cardStyles/rcard20.png'),
            require('../images/cardStyles/rcard23.png'),
            require('../images/cardStyles/rcard27.png'),
            require('../images/cardStyles/rcard28.png'),
            require('../images/cardStyles/rcard12.png'),
            require('../images/cardStyles/rcard24.png'),
            require('../images/cardStyles/rcard13.png'),
            require('../images/cardStyles/rcard18.png'),
            require('../images/cardStyles/rcard21.png'),
            require('../images/cardStyles/rcard25.png'),
            require('../images/cardStyles/rcard8.png'),
            require('../images/cardStyles/rcard15.png'),
            require('../images/cardStyles/rcard17.png'),

            require('../images/cardStyles/rcard22.png'),
            require('../images/cardStyles/rcard4.png'),

            require('../images/cardStyles/rcard5.png'),
            require('../images/cardStyles/rcard9.png'),

            require('../images/cardStyles/rcard6.png'),
            require('../images/cardStyles/rcard16.png'),
            require('../images/cardStyles/rcard10.png'),
            require('../images/cardStyles/rcard26.png')
          ]}
          numColumns={2}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={item =>
            this.cardStyleFun(item.index + 1, item.item)
          }></FlatList>
      </ScrollView>
    )
  }
}
/// ///////////////////////////////////////
const mapDispatchToProps = dispatch => ({
  getCurrencyCall: (th) => {
    dispatch(async dispatch => {
      await getCurrency(dispatch, th)
    })
  },
  setCurrencyIdFun: (value,
    currencyDecimals,
    currencySymbol,
    currencyPos,
    currencyCode) => {
    dispatch({
      type: SET_CURRENCY_ID,
      value: value,
      currencyDecimals: currencyDecimals,
      currencySymbol: currencySymbol,
      currencyPos: currencyPos,
      currencyCode: currencyCode
    })
  },
  setSelectedCurrency: (data) => {
    dispatch(dispatch => {
      dispatch({
        type: SET_CURRENCY,
        payload: data
      })
      setTimeout(() => {
        RNRestart.Restart()
      }, 1000)
    })
  },
  setLanguageIdFun: (value) => {
    dispatch({
      type: SET_LANGUAGE_ID,
      value: value
    })
  },
  setLanguageCodeFun: (value) => {
    dispatch({
      type: LANG_CODE,
      value: value
    })
  },
  clearLanguagesFun: (value) => {
    dispatch({
      type: CLEAR_LANGUAGES,
      value: value
    })
  },
  clearCurrencyFun: (value) => {
    dispatch({
      type: CLEAR_CURRENCY,
      value: value
    })
  },
  getLanguageCall: (th) => {
    dispatch(async dispatch => {
      await getLanguages(dispatch, th)
    })
  },
  setModeValue: (id) => dispatch(setModeValue(id)),
  setThemeColor: (lightTheme, darkTheme) => dispatch(setThemeColor(lightTheme, darkTheme)),
  getTranslationData: (data, t) => {
    dispatch(dispatch => {
      t.setState({ spinnerTemp: false })
      dispatch({
        type: SET_LANGUAGE,
        payload: data
      })
      setTimeout(() => {
        RNRestart.Restart()
      }, 1000)
    })
  },
  changeBanners: (id) => {
    dispatch(async dispatch => {
      dispatch({
        type: SET_BANNER_STYLE,
        payload: id
      })
    })
  },
  changeHome: (id) => {
    dispatch(async dispatch => {
      dispatch({
        type: SET_HOME_STYLE,
        payload: id
      })
    })
  },
  changeCategory: (id) => {
    dispatch(async dispatch => {
      dispatch({
        type: SET_CATEGORY_STYLE,
        payload: id
      })
    })
  },
  changeCardS: (id) => {
    dispatch(async dispatch => {
      dispatch({
        type: SET_CARD_STYLE,
        payload: id
      })
    })
  }
})
/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getSettings = (state) => state.settingsCall.settings
const getLanguagesArray = (state) => state.languagesData.languages
const getCurrencysArray = (state) => state.currencyData.currency

const getSelectedlangArray = (state) => state.languagesData.selectedlang

const getSelectedCurrencyArray = (state) => state.currencyData.selectedCurrency

const getSelectedCurrencyArrayFun = createSelector(
  [getSelectedCurrencyArray],
  (getSelectedCurrencyArray) => {
    return getSelectedCurrencyArray
  }
)

const getCurrencysArrayFun = createSelector(
  [getCurrencysArray],
  (getCurrencysArray) => {
    return getCurrencysArray
  }
)

const getSelectedlangArrayFun = createSelector(
  [getSelectedlangArray],
  (getSelectedlangArray) => {
    return getSelectedlangArray
  }
)

const getLanguagesArrayFun = createSelector(
  [getLanguagesArray],
  (getLanguagesArray) => {
    return getLanguagesArray
  }
)

const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
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
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  isDarkMode: state.appConfig.isDarkMode,
  language: getLanguageFun(state),
  settings: getSettingsFun(state),
  getLanguagesArray: getLanguagesArrayFun(state),
  getSelectedlang: getSelectedlangArrayFun(state),
  currency: getCurrencysArrayFun(state),
  selectedCurrency: getSelectedCurrencyArrayFun(state)

})

export default connect(mapStateToProps, mapDispatchToProps)(RewardPoints)
