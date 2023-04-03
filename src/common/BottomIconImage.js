import React from 'react'
import { View, Image } from 'react-native'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createSelector } from 'reselect'

const ShoppingCartIcon = props => (
  <View>
    <Ionicons name={props.iconName} style={{ color: props.color, fontSize: 20 }} />
  </View>
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
export default connect(mapStateToProps, null)(withNavigation(ShoppingCartIcon))
