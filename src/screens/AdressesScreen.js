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
import Toast from 'react-native-easy-toast'
import { getUrl, getHttp, postHttp, deleteHttp, putHttp } from '../common/WooComFetch'
import Button from '../common/Button'
import { NavigationEvents } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import { UIActivityIndicator } from 'react-native-indicators'
import { createSelector } from 'reselect'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { appTextStyle } from '../common/Theme.style'
import {
  getCountry,
  getStates,
  getAddress,
  addAddressValue
} from '../redux/actions/actions'
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
      headerTitle: this.props.language.Address,
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
      city: '',
      email: '',
      spinnerTemp: false,
      phone: '',
      indicator: true,
      delspinnerTemp: false,
      editAddressId: '',
      saveDefaultAddress: ''
    }
    this.toast = null
    this.props.getCountryCall(this)
  }

  getProducts = async () => {
    if (Object.keys(this.props.userData).length > 0) {
      this.setState({ temp: true })
      let url = 'customer_address_book'
      url += '?limit=' + 10
      url += '&language_id=' + this.props.settings.language_id
      url += '&currency=' + this.props.settings.currency_id
      const json = await getHttp(getUrl() + url, {})
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
    }
  }

  deleteAddress = async (id) => {
    this.setState({ delspinnerTemp: true })
    const url = 'customer_address_book/' + id
    const json = await deleteHttp(getUrl() + url, {})
    this.getProducts()
  }

  setDefaultAddress = async (id, defaultAddress) => {
    this.props.addAddressCall(this.state.firstName, this.state.lastName,
      this.state.selectedCountry, this.state.selectedState, this.state.addressOne,
      this.state.company, this.state.zip, this.state.stateValue,
      this.state.city, this.state.email, this.state.phone, this)
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
    data.lattitude = '123'
    data.longitude = '321'
    data.is_default = defaultAddress
    data.latlong = '31.411861087325256, 73.10474523829687'
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

  editAddress = async (id) => {
    this.props.addAddressCall(this.state.firstName, this.state.lastName,
      this.state.selectedCountry, this.state.selectedState, this.state.addressOne,
      this.state.company, this.state.zip, this.state.stateValue,
      this.state.city, this.state.email, this.state.phone, this)
    this.setState({ spinnerTemp: true })
    const url = 'customer_address_book/' + id
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
    data.lattitude = '123'
    data.longitude = '321'
    data.latlong = '31.411861087325256, 73.10474523829687'
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

  setSearchState = (value) => {
    this.setState({ searchString: value })
  }

  saveFun = async () => {
    this.props.addAddressCall(this.state.firstName, this.state.lastName,
      this.state.selectedCountry, this.state.selectedState, this.state.addressOne,
      this.state.company, this.state.zip, this.state.stateValue,
      this.state.city, this.state.email, this.state.phone, this)

    if (Object.keys(this.props.userData).length > 0) {
      this.setState({ spinnerTemp: true })
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
      data.lattitude = '123'
      data.longitude = '321'
      data.is_default = '1'
      data.latlong = '31.411861087325256, 73.10474523829687'
      data.phone = this.state.phone
      const json = await postHttp(getUrl() + 'customer_address_book', data)
      if (json.status === 'success') {
        if (json.data.status === 'Success') {
          this.toast.show(json.data.message)
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
    this.setState({
      isModalVisible: false,
      countryModal: false,
      stateModal: false,
      temp: false

    })
    this.getProducts()
  }

  canBeSubmitted () {
    const {
      firstName, lastName, selectedCountry, addressOne, zip, selectedState,
      city, phone, company
    } = this.state
    return (
      firstName.length > 0 &&
     lastName.length > 0 &&
     addressOne.length > 0 &&
     zip.length > 0 &&
     Object.keys(selectedState).length > 0 &&
     city.length > 0 &&
     phone.length > 0
    )
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
      <View style={{ flex: 1 }}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}>
          <Spinner
            visible={this.state.delspinnerTemp}
            textStyle={{
              backgroundColor: this.props.themeStyle.loadingIndicatorColor,
              color: this.props.themeStyle.primary
            }}
          />
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

          <Modal onRequestClose={() => {
            this.setState({
              isModalVisible: false
            })
          }} visible={this.state.isModalVisible} animationType={'fade'}>

            <SafeAreaView style={[styles.modalContainer, { backgroundColor: this.props.themeStyle.primaryBackgroundColor }]}>
              <Spinner
                visible={this.state.spinnerTemp}
                textStyle={{
                  backgroundColor: this.props.themeStyle.loadingIndicatorColor,
                  color: this.props.themeStyle.primary
                }}
              />
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
                      ? this.state.countryArray.map((element, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            this.setState({
                              selectedCountry: element,
                              countryModal: false
                            })
                          }}
                          style={styles.arrayElementRow}>
                          <Text style={[{
                            color: this.props.themeStyle.textColor,
                            fontSize: appTextStyle.largeSize,
                            fontFamily: appTextStyle.fontFamily
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
                        fontSize: appTextStyle.largeSize,
                        fontFamily: appTextStyle.fontFamily
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
                      ? this.state.statesArray.map((element, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            this.setState({
                              selectedState: element,
                              stateModal: false
                            })
                          }}
                          style={styles.arrayElementRow}>
                          <Text style={[{
                            color: this.props.themeStyle.textColor,
                            fontSize: appTextStyle.largeSize,
                            fontFamily: appTextStyle.fontFamily
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
                  width: WIDTH * 0.62
                }}>
                  <Text style={[{
                    color: this.props.themeStyle.textColor,
                    fontSize: appTextStyle.largeSize + 1,
                    fontFamily: appTextStyle.fontFamily
                  }]}>
                    {this.props.language['Add new Address']}
                  </Text>
                </View>
              </View>

              <View style={styles.textInputRow}>
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                    width: WIDTH * 0.49
                  }]}
                  selectionColor='#51688F'
                  placeholder={this.props.language['First Name']}
                  placeholderTextColor={'#c0c0c0'}
                  onChangeText={text => {
                    this.setState({ firstName: text })
                  }}
                  value={this.state.firstName}
                />
                <TextInput
                  style={[styles.textInputStyle, {
                    fontSize: appTextStyle.mediumSize,
                    color: this.props.themeStyle.textColor,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                    width: WIDTH * 0.51,
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

              </View>

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
                  fontSize: appTextStyle.mediumSize,
                  fontFamily: appTextStyle.fontFamily
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
              <TextInput
                style={[styles.textInputStyle, {
                  fontSize: appTextStyle.mediumSize,
                  color: this.props.themeStyle.textColor,
                  backgroundColor: this.props.themeStyle.primaryBackgroundColor
                }]}
                selectionColor='#51688F'
                placeholder={this.props.language.companyName}
                placeholderTextColor={'#c0c0c0'}
                onChangeText={text => {
                  this.setState({ company: text })
                }}
                value={this.state.company}
              />
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

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    stateModal: true,
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
                  color: this.state.selectedState === '' ? '#c0c0c0' : this.props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontFamily: appTextStyle.fontFamily
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

              <TextInput
                style={[styles.textInputStyle, {
                  fontSize: appTextStyle.mediumSize,
                  color: this.props.themeStyle.textColor,
                  backgroundColor: this.props.themeStyle.primaryBackgroundColor
                }]}
                selectionColor='#51688F'
                placeholder={this.props.language.Phone}
                placeholderTextColor={'#c0c0c0'}
                onChangeText={text => {
                  this.setState({ phone: text })
                }}
                value={this.state.phone}
              />
              <View style={{
                position: 'absolute',
                bottom: 15,
                width: WIDTH
              }}>
                <Button onPress={() => {
                  if (this.state.editAddressId === '') {
                    if (this.canBeSubmitted()) { this.saveFun() }
                  } else {
                    this.editAddress(this.state.editAddressId)
                  }
                }}
                disable={!!this.canBeSubmitted()} themeStyle={this.props.themeStyle}
                navigation={this.props.navigation}
                title={this.props.language.SaveAndCon}
                ></Button>
              </View>

            </SafeAreaView>

          </Modal>

          <View style={{
            marginVertical: 9,
            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
            width: WIDTH
          }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isModalVisible: true
                  // firstName: '',
                  // lastName: '',
                  // selectedCountry: {
                  //   country_id: 223,
                  //   country_name: 'United States'
                  // },
                  // selectedState: '',
                  // addressOne: '',
                  // company: '',
                  // zip: '',
                  // city: '',
                  // email: '',
                  // editAddressId: ''
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
                color: this.props.themeStyle.textColor,
                fontSize: appTextStyle.largeSize + 1,
                fontFamily: appTextStyle.fontFamily
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
          {this.state.addressArray.map((item, index) => (
            <View
              key={index}
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
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.largeSize,
                  fontFamily: appTextStyle.fontFamily
                }]}>
                  {item.customer.customer_first_name + ' ' + item.customer.customer_last_name}
                </Text>
                <Text style={[styles.addressText, {
                  color: this.props.themeStyle.iconPrimaryColor,
                  fontSize: appTextStyle.mediumSize,
                  fontFamily: appTextStyle.fontFamily
                }]}>
                  {item.country_id.country_name}
                </Text>
                <Text style={[{
                  color: this.props.themeStyle.iconPrimaryColor,
                  fontSize: appTextStyle.mediumSize,
                  fontFamily: appTextStyle.fontFamily
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
                      color: this.props.themeStyle.primary,
                      fontSize: appTextStyle.largeSize,
                      marginRight: 9,
                      fontFamily: appTextStyle.fontFamily
                    }]}>
                      {'Set Default'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this.setState({
                      isModalVisible: true,
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
                    })
                  }}>
                    <Text style={[{
                      color: this.props.themeStyle.primary,
                      fontSize: appTextStyle.largeSize,
                      marginRight: 9,
                      fontFamily: appTextStyle.fontFamily
                    }]}>
                      {'Edit'}
                    </Text>
                  </TouchableOpacity>
                  {Number(item.default_address) !== 1
                    ? <TouchableOpacity onPress={() => {
                      this.deleteAddress(item.id)
                    }}>
                      <Text style={[{
                        color: this.props.themeStyle.primary,
                        fontSize: appTextStyle.largeSize,
                        marginRight: 9,
                        fontFamily: appTextStyle.fontFamily
                      }]}>
                        {'Delete'}
                      </Text>
                    </TouchableOpacity>
                    : null}
                </View>

              </View>

            </View>
          ))}

        </ScrollView>

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
    company, zip, stateValue, city, email, phone, th) =>
    dispatch(addAddressValue(firstName, lastName, selectedCountry, selectedState,
      addressOne, company, zip, stateValue, city, email, phone, th))

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
    height: 46,
    width: '100%',
    borderColor: '#c0c0c0',
    borderBottomWidth: 1,
    alignSelf: 'center',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 19
  },
  stateCountryStyles: {
    width: WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: '#c0c0c0'
  },
  addAddressBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
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
  cardView: {
    marginBottom: 9,
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    flexWrap: 'wrap'
  },
  addressText: {
    paddingTop: 4,
    paddingBottom: 1
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddress)
