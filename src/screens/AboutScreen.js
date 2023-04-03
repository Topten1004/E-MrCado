import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Switch,
  ScrollView
} from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { UIActivityIndicator } from 'react-native-indicators'
import { getUrl, getHttp } from '../common/WooComFetch'
import { connect } from 'react-redux'
import HTML from 'react-native-render-html'
import { createSelector } from 'reselect'
import { Icon } from 'native-base'
import { appTextStyle } from '../common/Theme.style'
import Toast from 'react-native-easy-toast'

class About extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerForceInset: { top: 'never', vertical: 'never' },
      headerTintColor: iconColor,
      headerStyle: {
        backgroundColor: colorProps,
        elevation: 0,
        borderBottomWidth: 0,
        shadowOpacity: 0
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 6
      },
      headerTitleAlign: 'center'
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.appConfig.languageJson['About Us'],
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      spinnerTemp: true,
      aboutUs: ''
    }
    this.toast = null
    this.getData()
  }

  getData = async () => {
    let url = 'pages/1'
    url += '?language_id=' + this.props.settings.language_id
    const json = await getHttp(
      getUrl() + url
    )
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        this.setState({
          aboutUs: json.data.data.detail[0].description,
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
  }

  categoryFun (text, iconName, nav) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: 0,
            paddingTop: 0
          }}>
          {
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onPress={() => {
                text ===
                this.props.isLoading.appConfig.languageJson['Official Website']
                  ? Linking.openURL(nav)
                  : this.props.navigation.push(nav)
              }}>
              <View style={styles.tabComponents}>
                <Text style={{
                  fontSize: appTextStyle.mediumSize,
                  color: appTextStyle.textColor,
                  fontFamily: appTextStyle.fontFamily
                }}>{text}</Text>
                {text ===
                this.props.isLoading.appConfig.languageJson[
                  'Turn on/off Local Notifications'
                ] ? (
                    <Switch
                      thumbColor={'#4267b2'}
                      onValueChange={value => this.toggleSwitch1(value, text)}
                      value={this.state.switch1Value}
                    />
                  ) : text ===
                  this.props.isLoading.appConfig.languageJson[
                    'Turn on/off Notifications'
                  ] ? (
                      <Switch
                        thumbColor={'#4267b2'}
                        onValueChange={value => this.toggleSwitch1(value, text)}
                        value={this.state.switch2Value}
                      />
                    ) : (
                      <Icon
                        name={iconName}
                        style={{ color: '#4d4d4d', fontSize: 25 }}
                      />
                    )}
              </View>
            </TouchableOpacity>
          }
        </View>

        <View style={{ width: '100%', height: 1, backgroundColor: '#4d4d4d' }} />
      </View>
    )
  }

  /// ///////////////////////////////////////
  render () {
    return (
      this.state.spinnerTemp ? (
        <View
          style={[styles.activityIndicatorContainer, {
            backgroundColor: this.props.themeStyle.primaryBackgroundColor
          }]}>
          <UIActivityIndicator
            size={27}
            color={this.props.themeStyle.primary}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{
          flex: 1,
          padding: 6,
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }}>

          {this.state.aboutUs !== undefined && this.state.aboutUs !== ''
            ? <View>
              <HTML
                html={this.state.aboutUs}
                baseFontStyle={{
                  fontSize: appTextStyle.largeSize,
                  color: this.props.themeStyle.textColor
                }}
              />
            </View> : null}

        </ScrollView>
      )
    )
  }
}
const getTheme = (state) => state.appConfig.themeStyle
const getSettings = (state) => state.settingsCall.settings
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
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
  settings: getSettingsFun(state),
  isLoading: state
})

export default connect(mapStateToProps, null)(About)

const styles = StyleSheet.create({
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
