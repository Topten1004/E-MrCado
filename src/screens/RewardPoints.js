import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from 'react-native'
import Toast from 'react-native-easy-toast'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { getUrl, getHttp, postHttp } from '../common/WooComFetch'
import { UIActivityIndicator } from 'react-native-indicators'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createSelector } from 'reselect'
import { appTextStyle } from '../common/Theme.style'
const WIDTH = Dimensions.get('window').width

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
      headerTitle: this.props.isLoading.appConfig.languageJson['Reward Points'],
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      spinnerTemp: true,
      pointsArray: '',
      spinVar: false
    }
    this.toast = null
    this.getData()
  }

  getData = async () => {
    let url = 'points'
    url += '?language_id=' + this.props.settings.language_id
    url += '&currency=' + this.props.settings.currency_id

    const json = await getHttp(
      getUrl() + url
    )
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        this.setState({
          pointsArray: json.data.data,
          spinnerTemp: false
        })
      } else {
        this.toast.show(json.data.message)
      }
    } else {
      this.toast.show(json.data.data.message)
    }
    this.setState({
      spinnerTemp: false
    })
  }

  redeemPoints = async () => {
    let url = 'redeem'
    url += '?language_id=' + this.props.settings.language_id
    url += '&currency=' + this.props.settings.currency_id

    const json = await postHttp(
      getUrl() + url, {}
    )
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        this.toast.show(json.data.data.message)
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
      spinnerTemp: false,
      spinVar: false
    })
  }

  rewardPoints () {
    let total = 0
    if (this.state.pointsArray !== undefined) {
      this.state.pointsArray.forEach(element => {
        total += parseFloat(element.points)
      })
    }
    return total
  }

  cardView = (label, points, key) => (
    <View key={key} style={[styles.totalView, styles.cardMainView, {
      backgroundColor: this.props.themeStyle.primaryBackgroundColor,
      borderBottomColor: this.props.themeStyle.primaryLight
    }]}>
      <Ionicons
        name={'gift-outline'}
        style={{
          color: this.props.themeStyle.textColor,
          fontSize: appTextStyle.largeSize + 10
        }}
      />
      <Text
        numberOfLines={1}
        style={{
          fontSize: appTextStyle.largeSize + 2,
          fontWeight: 'bold',
          fontFamily: appTextStyle.fontFamily,
          color: this.props.themeStyle.textColor,
          width: WIDTH * 0.6,
          textAlign: 'center'
        }}>{label}</Text>
      <Text style={{
        fontSize: appTextStyle.smallSize + 2,
        fontFamily: appTextStyle.fontFamily,
        color: this.props.themeStyle.primary
      }}>{points}</Text>
    </View>
  )

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
        <SafeAreaView style={[styles.modalContainer, {
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }]}>
          <Toast
            ref={ref => { this.toast = ref }}
            style={{
              backgroundColor: '#c1c1c1'
            }}
            position='bottom'
            positionValue={300}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.mediumSize }}
          />

          <Spinner
            visible={this.state.spinVar}
          />
          <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, {
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }]}>

            <View style={[styles.totalView, {
              paddingVertical: 30,
              marginBottom: 10,
              backgroundColor: this.props.themeStyle.primary
            }]}>
              <Text style={[styles.totalPointsText, {
                fontSize: appTextStyle.largeSize + 24,
                fontFamily: appTextStyle.fontFamily,
                color: this.props.themeStyle.textTintColor

              }]}>{this.rewardPoints()}</Text>
              <Text style={{
                fontSize: appTextStyle.smallSize + 2,
                color: this.props.themeStyle.textTintColor,
                fontFamily: appTextStyle.fontFamily,
                paddingTop: 15
              }}>{this.props.language.Points}</Text>
            </View>

            <View key={'key'} style={[styles.totalView, styles.cardMainView, {
              backgroundColor: this.props.themeStyle.primaryBackgroundColor,
              borderColor: this.props.themeStyle.primary,
              justifyContent: 'flex-start',
              borderWidth: 1

            }]}>
              <Ionicons
                name={'server-outline'}
                style={{
                  color: this.props.themeStyle.primary,
                  fontSize: appTextStyle.largeSize + 4,
                  paddingHorizontal: 15
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: appTextStyle.mediumSize,
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.textColor,
                  textAlign: 'center',
                  paddingHorizontal: 6
                }}>{'How to get more Points?'}</Text>

            </View>

            {this.state.pointsArray.map((value, key) => (

              this.cardView(value.description, value.points, key)
            ))}

          </ScrollView>
          {this.state.pointsArray.length !== 0
            ? <TouchableOpacity
              style={styles.btnView}
              onPress={() => {
                this.setState({ spinVar: true }, () => {
                  this.redeemPoints()
                })
              }}
            >
              <View
                style={[styles.textView, {
                  backgroundColor: this.props.themeStyle.primary
                }]}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 13,
                    fontFamily: appTextStyle.fontFamily,
                    color: this.props.themeStyle.textTintColor,
                    padding: 10
                  }}>
                  {this.props.language.REDEEM}
                </Text>
              </View>
            </TouchableOpacity>
            : null}
        </SafeAreaView>
      )
    )
  }
}
const getTheme = (state) => state.appConfig.themeStyle
const getSettings = (state) => state.settingsCall.settings
const getLanguage = (state) => state.appConfig.languageJson

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
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  settings: getSettingsFun(state),
  language: getLanguageFun(state),
  isLoading: state
})

export default connect(mapStateToProps, null)(About)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  totalPointsText: {
    fontWeight: 'bold',
    paddingHorizontal: 3
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardMainView: {
    width: WIDTH * 0.95,
    alignSelf: 'center',
    paddingVertical: 12,
    marginBottom: 8,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderRadius: appTextStyle.customRadius - 15
  },
  btnView: {
    paddingTop: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1
  },
  totalView: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  textView: {
    alignItems: 'center',
    width: WIDTH * 0.8,
    marginBottom: 10,
    justifyContent: 'center',
    borderRadius: appTextStyle.customRadius
  }
})
