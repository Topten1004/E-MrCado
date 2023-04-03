import React from 'react'
import {
  TouchableOpacity,
  Text,
  Dimensions,
  PixelRatio,
  StyleSheet,
  ImageBackground
} from 'react-native'
import { appTextStyle } from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getThumbnailImage } from './WooComFetch'
const WIDTH = Dimensions.get('window').width
const Width2 = WIDTH * 0.194
const Category4 = props => (
  <TouchableOpacity
    style={[{
      backgroundColor: props.themeStyle.secondryBackgroundColor
    }, styles.container]}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageBackground
      key={props.id}
      style={{
        // height: PixelRatio.getPixelSizeForLayoutSize(34),
        // width: PixelRatio.getPixelSizeForLayoutSize(33),
        height: 70,
        width: 70,
        overflow: 'hidden',
        borderRadius: appTextStyle.customRadius - 9,
        marginBottom: 12
      }}
      placeholder={false}
      ActivityIndicator={true}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: getThumbnailImage() + props.item.gallary }}
    >
      <Text
        numberOfLines={1}
        style={[styles.textStyle, {
          color: props.themeStyle.textTintColor,
          fontSize: appTextStyle.smallSize,
          backgroundColor: props.themeStyle.primary,
          fontFamily: appTextStyle.fontFamily
        }]}>
        {props.item.name}
      </Text>
    </ImageBackground>

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
    margin: 1,
    alignItems: 'center',
    borderRadius: appTextStyle.customRadius
  },
  textStyle: {
    textAlign: 'center',
    bottom: 0,
    padding: 2,
    position: 'absolute',
    width: '100%',
    fontWeight: 'bold'

  }
})
