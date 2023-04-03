import React, { PureComponent } from 'react'
import {
  StyleSheet, // Renders text
  View,
  Dimensions,
  I18nManager,
  Platform,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { appConfigStyle, appTextStyle } from '../common/Theme.style'
import ShoppingCartIcon3 from '../common/ShoppingCartIcon3'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import { createSelector } from 'reselect'
const WIDTH = Dimensions.get('window').width
class Header extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }
  }

  render ({
    name, cartIcon, backIcon, navigation, menuIcon, shadow, showGrid = true,
    searchIcon
  } = this.props) {
    const parent = navigation.dangerouslyGetParent().state.index
    const routeName = navigation.state.routeName
    return (
      <View>
        <View style={[styles.headerView,
          {
            marginBottom: 0,
            backgroundColor: appConfigStyle.headerColor ? this.props.themeStyle.primary : this.props.themeStyle.primaryBackgroundColor
          }]}>
          {/* Left Top Bar (hamburger menu button or back button) */}
          <View>
            {(!menuIcon && backIcon && parent >= 0) ||
              routeName === 'CartScreen'
              ? <Icon
                onPress={() => {
                  navigation.goBack()
                }}
                name={!I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
                style={{
                  color: appConfigStyle.headerColor
                    ? this.props.themeStyle.textTintColor
                    : this.props.themeStyle.textColor,
                  fontSize: 24,
                  padding: 5,
                  paddingHorizontal: 0,
                  zIndex: 12,
                  marginTop: Platform.OS === 'ios' ? -12 : -19

                }}
              />
              : menuIcon ? null : < View style={{
                padding: 15,
                paddingHorizontal: 0,
                marginTop: -8

              }} />
            }
            {/* {(menuIcon && parent === 0 */}
            {(menuIcon && parent >= 0

              ? <TouchableOpacity
                style={{
                  marginTop: Platform.OS === 'ios' ? -14 : -22,
                  zIndex: 40
                }}
                onPress={() => { this.props.navigation.openDrawer() }}>

                {
                  appConfigStyle.headerMenuImage
                    ? <Image style={{ height: 28, width: 30, tintColor: '#fff' /* this.props.themeStyle.primary */ }}
                      source={require('../images/menu.png')}
                      onPress={() => { this.props.navigation.openDrawer() }}
                    />
                    : <Icon
                      onPress={() => {
                        this.props.navigation.openDrawer()
                      }}
                      name={'menu'}
                      style={{
                        color: appConfigStyle.headerColor
                          ? this.props.themeStyle.textTintColor
                          : this.props.themeStyle.textColor,
                        fontSize: 24,
                        padding: 5,
                        paddingHorizontal: 0

                      }}
                    />
                }
              </TouchableOpacity>
              : null)
            }
          </View>
          {/* Right Top Bar */}
          <View style={{
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 5
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: Platform.OS === 'ios' ? -12 : -22
            }}>
              {menuIcon
                ? appConfigStyle.headerSearchBar
                  ? <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('SearchScreen')
                    }}
                    style={[styles.iconStyle, {
                      backgroundColor: this.props.themeStyle.secondryBackgroundColor,
                      // width: !category ? WIDTH * 0.7 : WIDTH * 0.85
                      width: WIDTH * 0.7,
                      alignSelf: 'center',
                      marginTop: Platform.OS === 'android' ? -23 : -13,
                      paddingVertical: 6,
                      marginLeft: 9
                    }]}>
                    <Ionicons
                      name={'search'}
                      style={{ color: this.props.themeStyle.iconPrimaryColor, fontSize: 18 }}
                    />
                    <Text style={[styles.textinputStyle, {
                      // width: !category ? WIDTH * 0.6 : WIDTH * 0.75,
                      width: WIDTH * 0.6,
                      fontSize: appTextStyle.mediumSize,
                      color: this.props.themeStyle.iconPrimaryColor,
                      backgroundColor: this.props.themeStyle.secondryBackgroundColor
                    }]}>{this.props.language['What are you looking for?']}</Text>
                  </TouchableOpacity>
                  : appConfigStyle.homeTitle === '' ? <View
                    style={{
                      width: WIDTH,
                      position: 'absolute',
                      paddingBottom: Platform.OS === 'IOS' ? 6 : 4
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      key={0}
                      style={{
                        width: 70,
                        height: 30,
                        alignSelf: 'center'
                      }}
                      source={require('../images/header.png')}
                    />
                  </View>
                    : <View
                      style={{
                        width: 100,
                        alignItems: 'center',
                        flexDirection: 'row'
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        key={1}
                        style={{
                          width: 25,
                          height: 25
                        }}
                        source={require('../images/icon.png')}
                      />
                      <Text
                        style={{
                          fontSize: appTextStyle.largeSize + 2,
                          color: appConfigStyle.headerColor
                            ? this.props.themeStyle.textTintColor
                            : this.props.themeStyle.textColor,
                          fontWeight: 'bold',
                          width: WIDTH,
                          fontFamily: appTextStyle.fontFamily
                        }}>
                        {appConfigStyle.homeTitle}
                      </Text>
                    </View>
                : <Text
                  style={{
                    fontSize: appTextStyle.largeSize + 4,
                    color: appConfigStyle.headerColor
                      ? this.props.themeStyle.textTintColor
                      : this.props.themeStyle.textColor,
                    fontWeight: 'bold',
                    position: 'absolute',
                    width: WIDTH,
                    textAlign: 'center',
                    fontFamily: appTextStyle.fontFamily
                  }}>
                  {name}
                </Text>
              }
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: Platform.OS === 'ios' ? -12 : -22
            }}>
              <Text style={{
                fontSize: appTextStyle.largeSize,
                color: appConfigStyle.headerColor
                  ? this.props.themeStyle.textTintColor
                  : this.props.themeStyle.textColor
              }}>KD | عربي</Text>
              {showGrid &&
                <TouchableOpacity
                  style={{ paddingHorizontal: 14 }}
                  onPress={() => { console.log('') }}>
                  <Image
                    resizeMode="contain"
                    key={2}
                    style={{
                      width: 25,
                      height: 25
                    }}
                    source={require('../images/newImages/grid.png')}
                  />
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>
        { routeName.startsWith('Home') &&
          <View style={[styles.headerView,
            {
              paddingTop: 5,
              paddingLeft: 20,
              paddingRight: 30,
              paddingBottom: 10,
              backgroundColor: appConfigStyle.headerColor ? this.props.themeStyle.primary : this.props.themeStyle.primaryBackgroundColor
            }]}>
            <View style={{
              width: '100%',
              height: 24,
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <Text style={{
                color: 'white',
                backgroundColor: 'black',
                margin: 1,
                fontSize: 9,
                paddingHorizontal: 15,
                paddingVertical: 4
              }}>
                Categories
              </Text>
              <TouchableOpacity
                style={{
                  padding: 2,
                  backgroundColor: 'black',
                  margin: 1
                }}
                onPress={() => { this.props.navigation.navigate('SearchScreen') }}>
                <Icon
                  name={'search'}
                  style={{
                    color: appConfigStyle.headerColor
                      ? this.props.themeStyle.textTintColor
                      : this.props.themeStyle.textColor,
                    fontSize: 12,
                    margin: 3,
                    alignItems: 'center'
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
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
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state)
})
const getLanguage = (state) => state.appConfig.languageJson
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
export default connect(mapStateToProps, null)(Header)

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'android' ? 28 : 20,
    width: WIDTH,
    paddingBottom: 4,
    marginBottom: 2
  },
  iconStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: appTextStyle.customRadius - 3,
    padding: Platform.OS === 'ios' ? 3 : 0
  },
  textinputStyle: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0
  },
  innerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.80,
    borderRadius: appTextStyle.customRadius - 3,
    padding: Platform.OS === 'ios' ? 3 : 0
  },
  shadowStyle: {
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  }
})
