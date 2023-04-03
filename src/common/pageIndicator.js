import React from 'react'
import { StyleSheet, Text, Dimensions, View } from 'react-native'
import { appTextStyle } from './Theme.style'
const WIDTH = Dimensions.get('window').width

const circle = (th, value, text, backgroundColor) => (
  <View style={{
    alignItems: 'center',
    justifyContent: 'center'
  }}>

    <View style={[styles.circleView, {
      backgroundColor: value ? th.props.themeStyle.textTintColor : th.props.themeStyle.iconPrimaryColor,
      borderColor: value ? th.props.themeStyle.primary : th.props.themeStyle.iconPrimaryColor
    }]} />

    <Text style={[styles.circleText, {
      color: value ? th.props.themeStyle.primary : th.props.themeStyle.iconPrimaryColor,
      backgroundColor: backgroundColor,
      fontFamily: appTextStyle.fontFamily
    }]}>
      {text}
    </Text>
  </View>
)

const PageIndicator = ({ th, selected, language, backgroundColor }) => (
  <View style={[styles.containerDevi, {
    backgroundColor: backgroundColor,
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'center'
  }]}>
    {circle(th, selected >= 1, language.Shipping)}
    <View style={[styles.childContainerView, {
      backgroundColor: selected >= 2 ? th.props.themeStyle.primary : th.props.themeStyle.iconPrimaryColor
    }]} />
    {circle(th, selected >= 2, language.Payment)}
    <View style={[styles.childContainerView, {
      backgroundColor: selected === 3 ? th.props.themeStyle.primary : th.props.themeStyle.iconPrimaryColor
    }]} />
    {circle(th, selected === 3, language.Review)}
  </View>
)

const styles = StyleSheet.create({
  containerDevi: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  circleText: {
    fontSize: appTextStyle.smallSize - 1,
    position: 'absolute',
    bottom: -20,
    width: WIDTH * 0.18,
    alignSelf: 'center',
    paddingLeft: 6,
    textAlign: 'center'
  },
  childContainerView: {
    height: 2,
    width: WIDTH * 0.2
  },
  circleView: {
    height: 17,
    width: 17,
    borderRadius: 10,
    borderWidth: 5
  }
})

export default PageIndicator
