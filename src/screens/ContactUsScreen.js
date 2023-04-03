import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  I18nManager,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native'
import { getUrl, postHttp } from '../common/WooComFetch'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import Toast from 'react-native-easy-toast'
import { createSelector } from 'reselect'
import Spinner from 'react-native-loading-spinner-overlay'
import { appTextStyle } from '../common/Theme.style'
class ContactUsScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'center',
      headerTintColor: iconColor,
      headerStyle: {
        backgroundColor: colorProps,
        elevation: 0,
        borderBottomWidth: 0,
        shadowOpacity: 0
        // elevation: 0, // remove shadow on Android
        // shadowOpacity: 0 // remove shadow on iOS
      },
      headerLeft: () => <Icon
        onPress={() => { navigation.pop() }}
        name={!I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
        style={{
          color: iconColor,
          fontSize: appTextStyle.largeSize + 8,
          paddingLeft: 10

        }}
      />,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 6,
        color: iconColor
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      gestureEnabled: false
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Feedback,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      Email: '',
      msg: '',
      errorMessage: '',
      spinnerTemp: false
    }
    this.toast = null
  }

  submit = async () => {
    if (Object.keys(this.props.userData).length > 0) {
      this.setState({ spinnerTemp: true })

      const data = {}
      data.first_name = this.state.firstName
      data.last_name = this.state.lastName
      data.email = this.state.Email
      data.message = this.state.msg
      const json = await postHttp(getUrl() + 'contact-us', data)
      if (json.status === 'success') {
        if (json.data.status === 'Success') {
          this.toast.show(json.data.message)
          this.setState({
            firstName: '',
            msg: '',
            Email: '',
            errorMessage: json.data.message,
            spinnerTemp: false
          })
        } else {
          this.toast.show(json.data.message)
          this.setState({
            spinnerTemp: false
          })
        }
      } else {
        this.toast.show(json.data.data.message)
        this.setState({
          spinnerTemp: false
        })
      }
      this.setState({
        spinnerTemp: false
      })
    }
  }

  singaleRow (iconName, text) {
    return (
      <View
        style={{
          padding: 2,
          flexDirection: 'row',
          backgroundColor: this.props.themeStyle.primaryBackgroundColor,
          paddingTop: 2
        }}
      >
        <Icon name={iconName} style={{ color: 'gray', fontSize: 21 }} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: appTextStyle.mediumSize,
              color: this.props.themeStyle.textColor,
              fontWeight: 'normal',
              padding: 6,
              paddingTop: 1,
              fontFamily: appTextStyle.fontFamily
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    )
  }

  canBeSubmitted () {
    const { Email, firstName, msg } = this.state
    return (Email.length > 0) && firstName.length > 0 && msg.length > 0 &&
      this.EmailNumberCheck()
  }

  EmailNumberCheck () {
    const { Email } = this.state
    const reg = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
    return (
      (Email.length === 0) || reg.test(this.state.Email) === true
    )
  }

  labelFun = (length, text) => (
    <View style={{
      flexDirection: 'row',
      margin: 9,
      alignSelf: 'flex-start',
      marginHorizontal: 0,
      alignItems: 'center'
    }}>
      <Text
        style={{
          fontSize: appTextStyle.largeSize,
          color: length === 0 ? this.props.themeStyle.primary : this.props.themeStyle.primaryBackgroundColor,
          paddingRight: 5,
          paddingLeft: 5,
          fontFamily: appTextStyle.fontFamily
        }}
      >
        {'*'}
      </Text>
      <Text
        style={{
          fontSize: appTextStyle.largeSize,
          color: this.props.themeStyle.textColor,
          fontFamily: appTextStyle.fontFamily
        }}
      >
        {text}
      </Text>
    </View>
  )

  render () {
    const isEnabled = this.canBeSubmitted()
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: this.props.themeStyle.primaryBackgroundColor,
          flex: 1
        }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={5}
          behavior={'height'}
          style={{
            flex: 1,
            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
            padding: 10,
            alignItems: 'center'
          }} >

          <Toast
            ref={ref => { this.toast = ref }}
            style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
            position='top'
            positionValue={400}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
          />

          <Spinner
            visible={this.state.spinnerTemp}
            textStyle={styles.spinnerTextStyle}
          />
          {this.labelFun(this.state.msg.length, this.props.language['Please write your feedback below.'])}

          <TextInput
            style={{
              marginTop: 2,
              height: 130,
              width: '97%',
              borderColor: '#c1c1c1',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              borderWidth: 1,
              margin: 6,
              paddingLeft: 6,
              fontSize: appTextStyle.mediumSize,
              color: this.props.themeStyle.textColor,
              borderRadius: appTextStyle.customRadius - 11,
              textAlignVertical: 'top',
              alignItems: 'flex-start'
            }}
            editable={true}
            multiline={true}
            numberOfLines={5}
            placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
            selectionColor={this.props.themeStyle.iconPrimaryColor}
            placeholder={' ' + this.props.language['write your feedback here']}
            onChangeText={msg => {
              this.setState({ msg, errorMessage: '' })
            }}
            value={this.state.msg}
          />

          {this.labelFun(this.state.firstName.length, this.props.language['First Name'])}
          <TextInput
            style={{
              marginTop: 2,
              height: 38,
              width: '97%',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              borderColor: '#c1c1c1',
              borderWidth: 1,
              margin: 6,
              paddingLeft: 6,
              fontSize: appTextStyle.mediumSize,
              color: this.props.themeStyle.textColor,
              borderRadius: appTextStyle.customRadius - 11
            }}
            placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
            selectionColor={this.props.themeStyle.iconPrimaryColor}
            placeholder={' ' + this.props.language['First Name']}
            onChangeText={firstName => {
              this.setState({ firstName, errorMessage: '' })
            }}
            value={this.state.firstName}
          />

          {this.labelFun(this.state.lastName.length, this.props.language['Last Name'])}
          <TextInput
            style={{
              marginTop: 2,
              height: 38,
              width: '97%',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              borderColor: '#c1c1c1',
              borderWidth: 1,
              margin: 6,
              paddingLeft: 6,
              fontSize: appTextStyle.mediumSize,
              color: this.props.themeStyle.textColor,
              borderRadius: appTextStyle.customRadius - 11
            }}
            placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
            selectionColor={this.props.themeStyle.iconPrimaryColor}
            placeholder={' ' + this.props.language['Last Name']}
            onChangeText={lastName => {
              this.setState({ lastName, errorMessage: '' })
            }}
            value={this.state.lastName}
          />
          {this.labelFun(this.state.Email.length, this.props.language.Email)}
          <TextInput
            style={{
              marginTop: 2,
              height: 38,
              width: '97%',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              borderColor: this.EmailNumberCheck() ? '#c1c1c1' : 'red',
              borderWidth: 1,
              margin: 6,
              paddingLeft: 6,
              fontSize: appTextStyle.mediumSize,
              color: this.props.themeStyle.textColor,
              borderRadius: appTextStyle.customRadius - 11
            }}
            placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
            selectionColor={this.props.themeStyle.iconPrimaryColor}
            placeholder={' ' + this.props.language.Email}
            onChangeText={Email => {
              this.setState({ Email, errorMessage: '' })
            }}
            value={this.state.Email}
          />

          {this.state.errorMessage === '' ? null : (
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: this.props.themeStyle.textColor,
                  fontWeight: 'normal',
                  padding: 10,
                  paddingTop: 4,
                  paddingLeft: 6,
                  fontSize: appTextStyle.mediumSize
                }}
              >
                {this.state.errorMessage}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={{
              borderColor: '#fff',
              alignItems: 'center',
              height: 38,
              backgroundColor: this.props.themeStyle.primary,
              padding: 4,
              justifyContent: 'center',
              width: '97%',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              alignSelf: 'center',
              opacity: (!isEnabled) ? 0.5 : 0.9,
              bottom: 22,
              position: 'absolute',
              borderRadius: appTextStyle.customRadius
            }}
            onPress={() => {
              this.submit()
            }}
            disabled={!isEnabled}
          >

            <Text
              style={{
                color: '#fff',
                fontSize: appTextStyle.largeSize + 2,
                paddingTop: 1,
                fontWeight: '500',
                textAlign: 'center',
                fontFamily: appTextStyle.fontFamily
              }}
            >
              {this.props.language.Submit}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>

    )
  }
}
/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getUserData = (state) => state.userData.user
const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const getLanguage = (state) => state.appConfig.languageJson
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  userData: getUserDataFun(state)
})

export default connect(
  mapStateToProps,
  null
)(ContactUsScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
