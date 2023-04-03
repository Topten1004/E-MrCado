import React from 'react'
import { View, StyleSheet, Platform, TouchableOpacity, Share, Alert, Text, Dimensions } from 'react-native'
import { withNavigation } from 'react-navigation'
import RateUsButton from '../screens/RateUs'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { createSelector } from 'reselect'
import DeviceInfo from 'react-native-device-info'
import { appConfigStyle, appTextStyle } from './Theme.style'
const WIDTH = Dimensions.get('window').width

const onShare = async props => {
  try {
    let result = ''
    if (Platform.OS === 'android') {
      result = await Share.share({
        message: `https://play.google.com/store/apps/details?id=${DeviceInfo.getBundleId()}`
      })
    } else {
      DeviceInfo.getBuildId().then(async (buildId) => {
        result = await Share.share({
          message: `https://play.google.com/store/apps/details?id=${buildId}`
        })
      })
    }
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
      } else {
      }
    } else if (result.action === Share.dismissedAction) {
    }
  } catch (error) {
    Alert.alert(error.message)
  }
}
const ShoppingCartIcon = props => (
  <View
    style={styles.maincontainer}>
    <TouchableOpacity onPress={() => onShare(props)}>
      <View
        style={[
          styles.shareView,
          Platform.OS === 'android' ? styles.iconContainer : null
        ]}>
        <Icon
          name='md-share-outline'
          style={{
            color: props.iconColor
              ? props.iconColor : props.themeStyle.textTintColor,
            fontSize: 24,
            paddingBottom: 1
          }}
        />
        {props.iconColor
          ? <Text style={{
            color: appConfigStyle.settingsPageColor ? '#444444' : props.themeStyle.textColor,
            fontSize: appTextStyle.mediumSize,
            fontFamily: appTextStyle.fontFamily,
            textAlign: 'center'
          }}>{props.language.Share}</Text>
          : null }
      </View>
    </TouchableOpacity>
    {props.iconColor
      ? null
      : <RateUsButton
        text={'text'}
        iconName={'md-star-half'}
      />}
  </View>
)

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
export default connect(mapStateToProps, null)(withNavigation(ShoppingCartIcon))

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 5,
    paddingTop: Platform.OS === 'ios' ? 20 : 5,
    paddingRight: 6
  },
  shareView: {
    // padding: 5,
    paddingRight: Platform.OS === 'android' ? WIDTH * 0.005 : WIDTH * 0.025,
    paddingTop: 2,
    alignItems: 'center',
    height: 40
  },
  iconContainer: {
    // paddingLeft: 10,
    paddingTop: 10,
    marginRight: WIDTH * 0.023,
    alignItems: 'center'
  }
})
