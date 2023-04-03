import React from 'react'
import { StyleSheet, Text, TouchableOpacity, PixelRatio } from 'react-native'
import { appTextStyle } from './Theme.style'
const CustomBtn = ({
  navigation, title, themeStyle, disable,
  borderRadius,
  onPress
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.saveBtn,
      {
        backgroundColor: disable ? themeStyle.primary : 'gray',
        shadowColor: themeStyle.secondryText,
        borderRadius: borderRadius ? appTextStyle.customRadius : 4
      }
    ]}>
    <Text
      style={[
        styles.btnText,
        {
          fontSize: appTextStyle.mediumSize + PixelRatio.getPixelSizeForLayoutSize(1),
          color: themeStyle.textTintColor
        }
      ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  saveBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    borderRadius: appTextStyle.customRadius - 15,
    width: '93%'
  },
  btnText: {
    fontWeight: '500',
    fontFamily: appTextStyle.fontFamily
  }
})

export default CustomBtn
