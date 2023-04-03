import React, { PureComponent } from 'react'
import { StyleSheet, Text, TouchableOpacity, PixelRatio } from 'react-native'
import { connect } from 'react-redux'
import { appTextStyle } from './Theme.style'
import { createSelector } from 'reselect'
class heading extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      count: this.props.initialValue,
      initialValue: this.props.initialValue
    }
  }

  render () {
    return (
      <Text
        style={[styles.categoryTypeStyle, {
          fontFamily: appTextStyle.fontFamily,
          fontSize: appTextStyle.largeSize + 3,
          color: this.props.themeStyle.textColor
        }]}>
        {this.props.text}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  categoryTypeStyle: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 10
  }
})

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
export default connect(mapStateToProps, null)(heading)
