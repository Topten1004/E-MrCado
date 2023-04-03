import React, { Component } from 'react'
import {
  Text, // Renders text
  TouchableOpacity, // Pressable container
  View
} from 'react-native'
import { appTextStyle } from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Icon } from 'native-base'
class Timer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      timeInSeconds: 0,
      is_upcomming:
        this.props.objectArray.server_time <
        this.props.objectArray.flash_start_date,
      seconds: this.props.objectArray.flash_expires_date,
      CountdownTimer: {
        seconds: 1,
        secondsRemaining: 1,
        runTimer: true,
        hasStarted: true,
        hasFinished: false,
        displayTime: ''
      },
      timer: {
        seconds: 1,
        secondsRemaining: 1,
        runTimer: true,
        hasStarted: true,
        hasFinished: false,
        displayTime: ''
      }
    }

    if (this.state.seconds === 0) {
      this.props.props.removeWishListProduct(this.props.objectArray)
      this.props.props.removeRecentItems(this.props.objectArray)
      this.props.props.removeCardFromCart(this.props.objectArray)
      this.props.props.removeFlashCard(this.props.objectArray)
    } else {
      this.state.timeInSeconds =
        this.state.seconds - this.props.objectArray.server_time
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {}
  componentDidMount () {
    this.initTimer()
    this.startTimer()
  }

  hasFinished = () => {
    return this.state.timer.hasFinished
  }

  initTimer = () => {
    if (!this.state.timeInSeconds) {
      this.state.timeInSeconds = 0
    }

    this.state.CountdownTimer.seconds = this.state.timeInSeconds
    this.state.CountdownTimer.runTimer = false
    this.state.CountdownTimer.hasStarted = false
    this.state.CountdownTimer.hasFinished = false
    this.state.CountdownTimer.secondsRemaining = this.state.timeInSeconds
    this.state.timer = this.state.CountdownTimer
    this.state.timer.displayTime = this.getSecondsAsDigitalClock(
      this.state.timeInSeconds
    )
  }

  startTimer = () => {
    this.state.timer.hasStarted = true
    this.state.timer.runTimer = true
    this.timerTick()
  }

  pauseTimer = () => {
    this.state.timer.runTimer = false
  }

  resumeTimer = () => {
    this.startTimer()
  }

  timerTick = () => {
    setTimeout(() => {
      if (!this.state.timer.runTimer) {
        return
      }
      this.state.timer.secondsRemaining--
      this.state.timer.displayTime = this.getSecondsAsDigitalClock(
        this.state.timer.secondsRemaining
      )
      this.setState({ timer: this.state.timer }, () => {
        if (this.state.timer.secondsRemaining > 0) {
          this.timerTick()
        } else {
          this.props.props.removeWishListProduct(this.props.objectArray)
          this.props.props.removeRecentItems(this.props.objectArray)
          this.props.props.removeCardFromCart(this.props.objectArray)
          this.props.props.removeFlashCard(this.props.objectArray)
          this.state.timer.hasFinished = true
          this.setState({})
        }
      })
    }, 1000)
  }

  getSecondsAsDigitalClock = inputSeconds => {
    const secNum = parseInt(inputSeconds.toString(), 10) // don't forget the second param
    const hours = Math.floor(secNum / 3600)
    const minutes = Math.floor((secNum - hours * 3600) / 60)
    const seconds = secNum - hours * 3600 - minutes * 60
    let hoursString = ''
    let minutesString = ''
    let secondsString = ''
    hoursString = hours < 10 ? '0' + hours : hours.toString()
    minutesString = minutes < 10 ? '0' + minutes : minutes.toString()
    secondsString = seconds < 10 ? '0' + seconds : seconds.toString()
    return hoursString + 'h:' + minutesString + 'm:' + secondsString + 's'
  }

  render () {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.state.is_upcomming) {
            this.props.props.navigation.navigate('ProductDetails', {
              objectArray: this.props.objectArray
            })
          }
        }}
        style={{
          margin: 5,
          width: this.props.btnWidth,
          marginBottom: this.props.temp === false ? 0 : 2,
          marginTop: 0,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: this.props.themeStyle.textColor,
          shadowOpacity: 0.5,
          elevation: 3
        }}>
        <View
          style={{
            padding: this.props.text !== null ? 12 : 5,
            margin: 5,
            width: this.props.btnWidth,
            backgroundColor:
              this.props.text !== null
                ? this.props.themeStyle.textColor
                : this.props.color === false
                  ? this.props.themeStyle.primary
                  : this.props.themeStyle.primary,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 0,
            marginBottom: 0,
            borderBottomLeftRadius: this.props.temp === false ? 8 : 0,
            borderBottomRightRadius: this.props.temp === false ? 8 : 0,
            flexDirection: this.props.text !== null ? 'row' : 'column'
          }}>
          {this.props.text !== null ? (
            <Icon
              name={'clock'}
              style={{
                fontSize: appTextStyle.mediumSize + 2,
                color: this.props.themeStyle.textColor,
                paddingRight: 6
              }}
            />
          ) : null}
          {this.props.text !== null ? (
            <Text
              style={{
                color: this.props.themeStyle.primary,
                fontSize: appTextStyle.mediumSize + 1,
                fontWeight: '500',
                paddingRight: 6,
                fontFamily: appTextStyle.fontFamily
              }}>
              {this.props.text}
            </Text>
          ) : null}
          {this.state.is_upcomming ? (
            <Text
              style={{
                color: this.props.themeStyle.primary,
                fontSize: appTextStyle.mediumSize + 1,
                fontWeight: '500',
                fontFamily: appTextStyle.fontFamily
              }}>
              {this.props.languageJson['Up Coming']}
            </Text>
          ) : (
            <Text
              style={{
                color: this.props.themeStyle.primary,
                fontSize: appTextStyle.mediumSize + 1,
                fontWeight: '500',
                fontFamily: appTextStyle.fontFamily
              }}>
              {this.state.timer.displayTime}
            </Text>
          )}
        </View>
      </TouchableOpacity>
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
export default connect(mapStateToProps, null)(Timer)
