import React from 'react'
import {
  TouchableOpacity,
  Text,
  Dimensions,
  PixelRatio,
  StyleSheet
} from 'react-native'
import ImageLoad from './RnImagePlaceH'
import { appTextStyle } from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getThumbnailImage } from './WooComFetch'
const WIDTH = Dimensions.get('window').width
const Width2 = WIDTH * 0.2
const Category4 = props => (
  <TouchableOpacity
    style={[{
      backgroundColor: props.themeStyle.primaryBackgroundColor,
      borderColor: props.themeStyle.textColor
    }, styles.container]}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageLoad
      key={props.id}
      style={{
        height: PixelRatio.getPixelSizeForLayoutSize(16),
        width: PixelRatio.getPixelSizeForLayoutSize(18),
        overflow: 'hidden'
      }}
      placeholder={false}
      ActivityIndicator={true}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: getThumbnailImage() + props.item.gallary }}
    />

    <Text
      numberOfLines={1}
      style={[styles.textStyle, {
        color: props.themeStyle.textColor,
        fontSize: appTextStyle.smallSize,
        fontFamily: appTextStyle.fontFamily
      }]}>
      {props.item.name}
    </Text>

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
export default connect(mapStateToProps, null)(Category4)

const styles = StyleSheet.create({
  container: {
    width: Width2,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 90,
    padding: 12,
    paddingTop: 14,
    marginHorizontal: 10
  },
  textStyle: {
    textAlign: 'center',
    paddingTop: 3
  }
})
