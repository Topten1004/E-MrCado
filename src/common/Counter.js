import React, { PureComponent } from 'react'
import {
  Text, // Renders text
  TouchableOpacity, // Pressable container
  View, // Container PureComponent
  StyleSheet
} from 'react-native'
import theme, { appTextStyle } from './Theme.style'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
class Counter extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      count: this.props.initialValue,
      initialValue: this.props.initialValue
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    return {
      count:
        nextProps.initialValue !== prevState.initialValue
          ? nextProps.initialValue
          : prevState.count
    }
  }

  componentDidMount () {
    if (this.props.innerRef !== undefined && this.props.innerRef !== null) {
      this.props.innerRef(this)
    }
  }

  componentWillUnmount () {
    if (this.props.innerRef !== undefined && this.props.innerRef !== null) {
      this.props.innerRef(null)
    }
  }

  increment () {
    this.setState({
      count: this.state.count + 1
    })
    return this.state.count + 1
  }

  decrement () {
    this.setState({
      count:
        this.props.minimumValue < this.state.count
          ? this.state.count - 1
          : this.state.count
    })
    return this.props.minimumValue < this.state.count
      ? this.state.count - 1
      : this.state.count
  }

  resetValue () {
    this.setState({
      count: this.props.initialValue
    })
  }

  setValue (value) {
    this.setState({
      count: value
    })
  }

  render ({ onIncrement, onDecrement, width, height, containerWidth } = this.props) {
    return (
      <View style={[styles.counterContainer, {
        width: containerWidth || 140
      }]}>
        <TouchableOpacity
          style={[styles.counterBtn, {
            width: width - 13,
            paddingVertical: height - 18,
            backgroundColor: this.props.themeStyle.iconPrimaryColor
          }]}
          onPress={() => {
            if (this.props.minimumValue < this.state.count) { onDecrement(this.decrement()) }
          }}>
          <FontAwesome
            style={{
              color: this.props.themeStyle.textTintColor,
              fontSize: appTextStyle.mediumSize,
              marginTop: -2,
              paddingBottom: 4

            }}
            active
            name={'minus'}

          />
        </TouchableOpacity>
        {/* //////////////////// */}
        <View
          style={[styles.counterBtn, {
            width: width + 9,
            paddingTop: height,
            borderRadius: 0,
            backgroundColor: this.props.themeStyle.primaryBackgroundColor
          }]}>
          <Text
            style={{
              color: this.props.themeStyle.textColor,
              fontSize: appTextStyle.largeSize + 4,
              fontFamily: appTextStyle.fontFamily
            }}>
            {this.state.count}
          </Text>
        </View>
        {/* /////////////////// */}
        <TouchableOpacity
          style={[styles.counterBtn, {
            width: width - 13,
            paddingVertical: height - 18,
            backgroundColor: this.props.themeStyle.primary
          }]}
          onPress={() => {
            onIncrement(this.increment())
          }}>
          <FontAwesome
            style={{
              color: this.props.themeStyle.textTintColor,
              fontSize: appTextStyle.mediumSize,
              marginTop: -2,
              paddingBottom: 4

            }}
            active
            name={'plus'}

          />
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center'
  },
  counterBtn: {
    paddingTop: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 60
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
export default connect(mapStateToProps, null)(Counter)
