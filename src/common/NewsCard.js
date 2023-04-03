import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  I18nManager
} from 'react-native'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import ImageLoad from './RnImagePlaceH'
import { Icon } from 'native-base'
import theme, { appTextStyle } from './Theme.style'
const WIDTH = Dimensions.get('window').width
const Width2 = WIDTH

Category1 = props => (
  <TouchableOpacity
    style={{
      justifyContent: 'flex-start',
      backgroundColor: this.props.themeStyle.primaryBackgroundColor,
      width: Width2,
      padding: 10,
      borderColor: 'gray',
      flexDirection: 'row'
    }}
    onPress={() => props.openSubCategories(props.item)}>
    <ImageLoad
      key={props.item.id}
      style={{
        height: 80,
        width: 80,
        overflow: 'hidden',
        marginRight: 8
      }}
      loadingStyle={{ size: 'large', color: this.props.themeStyle.primary }}
      placeholder={false}
      ActivityIndicator={true}
      placeholderStyle={{ width: 0, height: 0 }}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: theme.url + '/' + props.item.news_image }}
    />

    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: this.props.themeStyle.primaryBackgroundColor
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: appTextStyle.largeSize,
          margin: 5,
          marginTop: 0,
          color: this.props.themeStyle.textColor,
          width: WIDTH * 0.7,
          fontFamily: appTextStyle.fontFamily,
          textAlign: I18nManager.isRTL
            ? Platform.OS === 'android'
              ? 'right'
              : 'left'
            : 'left'
        }}
        numberOfLines={1}>
        {props.item.news_name}
      </Text>
      <View style={{ flexDirection: 'row', backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>
        <Icon
          name={'time'}
          style={{ color: 'gray', fontSize: 20, paddingRight: 6, paddingLeft: 6 }}
        />
        <Text style={{
          fontWeight: 'normal',
          padding: 1,
          color: '#51534f',
          fontFamily: appTextStyle.fontFamily
        }}>
          {props.item.news_date_added}
        </Text>
      </View>
      <View
        style={{
          margin: 5,
          width: WIDTH * 0.7,
          flex: 1,
          marginTop: 0
        }}>
        <Text
          style={{
            color: '#51534f',
            fontSize: appTextStyle.mediumSize - 1,
            fontFamily: appTextStyle.fontFamily
          }}
          numberOfLines={4}>
          {props.html}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
)
const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state)
})
export default connect(mapStateToProps, null)(Category1)
