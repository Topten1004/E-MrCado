import React, { PureComponent } from 'react'
import { Alert, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import appTextStyle from './Theme.style'
import { createSelector } from 'reselect'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const FBSDK = require('react-native-fbsdk')
const { LoginManager, AccessToken } = FBSDK
class FBLoginButton extends PureComponent {
  fbLoginFun (NAV, im, h) {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          Alert.alert('Login was cancelled')
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            this.props.parentReference(data.accessToken, 'fb', h)
          })
          h._storeDatafb1()
          im.LoginValueChange()
        }
      },
      error => {
        Alert.alert(`Login failed with error:${error}`)
      }
    )
  }

  _storeDatafb1 () {
    try {
    } catch (error) { }
  }

  render () {
    return (

      <TouchableOpacity style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onPress={() => this.fbLoginFun(this.props.NAV, this.props, this)}
      >
        <FontAwesome
          name={'facebook'}
          style={{
            color: '#3b5998',
            fontSize: 40
          }}
        />
        <Text style={{
          fontSize: appTextStyle.mediumSize,
          color: this.props.themeStyle.iconPrimaryColor,
          paddingTop: 2,
          fontFamily: appTextStyle.fontFamily
        }}>{'facebook'}</Text>
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
  themeStyle: getThemeFun(state),
  LoginValue: state
})
const mapDispatchToProps = dispatch => ({
  LoginValueChange: () => dispatch({ type: 'Login', fb1: '1' })
})

export default connect(mapStateToProps, mapDispatchToProps)(FBLoginButton)
