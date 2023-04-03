import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform
} from 'react-native'
import { appTextStyle } from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getThumbnailImage } from './WooComFetch'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
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
    >
      <View
        style={[styles.absoluteColor, {
          backgroundColor: props.themeStyle.primary
        }]}
      />
      <View
        style={[styles.textView]}>
        <Text
          style={{
            color: props.themeStyle.textColor,
            fontSize: appTextStyle.largeSize + 3,
            fontWeight: 'bold',
            fontFamily: appTextStyle.fontFamily
          }}>
          {props.item.name}
        </Text>

      </View>
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
export default connect(mapStateToProps, null)(Category2)
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Width2 / 2,
    marginVertical: 8
  },
  imageStyle: {
    height: Width2 * 0.43,
    width: Width2 * 0.43,
    overflow: 'hidden',
    borderRadius: appTextStyle.customRadius - 4

  },
  textView: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
    position: 'absolute',
    alignSelf: 'center',
    top: Platform.OS === 'ios' ? HEIGHT * 0.092 : HEIGHT * 0.1
  },
  absoluteColor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: WIDTH * 0.5,
    alignContent: 'center',
    opacity: 0.2,
    zIndex: 20
  }
})
