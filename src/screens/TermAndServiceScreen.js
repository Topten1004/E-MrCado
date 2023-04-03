import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Platform
} from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack'
import Toast from 'react-native-easy-toast'
import { getUrl, getHttp } from '../common/WooComFetch'
import { UIActivityIndicator } from 'react-native-indicators'
import { connect } from 'react-redux'
import HTML from 'react-native-render-html'
import { createSelector } from 'reselect'
import { appTextStyle } from '../common/Theme.style'
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
      headerTitle: this.props.isLoading.appConfig.languageJson['Term and Services'],
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
    this.getData()
  }

  getData = async () => {
    let url = 'pages/4'
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
          <Toast
            ref={ref => { this.toast = ref }}
            style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
            position='top'
            positionValue={400}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
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
