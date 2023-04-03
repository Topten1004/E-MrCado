import Rate, { AndroidMarket } from 'react-native-rate'
import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  Dimensions
} from 'react-native'
import { createSelector } from 'reselect'
import { Icon } from 'native-base'
import { connect } from 'react-redux'
import { appConfigStyle, appTextStyle } from '../common/Theme.style'
const WIDTH = Dimensions.get('window').width

class rateUs extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      rated: false
    }
  }

  render () {
    return <TouchableOpacity
      activeOpacity={0.8}
      style={styles.categoryView}
      onPress={() => {
        const options = {
          AppleAppID: '', // your apple app id When you create an app in iTunes Connect, you get a number that is around 10 digits long.
          GooglePackageName: '', // example com.themescoder.com
          AmazonPackageName: '', // example com.themescoder.com
          OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
          preferredAndroidMarket: AndroidMarket.Google,
          preferInApp: false,
          openAppStoreIfInAppFails: true,
          fallbackPlatformURL: 'http://www.mywebsite.com/myapp.html'
        }
        Rate.rate(options, success => {
          if (success) {
            this.setState({ rated: true })
          }
        })
      }}>
      <View
        style={[
          styles.rateView,
          Platform.OS === 'android' ? styles.iconContainer : null
        ]}>
        <Icon
          name={this.props.iconName}
          style={{
            color: this.props.iconColor
              ? this.props.iconColor : this.props.themeStyle.textTintColor,
            fontSize: 23,
            paddingBottom: 1
          }}
        />
        { this.props.iconColor
          ? <Text style={{
            color: appConfigStyle.settingsPageColor ? '#444444' : this.props.themeStyle.textColor,
            fontSize: appTextStyle.mediumSize,
            fontFamily: appTextStyle.fontFamily
          }}>{this.props.language['Rate Us']}</Text> : null }
      </View>
    </TouchableOpacity>
  }
}
const getLanguage = (state) => state.appConfig.languageJson
const getTheme = (state) => state.appConfig.themeStyle
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

export default connect(mapStateToProps, null)(rateUs)

const styles = StyleSheet.create({
  categoryView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 1
  },
  rateView: {
    padding: 5,
    paddingRight: Platform.OS === 'android' ? WIDTH * 0.005 : WIDTH * 0.035,
    alignSelf: 'center',
    paddingTop: Platform.OS === 'ios' ? 6 : 0,
    alignItems: 'center',
    height: 40
  },
  iconContainer: {
    // paddingLeft: 10,
    paddingTop: 8,
    marginRight: WIDTH * 0.03
  }
})
