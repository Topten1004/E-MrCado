import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { appTextStyle } from './Theme.style'
import { createSelector } from 'reselect'
import Ionicons from 'react-native-vector-icons/Ionicons'
const ShoppingCartIcon = props => (
  <View style={styles.maincontainer}>

    <TouchableOpacity
      onPress={() => { props.navigation.navigate('SearchScreen') }}>
      <Ionicons
        name={'search-outline'}
        style={{
          color: props.themeStyle.textColor,
          fontSize: 22,
          paddingHorizontal: 12
        }}
      />
    </TouchableOpacity>
    <TouchableOpacity style={[{ padding: 5 }]} onPress={() => { props.navigation.navigate('CartScreen') }}>

      <View
        style={[styles.container, {
          backgroundColor: props.themeStyle.primary
        }]}>
        <Text
          style={[styles.textStyle, {
            color: props.themeStyle.textTintColor
          }]}>
          {props.cartQuantity}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => { props.navigation.navigate('CartScreen') }}>
        <Ionicons
          name={'cart-outline'}
          style={{
            color: props.themeStyle.textColor,
            fontSize: 22
          }}
        />
      </TouchableOpacity>

    </TouchableOpacity>
  </View>
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
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // padding: 5,
    // paddingTop: Platform.OS === 'ios' ? 20 : 5,
    paddingRight: 16
  },
  textStyle: {
    fontWeight: '500',
    alignSelf: 'center',
    fontSize: 10,
    fontFamily: appTextStyle.fontFamily
  }
})
