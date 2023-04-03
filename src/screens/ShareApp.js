import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Share,
  Alert
} from 'react-native'
import ImageLoad from '../common/RnImagePlaceH'
import { connect } from 'react-redux'
import { ListItem, Icon } from 'native-base'
import themeStyle from '../common/Theme.style'
import { createSelector } from 'reselect'
class rateUs extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      rated: false
    }
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message: `https://play.google.com/store/apps/details?id=${this.props.packageName}`
      })

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

  render () {
    return this.props.value === 'menu' ? (
      <View>
        <ListItem noIndent={true}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: themeStyle.backgroundColor
            }}
            onPress={this.onShare}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 1
              }}>
              {!this.props.defaultIcons ? (
                <ImageLoad
                  key={0}
                  style={{
                    width: 22,
                    height: 22,
                    marginRight: 0,
                    paddingLeft: 0
                  }}
                  loadingStyle={{ size: 'large', color: themeStyle.primary }}
                  placeholder={false}
                  ActivityIndicator={true}
                  placeholderStyle={{ width: 0, height: 0 }}
                  source={this.props.imageTemp}
                />
              ) : (
                <Icon
                  name={this.props.iconName}
                  size={20}
                  style={{ color: themeStyle.textColor, fontSize: 19, marginLeft: 3, marginRight: 3 }}
                />
              )}
              <Text style={[{
                textAlign: 'left',
                fontFamily: appTextStyle.fontFamily,
                color: themeStyle.backgroundColor,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 10,
                paddingRight: 12
              }, { color: themeStyle.textColor }]}>{this.props.text}</Text>
            </View>
          </TouchableOpacity>
        </ListItem>
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: themeStyle.backgroundColor
        }}
        onPress={this.onShare}>
        <View style={styles.tabComponents}>
          <Text style={{
            fontSize: themeStyle.mediumSize,
            fontFamily: appTextStyle.fontFamily
          }}>
            {this.props.text}
          </Text>
          {
            <Icon
              name={this.props.iconName}
              size={20}
              style={{ color: '#4d4d4d', fontSize: this.props.fontsize }}
            />
          }
        </View>
      </TouchableOpacity>
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
/// ///////////////////////////////////////////////
const mapStateToProps = state => {
  return {
    themeStyle: getThemeFun(state),
    isLoading: state
  }
}

export default connect(mapStateToProps, null)(rateUs)

const styles = StyleSheet.create({
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  }
})
