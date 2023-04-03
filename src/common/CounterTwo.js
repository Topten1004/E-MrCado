import React, { PureComponent } from 'react'
import {
  Text, // Renders text
  TouchableOpacity, // Pressable container
  View, // Container PureComponent
  StyleSheet
} from 'react-native'
import { appTextStyle } from './Theme.style'
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

  render ({ onIncrement, onDecrement, width, height, containerWidth, backgroundColor } = this.props) {
    return (
      <View style={[styles.counterContainer, {
        borderColor: this.props.themeStyle.iconPrimaryColor,
        width: containerWidth || 140
      }]}>
        <TouchableOpacity
          style={[styles.counterBtn, {
            width,
            paddingVertical: height,
            backgroundColor: backgroundColor || this.props.themeStyle.primaryBackgroundColor
          }]}
          onPress={() => {
            if (this.props.minimumValue < this.state.count) { onDecrement(this.decrement()) }
          }}>
          <FontAwesome
            style={{
              color: this.props.themeStyle.iconPrimaryColor,
              fontSize: appTextStyle.largeSize

            }}
            active
            name={'minus'}

          />
        </TouchableOpacity>
        {/* //////////////////// */}
        <View
          style={[styles.counterBtn, {
            width,
            paddingTop: height,
            backgroundColor: backgroundColor || this.props.themeStyle.primaryBackgroundColor
          }]}>
          <Text
            style={{
              color: this.props.themeStyle.cardTextColor,
              fontSize: appTextStyle.largeSize,
              fontFamily: appTextStyle.fontFamily
            }}>
            {this.state.count}
          </Text>
        </View>
        {/* /////////////////// */}
        <TouchableOpacity
          style={[styles.counterBtn, {
            width,
            paddingVertical: height,
            backgroundColor: backgroundColor || this.props.themeStyle.primaryBackgroundColor
          }]}
          onPress={() => {
            onIncrement(this.increment())
          }}>
          <FontAwesome
            style={{
              color: this.props.themeStyle.iconPrimaryColor,
              fontSize: appTextStyle.largeSize

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
    borderWidth: 1,
    borderRadius: 4,
    alignContent: 'center',
    justifyContent: 'center'
  },
  counterBtn: {
    paddingTop: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
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
