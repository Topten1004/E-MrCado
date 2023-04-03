import React, { PureComponent } from 'react'
import {
  Text, // Renders text
  TouchableOpacity, // Pressable container
  View, // Container PureComponent
  Platform
} from 'react-native'
import { appTextStyle } from './Theme.style'
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

  render ({ onIncrement, onDecrement, width, height } = this.props) {
    return (
      <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
        {this.state.count > 0 ? (
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                width: width + 4,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                borderBottomWidth: 1
              }}>
              <Text
                style={{
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontFamily: appTextStyle.fontFamily
                }}>
                {this.state.count}
              </Text>
            </View>
          </View>
        ) : null}
        {/* /////////////////// */}
        <TouchableOpacity
          style={{
            width: 16,
            height: 17,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: '#2E2E2E',
            borderRadius: 16 / 2,
            elevation: 3
          }}
          onPress={() => {
            onIncrement(this.increment())
          }}>
          <Text
            style={{
              color: '#ffffff',
              fontSize: appTextStyle.largeSize,
              height: Platform.OS === 'ios' ? 21 : 23,
              fontFamily: appTextStyle.fontFamily
            }}>
            {'+'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
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
