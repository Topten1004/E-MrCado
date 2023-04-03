import React, { PureComponent } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform,
  ScrollView
} from 'react-native'
import { createSelector } from 'reselect'
import Toast from 'react-native-easy-toast'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { getUrl, getHttp } from '../common/WooComFetch'
import { connect } from 'react-redux'
import SyncStorage from 'sync-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import themeStyle, { appTextStyle } from '../common/Theme.style'
const WIDTH = Dimensions.get('window').width
class CreateAccount extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      headerTitleAlign: 'center',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary,
        elevation: 0,
        borderBottomWidth: 0,
        shadowOpacity: 0
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 6
      },
      headerForceInset: { top: 'never', vertical: 'never' }
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.appConfig.languageJson['Change Password']
    })
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      myAccountData: {},
      firstName: SyncStorage.get('customerData').customers_firstname,
      lastName: SyncStorage.get('customerData').customers_lastname,
      errorMessage: '',
      spinnerTemp: false,
      phone: SyncStorage.get('customerData').phone,
      currentPassword: '',
      newPassword: '',
      password: '',
      success: '',
      customers_id: '',
      image_id: 0,
      customers_telephone: ''
    }
    this.toast = null
  }

  /// ///////////////////////////////////////////////////
  updateInfo = t => {
    if (
      this.state.newPassword.length === 0 ||
      this.state.password.length === 0 ||
      this.state.currentPassword.length === 0
    ) {
      this.setState({
        errorMessage: this.props.isLoading.appConfig.languageJson[
          'Please Enter all fields'
        ]
      })
    } else if (
      this.state.newPassword.toString() !== this.state.password.toString()
    ) {
      this.setState({
        errorMessage: this.props.isLoading.appConfig.languageJson[
          'New password and confirm password must be same'
        ]
      })
    } else {
      t.setState({ spinnerTemp: true }, () => {
        t.state.myAccountData.oldpassword = SyncStorage.get(
          'customerData'
        ).password
        t.state.myAccountData.newpassword = t.state.password
        t.state.myAccountData.customers_id = SyncStorage.get(
          'customerData'
        ).customers_id
        if (t.state.password !== '') { t.state.myAccountData.password = t.state.password }
        t.UpdateCustomerData1(
          SyncStorage.get('customerData').customers_id,
          t.state.myAccountData
        )
      })
    }
  }

  /// ///////////////////////////////////////////////////
  UpdateCustomerData1 = async (id, object) => {
    const json = await getHttp(
      getUrl() +
      '/api/' +
      'updatepassword?oldpassword=' +
      this.state.currentPassword +
      '&newpassword=' +
      this.state.newPassword +
      '&customers_id=' +
      id,
      {}
    )
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        this.setState({
          spinnerTemp: false,
          currentPassword: '',
          password: '',
          newPassword: '',
          errorMessage: json.data.message,
          success: json.data.success
        })
      } else {
        this.toast.show(json.data.message)
        this.setState({
          spinnerTemp: false,
          currentPassword: '',
          password: '',
          newPassword: ''
        })
      }
    } else {
      this.toast.show(json.data.data.message)
      this.setState({
        spinnerTemp: false,
        currentPassword: '',
        password: '',
        newPassword: ''
      })
    }
  }

  /// //////
  render () {
    return (
      <ScrollView style={{ backgroundColor: themeStyle.backgroundColor }}>
        <View
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,

            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Spinner
            visible={this.state.spinnerTemp}
          />
          <Toast
            ref={ref => { this.toast = ref }}
            style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
            position='top'
            positionValue={400}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <TextInput
              style={{
                marginTop: 20,
                height: 38,
                width: WIDTH * 0.9,
                borderColor: '#c1c1c1',
                borderWidth: 1,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 6,
                paddingRight: 6,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                color: themeStyle.textColor
              }}
              placeholderTextColor={'#c1c1c1'}
              secureTextEntry
              selectionColor='#51688F'
              placeholder={
                this.props.isLoading.appConfig.languageJson['Current Password']
              }
              onChangeText={currentPassword =>
                this.setState({ currentPassword, errorMessage: '' })
              }
              value={this.state.currentPassword}
            />

            <TextInput
              style={{
                marginTop: 20,
                height: 38,
                width: WIDTH * 0.9,
                borderColor: '#c1c1c1',
                borderWidth: 1,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 6,
                paddingRight: 6,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                color: themeStyle.textColor
              }}
              placeholderTextColor={'#c1c1c1'}
              secureTextEntry
              selectionColor='#51688F'
              placeholder={
                this.props.isLoading.appConfig.languageJson['New Password']
              }
              onChangeText={newPassword =>
                this.setState({ newPassword, errorMessage: '' })
              }
              value={this.state.newPassword}
            />

            <TextInput
              style={{
                marginTop: 15,
                height: 38,
                width: WIDTH * 0.9,
                borderColor: '#c1c1c1',
                borderWidth: 1,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 4,
                textAlign: I18nManager.isRTL
                  ? Platform.OS === 'android'
                    ? 'right'
                    : 'auto'
                  : 'auto',
                color: themeStyle.textColor
              }}
              placeholderTextColor={'#c1c1c1'}
              secureTextEntry
              selectionColor='#51688F'
              placeholder={
                this.props.isLoading.appConfig.languageJson['Confirm Password']
              }
              onChangeText={password =>
                this.setState({ password, errorMessage: '' })
              }
              value={this.state.password}
            />

            <TouchableOpacity
              disabled={
                this.state.newPassword.length === 0 ||
                this.state.password.length === 0 ||
                this.state.currentPassword.length === 0
              }
              onPress={() => this.updateInfo(this)}>
              <View
                style={{
                  marginTop: 18,
                  alignItems: 'center',
                  height: 38,
                  width: WIDTH * 0.9,
                  backgroundColor:
                    this.state.newPassword.length === 0 ||
                    this.state.password.length === 0 ||
                    this.state.currentPassword.length === 0
                      ? '#c1c1c1'
                      : themeStyle.otherBtnsColor,
                  justifyContent: 'center',
                  opacity:
                    this.state.firstName === '' ||
                    this.state.lastName === '' ||
                    this.state.email === '' ||
                    (this.state.password === '') === ''
                      ? 0.4
                      : 0.9
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.otherBtnsText,
                    fontSize: themeStyle.mediumSize,
                    fontFamily: appTextStyle.fontFamily,
                    fontWeight: '500'
                  }}>
                  {this.props.isLoading.appConfig.languageJson.Update}
                </Text>
              </View>
            </TouchableOpacity>

            {this.state.errorMessage !== '' ? (
              <Text
                style={{
                  marginTop: 18,
                  fontFamily: appTextStyle.fontFamily,
                  color: this.state.success !== '1' ? 'red' : 'green'
                }}>
                {this.state.errorMessage}
              </Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
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
  isLoading: state
})

export default connect(mapStateToProps, null)(CreateAccount)
