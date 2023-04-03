import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground
} from 'react-native'
import { appTextStyle } from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getThumbnailImage } from './WooComFetch'
const WIDTH = Dimensions.get('window').width
const Width2 = WIDTH
Category2 = props => (
  <TouchableOpacity
    style={[styles.container, {
      backgroundColor: 'transparent'
    }]}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageBackground
      key={props.id}
      style={styles.imageStyle}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: getThumbnailImage() + props.item.gallary }}
    />
    <View
      style={[styles.textView, {
        backgroundColor: props.themeStyle.primaryBackgroundColor
      }]}>
      <Text
        style={{
          color: props.themeStyle.textColor,
          fontSize: appTextStyle.largeSize + 2,
          fontFamily: appTextStyle.fontFamily
        }}>
        {props.item.name}
      </Text>

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
export default connect(mapStateToProps, null)(Category2)
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Width2 / 2,
    marginVertical: 8
  },
  imageStyle: {
    height: Width2 * 0.45,
    width: Width2 * 0.45,
    overflow: 'hidden',
    borderRadius: appTextStyle.customRadius - 8

  },
  textView: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
    position: 'absolute',
    alignSelf: 'center',
    bottom: -4,
    width: WIDTH * 0.449,
    padding: 9,
    borderRadius: appTextStyle.customRadius - 12,
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3
  }
})
