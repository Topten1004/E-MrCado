import React, { Component } from 'react'
import {
  Text,
  View,
  Dimensions,
  PermissionsAndroid,
  Platform,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { appTextStyle } from '../common/Theme.style'
import { createSelector } from 'reselect'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import Toast from 'react-native-easy-toast'
import Spinner from 'react-native-loading-spinner-overlay'
const { width } = Dimensions.get('window')
class RewardPoints extends Component {
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

  async componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language['Map Screen'],
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
    if (Platform.OS === 'android') {
      await this.requestLocationPermission()
    } else {
      Geolocation.getCurrentPosition(
        info => {
          const newCoords = {}
          newCoords.latitude = parseFloat(JSON.stringify(info.coords.latitude))
          newCoords.longitude = parseFloat(
            JSON.stringify(info.coords.longitude)
          )
          newCoords.latitudeDelta = 0.09
          newCoords.longitudeDelta = 0.09
          this.setState({
            x: newCoords,
            spinnerTemp: false
          })
        },

        error => {
          this.toast.show(error.message + this.props.language[
            'Press and hold the marker to set location'
          ])
          this.setState(
            {
              spinnerTemp: false
            }
          )
        },
        {
          enableHighAccuracy: false,
          timeout: 20000
        }
      )
    }
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Namal',
          message: 'Namal' + 'App access to your location ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          info => {
            const newCoords = {}
            newCoords.latitude = parseFloat(
              JSON.stringify(info.coords.latitude)
            )
            newCoords.longitude = parseFloat(
              JSON.stringify(info.coords.longitude)
            )
            newCoords.latitudeDelta = 0.09
            newCoords.longitudeDelta = 0.09
            this.setState({
              x: newCoords,
              spinnerTemp: false
            })
          },
          error => {
            this.toast.show(error.message + this.props.language[
              'Press and hold the marker to set location'
            ])
            this.setState(
              {
                spinnerTemp: false
              }
            )
          },
          {
            enableHighAccuracy: false,
            timeout: 20000
          }
        )
      } else {
        this.toast.show(this.props.language[
          'Press and hold the marker to set location'
        ])
        this.setState(
          {
            spinnerTemp: false
          }
        )
      }
    } catch (err) {
      this.toast.show(this.props.language[
        'Press and hold the marker to set location'
      ])
      this.setState(
        {
          spinnerTemp: false
        }
      )
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      x: {
        latitude: 32.100847,
        longitude: 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
      },
      spinnerTemp: false
    }
    this.toast = null
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.spinnerTemp} />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: '#c1c1c1' }}
          position='bottom'
          positionValue={200}
          fadeOutDuration={7000}
        />
        <MapView
          showsUserLocation={true}
          style={{ flex: 1, marginBottom: 40, marginTop: 10 }}
          showsMyLocationButton={true}
          initialRegion={this.state.x}
          region={this.state.x}>
          <Marker
            draggable
            coordinate={this.state.x}
            title={this.props.language.Address}
            onDragEnd={e => {
              const newCoords = {}
              newCoords.latitude = e.nativeEvent.coordinate.latitude
              newCoords.longitude = e.nativeEvent.coordinate.longitude
              newCoords.latitudeDelta = 0.09
              newCoords.longitudeDelta = 0.09
              this.setState({ x: newCoords })
            }}
            description={
              this.props.language['My Location']
            }
          />
        </MapView>
        <View
          style={{
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 12,
            top: 0,
            width
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: appTextStyle.mediumSize,
              fontWeight: '500'
            }}>
            {
              this.props.language[
                'Press and hold the marker to set location'
              ]
            }
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.state.params.onGoBackFun(this.state.x)
            this.props.navigation.pop()
          }}
          style={{
            flex: 1,
            bottom: 0,
            position: 'absolute',
            width: width,
            borderColor: '#fff',
            alignItems: 'center',
            height: 42,
            backgroundColor: 'red',
            justifyContent: 'center'
          }}>
          <Text
            style={{
              fontSize: appTextStyle.mediumSize,
              fontWeight: '500',
              position: 'absolute'
            }}>
            {this.props.language['Set this location']}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const getLanguage = (state) => state.appConfig.languageJson
const getTheme = (state) => state.appConfig.themeStyle

const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)

const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const mapStateToProps = state => ({
  isLoading: state,
  language: getLanguageFun(state),
  themeStyle: getThemeFun(state)
})

export default connect(mapStateToProps, null)(RewardPoints)
