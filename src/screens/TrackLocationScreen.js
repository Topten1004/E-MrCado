import React, { Component } from 'react'
import {
  View,
  PermissionsAndroid,
  Platform,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import database from '@react-native-firebase/database'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { appTextStyle } from '../common/Theme.style'
import MapView, { Marker } from 'react-native-maps'
import Spinner from 'react-native-loading-spinner-overlay'
import { createSelector } from 'reselect'
import Geolocation from '@react-native-community/geolocation'
import Toast from 'react-native-easy-toast'

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

  constructor (props) {
    super(props)

    this.state = {
      x: {
        latitude:
          this.props.navigation.state.params.data.latlong.split(',')[0] !== null &&
            this.props.navigation.state.params.data.latlong.split(',')[0] !==
            undefined
            ? parseFloat(
              this.props.navigation.state.params.data.latlong.split(',')[0]
            )
            : 32.100847,
        longitude:
          this.props.navigation.state.params.data.latlong.split(',')[1] !== null &&
            this.props.navigation.state.params.data.latlong.split(',')[1] !==
            undefined
            ? parseFloat(
              this.props.navigation.state.params.data.latlong.split(',')[1]
            )
            : 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
      },
      deliveryBoyLatLong: {
        latitude:
          this.props.navigation.state.params.data.latlong.split(',')[0] !== null &&
            this.props.navigation.state.params.data.latlong.split(',')[0] !==
            undefined
            ? parseFloat(
              this.props.navigation.state.params.data.latlong.split(',')[0]
            )
            : 32.100847,
        longitude:
          this.props.navigation.state.params.data.latlong.split(',')[1] !== null &&
            this.props.navigation.state.params.data.latlong.split(',')[1] !==
            undefined
            ? parseFloat(
              this.props.navigation.state.params.data.latlong.split(',')[1]
            )
            : 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
      },
      SpinnerTemp: false
    }
    this.mapRef = null
    this.toast = null
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
      database()
        .ref(
          'location/' +
          this.props.navigation.state.params.data
            .delivery_boy_id
        )
        .on('value', snapshot => {
          const newCoords = {}
          newCoords.latitude = parseFloat(snapshot.val().latitude)
          newCoords.longitude = parseFloat(snapshot.val().longitude)

          newCoords.latitudeDelta = 0.09
          newCoords.longitudeDelta = 0.09
          this.setState(
            {
              deliveryBoyLatLong: newCoords
            },
            () => {
            }
          )
        })

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
          enableHighAccuracy: true,
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
          title: 'themeStyle.title',
          message: 'App access to your location ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        database()
          .ref(
            'location/' +
            this.props.navigation.state.params.data
              .delivery_boy_id
          )
          .on('value', snapshot => {
            const newCoords = {}
            newCoords.latitude = parseFloat(snapshot.val().latitude)
            newCoords.longitude = parseFloat(snapshot.val().longitude)

            newCoords.latitudeDelta = 0.09
            newCoords.longitudeDelta = 0.09
            this.setState(
              {
                deliveryBoyLatLong: newCoords
              },
              () => {
              }
            )
          })

        // current location

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
        Alert.alert('Please Turn On Device Location')
      }
    } catch (err) {
      Alert.alert(err)
    }
  }

  onLayout = () => {
    setTimeout(() => {
      if (
        this.state.deliveryBoyLatLong !== null &&
        this.state.deliveryBoyLatLong !== undefined &&
        this.state.x !== null &&
        this.state.x !== undefined
      ) {
        if (this.mapRef !== null) {
          this.mapRef.fitToCoordinates(
            [this.state.deliveryBoyLatLong, this.state.x],
            {
              edgePadding: { top: 200, right: 200, bottom: 200, left: 200 },
              animated: false,
              useNativeDriver: true
            }
          )
        }
      }
    }, 3000)
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.SpinnerTemp} />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <MapView
          showsUserLocation={true}
          ref={ref => {
            this.mapRef = ref
          }}
          style={{ flex: 1 }}
          showsMyLocationButton={true}
          onMapReady={this.onLayout}
          initialRegion={this.state.deliveryBoyLatLong}
          region={this.state.deliveryBoyLatLong}>
          {this.props.navigation.state.params.data.latlong.split(',')[0] !== null &&
            this.props.navigation.state.params.data.latlong.split(',')[0] !==
            undefined &&
            this.props.navigation.state.params.data.latlong.split(',')[1] !== null &&
            this.props.navigation.state.params.data.latlong.split(',')[1] !==
            undefined ? (
              <Marker
                coordinate={{
                  latitude: parseFloat(
                    this.state.x.latitude
                  ),
                  longitude: parseFloat(
                    this.state.x.longitude
                  )
                }}
                title={this.props.language.Address}
                description={
                  this.props.language['My Location']
                }
              />
            ) : null}
          <Marker
            coordinate={this.state.deliveryBoyLatLong}
            title={this.props.language.Address}
            description={
              this.props.language['Delivery Boy']
            }
            pinColor={appTextStyle.primary}
          />
        </MapView>
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
