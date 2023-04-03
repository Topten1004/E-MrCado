import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'
import ImageLoad from './RnImagePlaceH'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { appTextStyle } from './Theme.style'
import { getThumbnailImage } from './WooComFetch'

Category2 = props => (
  <TouchableOpacity
    style={[styles.container, {
      backgroundColor: 'transparent'
    }]}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageLoad
      key={props.id}
      style={styles.imageStyle}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: getThumbnailImage() + props.item.gallary }}
    />

    <View
      style={[styles.textView, {
        backgroundColor: 'transparent'
      }]}>
      <Text
        style={{
          fontSize: appTextStyle.largeSize,
          color: props.themeStyle.textColor,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '94%',
    margin: 12,
    marginTop: 0,
    marginBottom: 10,
    flexDirection: 'row'
  },
  imageStyle: {
    height: 60,
    width: 60,
    overflow: 'hidden',
    marginRight: 8,
    borderRadius: appTextStyle.customRadius - 4
  },
  textView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backfaceVisibility: 'hidden',
    alignContent: 'center',
    paddingLeft: 10
  }
})
