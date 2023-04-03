import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet
} from 'react-native'
import ImageLoad from './RnImagePlaceH'
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
    <ImageLoad
      key={props.id}
      style={styles.imageStyle}
      placeholder={false}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: getThumbnailImage() + props.item.gallary }}
    />

    <View
      style={[styles.textView]}>
      <Text
        numberOfLines={1}
        style={{
          color: props.themeStyle.textColor,
          fontSize: appTextStyle.mediumSize,
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
    // width: Width2 / 2,
    margin: 8
  },
  imageStyle: {
    height: Width2 * 0.12,
    width: Width2 * 0.12,
    overflow: 'hidden',
    borderRadius: Width2 * 0.12 / 2
  },
  textView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: Width2 * 0.14
  }
})
