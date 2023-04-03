/* eslint-disable no-useless-escape */
import React, { PureComponent } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  I18nManager,
  SafeAreaView
} from 'react-native'
import { NavigationEvents } from 'react-navigation'

import { getUrl, getHttp, postHttp, putHttp } from '../common/WooComFetch'
import Button from '../common/Button'
import Spinner from 'react-native-loading-spinner-overlay'
import { UIActivityIndicator } from 'react-native-indicators'
import { createSelector } from 'reselect'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux'
import { appTextStyle } from '../common/Theme.style'
import {
  getCountry,
  getStates,
  getAddress,
  addAddressValue
} from '../redux/actions/actions'
import PageIndicator from '../common/pageIndicator'
const WIDTH = Dimensions.get('window').width

class ShippingAddress extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      headerForceInset: { top: 'never', vertical: 'never' },
      headerStyle: {
        backgroundColor: colorProps
      },
      headerTintColor: iconColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 2
      },
      headerTitleAlign: 'center'
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Payment,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      isModalVisible: false,
      countryModal: false,
      stateModal: false,
      firstName: '',
      lastName: '',
      latLang: '31.411861087325256, 73.10474523829687',
      countryArray: [],
      statesArray: [],
      selectedCountry: {
        country_id: 223,
        country_name: 'United States'
      },
      addressArray: [],
      selectedState: '',
      addressOne: '',
      company: '',
      zip: '',
      stateValue: '',
      spinnerTempTextInput: false,
      city: '',
      email: '',
      spinnerTemp: true,
      phone: '',
      indicator: true,
      delspinnerTemp: false,
      editAddressId: '',
      saveDefaultAddress: ''
    }
    this.toast = null

    this.props.getCountryCall(this)
  }

  setDefaultAddress = async (id, defaultAddress) => {
    this.props.addAddressCall(this.state.firstName, this.state.lastName,
      this.state.selectedCountry, this.state.selectedState, this.state.addressOne,
      this.state.company, this.state.zip, this.state.stateValue,
      this.state.city, this.state.email, this.state.phone, this.state.latLang)
    this.setState({ spinnerTemp: true })
    const url = 'customer_address_book/' + id
    const data = {}
    data.gender = 'Male'
    data.first_name = this.state.firstName
    data.last_name = this.state.lastName
    data.company = this.state.company
    data.street_address = this.state.addressOne
    data.suburb = 'Test suburb'
    data.postcode = this.state.zip
    data.dob = '1994-12-12'
    data.city = this.state.city
    data.country_id = this.state.selectedCountry.country_id
    data.state_id = this.state.selectedState.id
    data.latlong = '31.411861087325256, 73.10474523829687'
    data.is_default = defaultAddress
    data.phone = this.state.phone
    const json = await putHttp(getUrl() + url, data)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        this.toast.show(json.data.message)
        this.setState({
          isModalVisible: false,
          countryModal: false,
          stateModal: false,
          temp: false,
          editAddressId: '',
          saveDefaultAddress: ''
        }, () => {
          this.getProducts()
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

  canBeSubmitted () {
    const {
      firstName, lastName, selectedCountry, addressOne, zip, selectedState,
      city, phone, latLang
    } = this.state
    return (
      firstName.length > 0 &&
      lastName.length > 0 &&
      addressOne.length > 0 &&
      zip.length > 0 &&
      Object.keys(selectedState).length > 0 &&
      city.length > 0 &&
      phone.length > 0 &&
      latLang.length > 0
    )
  }

  getProducts = async () => {
    if (Object.keys(this.props.userData).length > 0) {
      this.setState({ temp: true })
      let url = 'customer_address_book'
      url += '?limit=' + 10
      url += '&language_id=' + this.props.settings.language_id
      url += '&currency=' + this.props.settings.currency_id
      const json = await getHttp(getUrl() + url, {})
      if (json.status === 'success') {
        if (json.data.status === 'Success') {
          this.setState({
            addressArray: json.data.data,
            temp: false,
            isRefreshing: false,
            refreshing: false,
            page: this.state.page + 1,
            spinnerTemp: false,
            indicator: false,
            delspinnerTemp: false
          })
        } else {
          this.toast.show(json.data.message)
          this.setState({
            temp: false,
            isRefreshing: false,
            refreshing: false,
            spinnerTemp: false,
            indicator: false,
            delspinnerTemp: false
          })
        }
      } else {
        this.toast.show(json.data.data.message)
        this.setState({
          temp: false,
          isRefreshing: false,
          refreshing: false,
          spinnerTemp: false,
          indicator: false,
          delspinnerTemp: false
        })
      }
    }
  }

  saveFun = async () => {
    this.props.addAddressCall(this.state.firstName, this.state.lastName,
      this.state.selectedCountry, this.state.selectedState, this.state.addressOne,
      this.state.company, this.state.zip, this.state.stateValue,
      this.state.city, this.state.email, this.state.phone, this.state.latLang)

    if (Object.keys(this.props.userData).length > 0) {
      this.setState({ spinnerTempTextInput: true })
      let url = 'customer_address_book'
      url += '?limit=' + 10
      url += '&language_id=' + this.props.settings.language_id
      url += '&currency=' + this.props.settings.currency_id
      const data = {}
      data.first_name = this.state.firstName
      data.last_name = this.state.lastName
      data.gender = 'Male'
      data.company = this.state.company
      data.street_address = this.state.addressOne
      data.suburb = 'Test suburb'
      data.postcode = this.state.zip
      data.dob = '1994-12-12'
      data.city = this.state.city
      data.country_id = this.state.selectedCountry.country_id
      data.state_id = this.state.selectedState.id
      data.latlong = this.state.latLang
      data.is_default = '1'
      data.phone = this.state.phone
      const json = await postHttp(getUrl() + 'customer_address_book', data)
    }
    this.setState({
      isModalVisible: false,
      countryModal: false,
      stateModal: false,
      temp: false,
      spinnerTempTextInput: false

    })
    this.getProducts()
    this.props.navigation.navigate('ShippingMethodScreen')
  }

  saveFunContinue = () => {
    const markers = [...this.state.addressArray]
    const index = markers.findIndex(el => Number(el.default_address) === 1)
    this.props.addAddressCall(markers[index].customer.customer_first_name,
      markers[index].customer.customer_last_name,
      markers[index].country_id,
      markers[index].state_id,
      markers[index].street_address,
      markers[index].company, markers[index].postcode,
      '',
      markers[index].city, markers[index].customer.customer_email,
      '0418862222', markers[index].latlong)
    this.props.navigation.navigate('ShippingMethodScreen')
  }

  refresh = (name, selectedValue) => {
    this.setState({
      isModalVisible: true,
      selectedCountry: name
    })
  }

  /// //////
  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: this.props.themeStyle.secondryBackgroundColor
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
            marginBottom: 60
          }}>

          <NavigationEvents
            onDidFocus={() => {
              this.getProducts()
            }}
          />
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
            textStyle={{
              backgroundColor: this.props.themeStyle.loadingIndicatorColor,
              color: this.props.themeStyle.primary
            }}
          />
          <Modal onRequestClose={() => {
            this.setState({
              isModalVisible: false
            })
          }} visible={this.state.isModalVisible} animationType={'fade'}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: this.props.themeStyle.secondryBackgroundColor
              }}>
              <SafeAreaView style={[styles.modalContainer, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>

                {/* Country modal */}

                <Modal onRequestClose={() => {
                  this.setState({
                    countryModal: false
                  })
                }} visible={this.state.countryModal} animationType={'fade'}>

                  <SafeAreaView style={[styles.modalContainer, { backgroundColor: this.props.themeStyle.primaryBackgroundColor }]}>

                    <View style={[styles.headerBar, {
                      width: WIDTH,
                      backgroundColor: this.props.themeStyle.primaryBackgroundColor

                    }]}>
                      <TouchableOpacity onPress={() => { this.setState({ countryModal: false }) }} >
                        <FontAwesome
                          style={{
                            color: this.props.themeStyle.textColor,
                            fontSize: appTextStyle.largeSize + 4
                          }}
                          active
                          name={'close'}
                        />
                      </TouchableOpacity>
                      <View style={{
                        width: WIDTH * 0.59
                      }}>
                        <Text style={[{
                          color: this.props.themeStyle.textColor,
                          fontSize: appTextStyle.largeSize,
                          fontFamily: appTextStyle.fontFamily
                        }]}>
                          {'Select Country'}
                        </Text>
                      </View>
                    </View>
                    <ScrollView style={{ backgroundColor: this.props.themeStyle.backgroundColor }}>

                      {this.state.countryArray.length > 0
                        ? this.state.countryArray.map(element => (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                selectedCountry: element,
                                countryModal: false
                              })
                            }}
                            style={styles.arrayElementRow}>
                            <Text style={[{
                              color: this.props.themeStyle.textColor,
                              fontFamily: appTextStyle.fontFamily,
                              fontSize: appTextStyle.largeSize
                            }]}>
                              {element.country_name}
                            </Text>
                            {this.state.selectedCountry.country_id === element.country_id
                              ? <FontAwesome
                                style={{
                                  color: this.props.themeStyle.textColor,
                                  fontSize: appTextStyle.largeSize
                                }}
                                active
                                name={'check'}
                              /> : null}
                          </TouchableOpacity>
                        )) : null
                      }
                    </ScrollView>
                  </SafeAreaView>

                </Modal>

                {/* State modal */}

                <Modal onRequestClose={() => {
                  this.setState({
                    stateModal: false
                  })
                }} visible={this.state.stateModal} animationType={'fade'}>

                  <SafeAreaView style={[styles.modalContainer, { backgroundColor: this.props.themeStyle.primaryBackgroundColor }]}>

                    <View style={[styles.headerBar, {
                      width: WIDTH,
                      backgroundColor: this.props.themeStyle.primaryBackgroundColor

                    }]}>
                      <TouchableOpacity onPress={() => { this.setState({ stateModal: false }) }} >
                        <FontAwesome
                          style={{
                            color: this.props.themeStyle.textColor,
                            fontSize: appTextStyle.largeSize + 4
                          }}
                          active
                          name={'close'}
                        />
                      </TouchableOpacity>
                      <View style={{
                        width: WIDTH * 0.59
                      }}>
                        <Text style={[{
                          color: this.props.themeStyle.textColor,
                          fontFamily: appTextStyle.fontFamily,
                          fontSize: appTextStyle.largeSize
                        }]}>
                          {'Select State'}
                        </Text>
                      </View>
                    </View>
                    <ScrollView style={{
                      backgroundColor: this.props.themeStyle.backgroundColor,
                      paddingTop: 10
                    }}>

                      {this.state.statesArray.length > 0
                        ? this.state.statesArray.map(element => (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                selectedState: element,
                                stateModal: false
                              })
                            }}
                            style={styles.arrayElementRow}>
                            <Text style={[{
                              color: this.props.themeStyle.textColor,
                              fontFamily: appTextStyle.fontFamily,
                              fontSize: appTextStyle.largeSize
                            }]}>
                              {element.name}
                            </Text>
                            {this.state.selectedState.name === element.name
                              ? <FontAwesome
                                style={{
                                  color: this.props.themeStyle.textColor,
                                  fontSize: appTextStyle.largeSize
                                }}
                                active
                                name={'check'}
                              /> : null}
                          </TouchableOpacity>
                        )) : <UIActivityIndicator
                          size={20}
                          count={12}
                          color={this.props.themeStyle.primary}
                        />

                      }
                    </ScrollView>
                  </SafeAreaView>

                </Modal>

                <View style={[styles.headerBar, {
                  width: WIDTH,
                  backgroundColor: this.props.themeStyle.primaryBackgroundColor

                }]}>
                  <TouchableOpacity
                    onPress={() => { this.setState({ isModalVisible: false }) }}
                  >
                    <FontAwesome
                      style={{
                        color: this.props.themeStyle.textColor,
                        fontSize: appTextStyle.largeSize + 4
                      }}
                      active
                      name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
                    />
                  </TouchableOpacity>
                  <View style={{
                    width: WIDTH * 0.57
                  }}>
                    <Text style={[{
                      color: this.props.themeStyle.textColor,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.largeSize + 1
                    }]}>
                      {'CheckOut'}
                    </Text>
                  </View>
                </View>
                <Spinner
                  visible={this.state.spinnerTempTextInput}
                  textStyle={{
                    backgroundColor: this.props.themeStyle.loadingIndicatorColor,
                    color: this.props.themeStyle.primary
                  }}
                />
                <View style={[styles.pageIndicatorStlye, {
                  backgroundColor: this.props.themeStyle.primaryBackgroundColor
                }]}>
                  <PageIndicator th={this} selected={1}
                    backgroundColor={this.props.themeStyle.primaryBackgroundColor
                    }
                    language={this.props.language} />
                </View>
                <TouchableOpacity
                >
                  <Text style={[styles.headingText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>
                    {this.props.language['Shipping Address']}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.headingTwoText, {
                  color: this.state.firstName.length > 0
                    ? this.props.themeStyle.textColor : 'red',
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* '}<Text style={[styles.headingTwoText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>{this.props.language['First Name']}
                  </Text>
                </Text>
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor
                  }]}
                  selectionColor='#51688F'
                  placeholder={this.props.language['First Name']}
                  placeholderTextColor={'#c0c0c0'}
                  onChangeText={text => {
                    this.setState({ firstName: text })
                  }}
                  value={this.state.firstName}
                />
                <Text style={[styles.headingTwoText, {
                  color: this.state.lastName.length > 0
                    ? this.props.themeStyle.textColor : 'red',
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* '} <Text style={[styles.headingTwoText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>{this.props.language['Last Name']}/</Text>
                </Text>
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                    borderLeftWidth: 1
                  }]}
                  selectionColor='#51688F'
                  placeholder={this.props.language['Last Name']}
                  placeholderTextColor={'#c0c0c0'}
                  onChangeText={text => {
                    this.setState({ lastName: text })
                  }}
                  value={this.state.lastName}
                />
                {/* /////// */}

                {/* /////// */}
                <Text style={[styles.headingTwoText, {
                  color: this.state.latLang.length > 0
                    ? this.props.themeStyle.textColor : 'red',
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* '}<Text style={[styles.headingTwoText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>{this.props.language.Location}
                  </Text>
                </Text>
                {/* <Text style={[styles.headingTwoText, {
                  color: this.state.latLang.length > 0
                    ? this.props.themeStyle.textColor : 'red',
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* ' + this.props.language.Location}
                </Text> */}

                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isModalVisible: false,
                      countryModal: false,
                      stateModal: false,
                      temp: false,
                      spinnerTempTextInput: false

                    }, () => {
                      this.props.navigation.navigate('MapScreen', {
                        onGoBackFun: (cord) => {
                          const orderDetails = {}
                          orderDetails.latitude = cord.latitude
                          orderDetails.longitude = cord.longitude
                          orderDetails.delivery_location = cord.latitude + ', ' + cord.longitude
                          this.setState({
                            latLang: cord.latitude + ', ' + cord.longitude,
                            isModalVisible: true
                          })
                        }
                      })
                    })
                  }
                  }
                  style={[styles.stateCountryStyles, {
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                    padding: 4

                  }]}>

                  <Text style={[{
                    fontFamily: appTextStyle.fontFamily,
                    color: this.state.selectedState === '' ? '#c0c0c0' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize
                  }]}>
                    {this.state.latLang.length > 0 ? this.state.latLang : this.props.language.Location}
                  </Text>

                  <FontAwesome
                    name={'map-marker'}
                    style={{
                      color: this.props.themeStyle.primary,
                      fontSize: appTextStyle.largeSize + 10,
                      paddingRight: 0
                    }}
                  />

                </TouchableOpacity>
                {/* /////// */}
                <Text style={[styles.headingTwoText, {
                  color: this.props.themeStyle.textColor,
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* ' + this.props.language.Country}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    // this.setState({ countryModal: true },()=>{
                    this.setState({ isModalVisible: false }, () => {
                      this.props.navigation.navigate('SearchFilterClass', {
                        data: this.state.countryArray,
                        onSelectionBase: 'shipping',
                        onGoBack: (name, selectedValue) =>
                          this.refresh(name, selectedValue)
                      })
                    })
                  }}
                  // onPress={() => { this.setState({ countryModal: true }) }}
                  style={[styles.stateCountryStyles, {
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor
                  }]}>

                  <Text style={[{
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    fontSize: appTextStyle.mediumSize
                  }]}>
                    {this.state.selectedCountry.country_name}
                  </Text>

                  <FontAwesome
                    style={{
                      color: this.props.themeStyle.textColor,
                      fontSize: appTextStyle.smallSize
                    }}
                    active
                    name={'chevron-down'}
                  />

                </TouchableOpacity>
                <Text style={[styles.headingTwoText, {
                  color: this.state.addressOne.length
                    ? this.props.themeStyle.textColor : 'red',
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* '}<Text style={[styles.headingTwoText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>{this.props.language.AddressLineOne}</Text>
                </Text>
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor
                  }]}
                  selectionColor='#51688F'
                  placeholder={this.props.language.AddressLineOne}
                  placeholderTextColor={'#c0c0c0'}
                  onChangeText={text => {
                    this.setState({ addressOne: text })
                  }}
                  value={this.state.addressOne}
                />
                <Text style={[styles.headingTwoText, {
                  color: this.props.themeStyle.textColor,
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* ' + this.props.language.AddressLineTwo}
                </Text>
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor
                  }]}
                  selectionColor='#51688F'
                  placeholder={this.props.language.AddressLineTwo}
                  placeholderTextColor={'#c0c0c0'}
                  onChangeText={text => {
                    this.setState({ company: text })
                  }}
                  value={this.state.company}
                />
                <Text style={[styles.headingTwoText, {
                  color: this.state.zip.length > 0
                    ? this.props.themeStyle.textColor : 'red',
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* '}<Text style={[styles.headingTwoText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>{this.props.language.zip}</Text>
                </Text>
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor
                  }]}
                  selectionColor='#51688F'
                  placeholder={this.props.language.zip}
                  placeholderTextColor={'#c0c0c0'}
                  onChangeText={text => {
                    this.setState({ zip: text })
                  }}
                  value={this.state.zip}
                />
                <Text style={[styles.headingTwoText, {
                  color: Object.keys(this.state.selectedState).length > 0
                    ? this.props.themeStyle.textColor : 'red',
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* '}<Text style={[styles.headingTwoText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>{this.props.language.State}</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      stateModal: true,
                      spinnerTemp: true,
                      statesArray: []
                    }, () => {
                      this.props.getStatesCall(this, this.state.selectedCountry.country_id,
                        this.props.settings.language_id, this.props.language)
                    })
                  }}
                  style={[styles.stateCountryStyles, {
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor

                  }]}>

                  <Text style={[{
                    fontFamily: appTextStyle.fontFamily,
                    color: this.state.selectedState === '' ? '#c0c0c0' : this.props.themeStyle.textColor,
                    fontSize: appTextStyle.mediumSize
                  }]}>
                    {this.state.selectedState === '' ? this.props.language.State : this.state.selectedState.name}
                  </Text>

                  <FontAwesome
                    style={{
                      color: this.props.themeStyle.textColor,
                      fontSize: appTextStyle.smallSize
                    }}
                    active
                    name={'chevron-down'}
                  />

                </TouchableOpacity>

                <Text style={[styles.headingTwoText, {
                  color: this.state.city.length > 0
                    ? this.props.themeStyle.textColor : 'red',
                  fontFamily: appTextStyle.fontFamily,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* '}<Text style={[styles.headingTwoText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>{this.props.language.City}</Text>
                </Text>
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor
                  }]}
                  selectionColor='#51688F'
                  placeholder={this.props.language.City}
                  placeholderTextColor={'#c0c0c0'}
                  onChangeText={text => {
                    this.setState({ city: text })
                  }}
                  value={this.state.city}
                />

                <Text style={[styles.headingTwoText, {
                  fontFamily: appTextStyle.fontFamily,
                  color: this.state.phone.length > 0
                    ? this.props.themeStyle.textColor : 'red',
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {'* '}<Text style={[styles.headingTwoText, {
                    fontFamily: appTextStyle.fontFamily,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>{this.props.language.Phone}</Text>
                </Text>
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor
                  }]}
                  keyboardType={'number-pad'}
                  selectionColor='#51688F'
                  placeholder={this.props.language.Phone}
                  placeholderTextColor={'#c0c0c0'}
                  onChangeText={text => {
                    this.setState({ phone: text })
                  }}
                  value={this.state.phone}
                />
                <View style={{
                  marginVertical: 10,
                  width: WIDTH
                }}>
                  <Button onPress={() => {
                    if (this.canBeSubmitted()) {
                      this.setState({
                        spinnerTempTextInput: true
                      }, () => {
                        this.saveFun()
                      })
                    }
                  }}
                  borderRadius={true}
                  disable={!!this.canBeSubmitted()} themeStyle={this.props.themeStyle}
                  navigation={this.props.navigation}
                  title={this.props.language.SaveAndCon}
                  ></Button>
                </View>

              </SafeAreaView>
            </ScrollView>
          </Modal>

          <View style={[styles.pageIndicatorStlye, {
            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
            paddingTop: 30
          }]}>
            <PageIndicator th={this} selected={1}
              backgroundColor={this.props.themeStyle.primaryBackgroundColor
              }
              language={this.props.language} />
          </View>

          <View style={{
            marginVertical: 9,
            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
            width: WIDTH
          }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isModalVisible: true
                })
              }}
              style={styles.addAddressBtn}>

              <FontAwesome
                name={'plus'}
                style={{
                  color: this.props.themeStyle.primary,
                  fontSize: appTextStyle.largeSize + 2,
                  paddingHorizontal: 9
                }}
              />

              <Text style={[{
                fontFamily: appTextStyle.fontFamily,
                color: this.props.themeStyle.textColor,
                fontSize: appTextStyle.largeSize + 1
              }]}>
                {this.props.language['Add a New Address']}
              </Text>
              <View>

              </View>
            </TouchableOpacity>
          </View>
          {this.state.indicator

            ? <UIActivityIndicator
              size={20}
              count={12}
              color={this.props.themeStyle.primary}
            /> : null}
          {this.state.addressArray.map((item) => (
            <View
              style={[styles.cardView, {
                backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                borderWidth: 1,
                borderColor: Number(item.default_address) === 1 ? this.props.themeStyle.primary : this.props.themeStyle.primaryBackgroundColor
              }]}>

              <FontAwesome
                name={'map-marker'}
                style={{
                  color: this.props.themeStyle.iconPrimaryColor,
                  fontSize: appTextStyle.largeSize + 12,
                  paddingRight: 22
                }}
              />

              <View>
                <Text style={[{
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.largeSize
                }]}>
                  {item.customer.customer_first_name + ' ' + item.customer.customer_last_name}
                </Text>
                <Text style={[styles.addressText, {
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.iconPrimaryColor,
                  fontSize: appTextStyle.mediumSize
                }]}>
                  {item.country_id.country_name}
                </Text>
                <Text style={[{
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.iconPrimaryColor,
                  fontSize: appTextStyle.mediumSize
                }]}>
                  {item.street_address + ' ' + item.city + ' ' + item.postcode}
                </Text>

                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <TouchableOpacity onPress={() => {
                    this.setState({
                      delspinnerTemp: true,
                      firstName: item.customer.customer_first_name,
                      lastName: item.customer.customer_last_name,
                      selectedCountry: item.country_id,
                      selectedState: item.state_id,
                      addressOne: item.street_address,
                      company: item.company,
                      zip: item.postcode,
                      city: item.city,
                      email: item.customer.customer_email,
                      editAddressId: item.id,
                      saveDefaultAddress: item.default_address,
                      phone: item.phone
                    }, () => {
                      this.setDefaultAddress(this.state.editAddressId, '1')
                    })
                  }}>
                    <Text style={[{
                      fontFamily: appTextStyle.fontFamily,
                      color: this.props.themeStyle.primary,
                      fontSize: appTextStyle.largeSize,
                      marginRight: 9
                    }]}>
                      {'Set Default'}
                    </Text>
                  </TouchableOpacity>

                </View>

              </View>

            </View>
          ))}

        </ScrollView>
        <View style={{
          position: 'absolute',
          bottom: 15,

          width: WIDTH
        }}>
          <Button onPress={() => {
            if (this.state.addressArray.length === 0) {
              this.setState({
                isModalVisible: true
              })
            } else {
              this.saveFunContinue()
            }
          }}
          disable={true} themeStyle={this.props.themeStyle}
          navigation={this.props.navigation}
          borderRadius={true}
          title={this.props.language.Continue}
          ></Button>
        </View>
      </View>
    )
  }
}
const mapDispatchToProps = dispatch => ({
  getAddressCall: (th) => {
    dispatch(async dispatch => {
      await getAddress(dispatch, th)
    })
  },
  getCountryCall: (th) => {
    dispatch(async dispatch => {
      await getCountry(dispatch, th)
    })
  },
  getStatesCall: (th, id, langId, lang) => {
    dispatch(async dispatch => {
      await getStates(dispatch, th, id, langId, lang)
    })
  },
  addAddressCall: (firstName, lastName, selectedCountry, selectedState, addressOne,
    company, zip, stateValue, city, email, phone, latLong) =>
    dispatch(addAddressValue(firstName, lastName, selectedCountry, selectedState,
      addressOne, company, zip, stateValue, city, email, phone, latLong))

})

