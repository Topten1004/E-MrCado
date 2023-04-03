import React, { PureComponent } from 'react'
import Home1Screen from './homeScreens/Home1Screen'
import Home2Screen from './homeScreens/Home2Screen'
import Home3Screen from './homeScreens/Home3Screen'
import Home4Screen from './homeScreens/Home4Screen'
import Home5Screen from './homeScreens/Home5Screen'
import Home6Screen from './homeScreens/Home6Screen'
import Home7Screen from './homeScreens/Home7Screen'
import Home8Screen from './homeScreens/Home8Screen'
import Home9Screen from './homeScreens/Home9Screen'

import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { CardStyleInterpolators } from 'react-navigation-stack'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import MenuIcon from '../common/MenuIcon'
import { Platform } from 'react-native'
import { appTextStyle } from '../common/Theme.style'
class Home extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {

      headerLeft: () => <MenuIcon navigation={navigation} />,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitle: headerStyle,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
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
      drawerLockMode: 'locked-closed',
      gestureEnabled: false,
      swipeEnabled: false
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Home,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  render () {
    // return <Home1Screen settings={this.props.settings} navigation={this.props.navigation} />
    return this.props.settings.home_style === '1' ? (
      <Home1Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '2' ? (
      <Home2Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '3' ? (
      <Home3Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '4' ? (
      <Home4Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '5' ? (
      <Home5Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '6' ? (
      <Home6Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '7' ? (
      <Home7Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '8' ? (
      <Home8Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '9' ? (
      <Home9Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : this.props.settings.home_style === '10' ? (
      <Home9Screen settings={this.props.settings} navigation={this.props.navigation} />
    ) : (
      <Home1Screen settings={this.props.settings} navigation={this.props.navigation} />
    )
  }
}

const getSettings = (state) => state.settingsCall.settings
const getLanguage = (state) => state.appConfig.languageJson
const getTheme = (state) => state.appConfig.themeStyle
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
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
  language: getLanguageFun(state),
  settings: getSettingsFun(state),
  themeStyle: getThemeFun(state)

})
export default connect(mapStateToProps, null)(Home)
