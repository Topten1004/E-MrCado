import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { appConfigStyle, appTextStyle } from './Theme.style'
import { createSelector } from 'reselect'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ShoppingCartIcon = props => (

  <TouchableOpacity style={[{ padding: 5 }]} onPress={() => { props.props.navigation.navigate('CartScreen') }}>

    <View
      style={[styles.container, {
        backgroundColor: 'red'
      }]}>
      <Text
        style={[styles.textStyle, {
          color: props.themeStyle.textTintColor
        }]}>
        {props.cartQuantity}
      </Text>
    </View>

    <TouchableOpacity
      onPress={() => { props.props.navigation.navigate('CartScreen') }}>
      <Ionicons
        name={'cart-outline'}
        style={{
          color: appConfigStyle.headerColor
            ? props.props.themeStyle.textTintColor
            : props.props.themeStyle.textColor,
          // color: props.props.themeStyle.textColor,
          fontSize: 22
        }}
      />
    </TouchableOpacity>

  </TouchableOpacity>

)

const getTheme = (state) => state.appConfig.themeStyle
const cartQuantity = (state) => state.cartData.cartQuantity

const cartQuantityFun = createSelector(
  [cartQuantity],
  (cartQuantity) => {
    return cartQuantity
  }
)

const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  cartQuantity: cartQuantityFun(state)
})
export default connect(mapStateToProps, null)(withNavigation(ShoppingCartIcon))

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 15,
    width: 17,
    borderRadius: 30,
    right: -3,
    bottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  textStyle: {
    fontWeight: '500',
    alignSelf: 'center',
    fontSize: 10,
    fontFamily: appTextStyle.fontFamily
  }
})