const getTheme = (state) => state.appConfig.themeStyle
const getSessionId = (state) => state.userData.sessionId
const getUserData = (state) => state.userData.user
const getSettings = (state) => state.settingsCall.settings

const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
const getSessionIdFun = createSelector(
  [getSessionId],
  (getSessionId) => {
    return getSessionId
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
  sessionId: getSessionIdFun(state),
  userData: getUserDataFun(state),
  settings: getSettingsFun(state)

})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14
  },
  textInputStyle: {
    height: 36,
    width: '94%',
    borderColor: '#e6e8e9',
    borderWidth: 1,
    alignSelf: 'center',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 2
  },
  stateCountryStyles: {
    width: '94%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#e6e8e9',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 8,
    paddingHorizontal: 10
  },
  addAddressBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  pageIndicatorStlye: {
    width: WIDTH,
    paddingBottom: 40,
    paddingTop: 10
  },
  arrayElementRow: {
    flexDirection: 'row',
    width: WIDTH,
    justifyContent: 'space-between',
    padding: 10
  },
  textInputRow: {
    flexDirection: 'row'
  },
  headingText: {
    fontSize: appTextStyle.largeSize,
    paddingVertical: 20,
    width: WIDTH,
    textAlign: 'center'
  },
  headingTwoText: {
    fontSize: appTextStyle.largeSize,
    paddingVertical: 8,
    width: WIDTH,
    paddingHorizontal: 12
  },
  cardView: {
    marginBottom: 9,
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14
  },
  addressText: {
    paddingTop: 4,
    paddingBottom: 1
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddress)
