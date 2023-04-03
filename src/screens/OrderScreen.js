/* eslint-disable no-useless-escape */
import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  I18nManager,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import CartCard from '../common/CartCard'
import Button from '../common/Button'
import Spinner from 'react-native-loading-spinner-overlay'
import { createSelector } from 'reselect'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux'
import { appTextStyle } from '../common/Theme.style'
import {
  getAddress,
  placeOrderFun
} from '../redux/actions/actions'
import PageIndicator from '../common/pageIndicator'
import { getUrlWithOutApiClient } from '../common/WooComFetch'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

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
        backgroundColor: colorProps,
        elevation: 0,
        borderBottomWidth: 0,
        shadowOpacity: 0
      },
      headerTintColor: iconColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 6
      },
      headerTitleAlign: 'center'
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.ReviewOrder,
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
      cvc: '',
      monthArray: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      yearArray: ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032'],
      cardNumber: '',
      selectedCountry: {
        country_id: 223,
        country_name: 'United States'
      },
      selectedState: '',
      expireMonth: '12',
      expireYear: '2021',
      isMonthSelected: true,
      addressOne: '',
      addressTwo: '',
      zip: '',
      stateValue: '',
      city: '',
      email: '',
      spinnerTemp: false,
      phone: '',
      modalVisibleSubCategory: false
    }
    this.toast = null
  }

  singleRow = (text, value) => (
    <View style={styles.priceRow}>
      <Text style={[styles.priceText, {
        color: this.props.themeStyle.textColor,
        fontFamily: appTextStyle.fontFamily,
        fontSize: appTextStyle.largeSize + 1
      }]}>
        {text}
      </Text>
      <View style={{ flexDirection: 'row', paddingRight: 0 }}>
        <Text style={[styles.priceText, {
          color: this.props.themeStyle.textColor,
          fontFamily: appTextStyle.fontFamily,
          fontSize: appTextStyle.largeSize + 1

        }]}>
          {this.props.settings.currency_symbol}
        </Text>
        <Text style={[styles.priceText, {
          color: this.props.themeStyle.textColor,
          fontFamily: appTextStyle.fontFamily,
          fontSize: appTextStyle.largeSize + 1

        }]}>
          {value}
        </Text>
      </View>
    </View>
  )

  payWithWebview () {
    let url = getUrlWithOutApiClient() + '/order-web-view'
    url += '?token=' + this.props.getUserToken
    url += '&payment_method=' + this.props.navigation.state.params.methodName
    url += '&locations=' + this.props.getAddressData.latlong
    url += '&billing_first_name=' + this.props.getAddressData.billing_first_name
    url += '&billing_last_name=' + this.props.getAddressData.billing_last_name
    url += '&billing_street_aadress=' + this.props.getAddressData.billing_street_aadress
    url += '&billing_country=' + this.props.getAddressData.billing_country
    url += '&billing_state=' + this.props.getAddressData.billing_state
    url += '&billing_city=' + this.props.getAddressData.billing_city
    url += '&billing_postcode=' + this.props.getAddressData.billing_postcode
    url += '&billing_phone=' + this.props.getAddressData.billing_phone
    url += '&delivery_first_name=' + this.props.getAddressData.delivery_first_name
    url += '&delivery_last_name=' + this.props.getAddressData.delivery_last_name
    url += '&delivery_street_aadress=' + this.props.getAddressData.delivery_street_aadress
    url += '&delivery_country=' + this.props.getAddressData.delivery_country
    url += '&delivery_state=' + this.props.getAddressData.delivery_state
    url += '&delivery_city=' + this.props.getAddressData.delivery_city
    url += '&delivery_postcode=' + this.props.getAddressData.delivery_postcode
    url += '&delivery_phone=' + this.props.getAddressData.delivery_phone
    url += '&currency_id=' + this.props.settings.currency_id
    url += '&language_id=' + this.props.settings.language_id
    url += '&order_notes='
    if (this.props.coupon !== '') { url += '&coupon_code=' + this.props.coupon }
    console.log(url)
    this.props.navigation.push('WebViewScreen', {
      url: url
    })
  }

  payDirect () {
    const obj = this.props.getAddressData
    obj.latlong = this.props.getAddressData.latlong
    if (this.props.navigation.state.params.methodType === 'card') {
      obj.cc_number = this.state.cardNumber
      obj.cc_expiry_month = this.state.expireMonth
      obj.cc_expiry_year = this.state.expireYear
      obj.cc_cvc = Number(this.state.cvc)
    } else
    if (this.props.navigation.state.params.methodType === 'banktransfer' ||
    this.props.navigation.state.params.methodType === 'cod') {
      obj.cc_number = ''
      obj.cc_expiry_month = ''
      obj.cc_expiry_year = ''
      obj.cc_cvc = ''
    }
    this.setState({ spinnerTemp: true }, () => {
      this.props.placeOrderCall(this, obj,
        this.props.sessionId, this.props.navigation.state.params.methodName,
        obj)
    })
  }

  setModalVisible = visible => {
    this.setState({ modalVisibleSubCategory: visible })
  }

  monthYearList = (arr, selection) => (
    <ScrollView>

      {arr.map(val => (
        <TouchableOpacity
          style={{
            ...styles.modalText,
            backgroundColor: this.props.themeStyle.backgroundColor,
            padding: 8,
            width: WIDTH * 0.5
          }}
          onPress={() => {
            selection === 'month'
              ? this.setState({
                expireMonth: val,
                modalVisibleSubCategory: false
              })
              : this.setState({
                expireYear: val,
                modalVisibleSubCategory: false
              })
          }}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.textStyle,
              {
                padding: 5,
                textAlign: 'center',
                fontFamily: appTextStyle.fontFamily,
                color: this.props.themeStyle.textColor
              }
            ]}>
            {val}
          </Text>
        </TouchableOpacity>
      ))}

    </ScrollView>
  )

  /// //////
  render () {
    return (
      <View style={{ flex: 1 }}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}>
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

          <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.modalVisibleSubCategory}
            onRequestClose={() => { this.setModalVisible(!this.state.modalVisibleSubCategory) }}
            style={{
              backgroundColor: this.props.themeStyle.secondryBackgroundColor,
              flex: 1
            }}>
            <TouchableWithoutFeedback onPress={() => this.setModalVisible(!this.state.modalVisibleSubCategory)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setModalVisible(!this.state.modalVisibleSubCategory)
              }}
              style={{ flex: 1, backgroundColor: this.props.themeStyle.secondryBackgroundColor }}>
              <View
                style={[
                  styles.centeredView,
                  {
                    flexDirection: 'column',
                    alignItems: 'center',
                    top:
                      Platform.OS === 'ios' ? HEIGHT * 0.218 : HEIGHT * 0.117,
                    left: WIDTH * 0.01
                  }
                ]}>
                <View style={[styles.modalView, {
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>

                  {this.monthYearList(this.state.isMonthSelected
                    ? this.state.monthArray : this.state.yearArray,
                  this.state.isMonthSelected
                    ? 'month' : 'year')}

                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <View style={[styles.pageIndicatorStlye, {
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
            paddingTop: 30
          }]}>
            <PageIndicator th={this} selected={3}
              backgroundColor={this.props.themeStyle.secondryBackgroundColor
              }
              language={this.props.language} />
          </View>

          {this.props.cartProductsArray.length > 0

            ? this.props.cartProductsArray.map((data) => (
              <CartCard
                th={this}
                deleteProductFromCartCall={this.props.deleteProductFromCartCall}
                language={this.props.language}
                data={data}
                themeStyle={this.props.themeStyle}
                sessionId={this.props.sessionId}
                settings={this.props.settings}>

              </CartCard>
            ))
            : null}

          <View
            style={[styles.cardView, {
              backgroundColor: this.props.themeStyle.primaryBackgroundColor,
              borderColor: this.props.themeStyle.primary
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
                fontFamily: appTextStyle.fontFamily,
                fontSize: appTextStyle.largeSize
              }]}>
                {this.props.getAddressData.delivery_first_name +
                  ' ' + this.props.getAddressData.delivery_last_name}
              </Text>
              <Text style={[styles.addressText, {
                color: this.props.themeStyle.iconPrimaryColor,
                fontFamily: appTextStyle.fontFamily,
                fontSize: appTextStyle.mediumSize
              }]}>
                {this.props.getAddressData.delivery_state_name}
              </Text>
              <Text style={[{
                color: this.props.themeStyle.iconPrimaryColor,
                fontFamily: appTextStyle.fontFamily,
                fontSize: appTextStyle.mediumSize
              }]}>
                {this.props.getAddressData.delivery_street_aadress +
                  ' ' + this.props.getAddressData.delivery_city + ' ' +
                  this.props.getAddressData.delivery_postcode}
              </Text>

            </View>

          </View>

          <View style={[styles.viewContainer, {
            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
            borderColor: this.props.themeStyle.primary
          }]}>

            {this.singleRow(this.props.language.SubTotal, this.props.cartSubTotalFloat)}
            {this.singleRow(this.props.language.Discount, this.props.cartDiscountFloat)}
            {this.singleRow(this.props.language.EstimatedShiping, this.props.cartShippingFloat)}
            {this.singleRow(this.props.language.Tax, this.props.cartTaxFloat)}
            <View style={{ marginVertical: 5 }} />
            {this.singleRow(this.props.language.OrderTotal, this.props.cartTotalFloat)}
          </View>

          {this.props.navigation.state.params.methodType === 'card'
            ? <View style={[styles.viewContainer, {
              backgroundColor: this.props.themeStyle.primaryBackgroundColor,
              borderColor: this.props.themeStyle.primary
            }]}>

              <Text style={{
                fontFamily: appTextStyle.fontFamily,
                color: this.props.themeStyle.textColor,
                fontSize: appTextStyle.largeSize + 2,
                alignSelf: 'center'
              }}>{
                  this.props.language.Payment}</Text>

              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>

                <Text style={[styles.cardTextHeading, {
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.largeSize
                }]}>{this.props.language['Card Number']}</Text>

                <TextInput
                  style={[styles.textInputStyle, {
                    color: this.props.themeStyle.textColor,
                    borderColor: this.props.themeStyle.primary,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}
                  placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                  selectionColor={this.props.themeStyle.iconPrimaryColor}
                  placeholder={
                    this.props.language['Card Number']
                  }
                  onChangeText={cardNumber =>
                    this.setState({ cardNumber, errorMessageSignUp: '' })
                  }
                  value={this.state.cardNumber}
                />
              </View>

              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>

                <Text style={[styles.cardTextHeading, {
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.largeSize
                }]}>{this.props.language['Expire Month']}</Text>

                <TouchableOpacity onPress={() => {
                  this.setState({
                    modalVisibleSubCategory: true,
                    isMonthSelected: true
                  })
                }} style={[styles.selectedView, {
                  borderColor: this.props.themeStyle.primary
                }]}>

                  <Text style={{ color: this.props.themeStyle.textColor }}>
                    {this.state.expireMonth}
                  </Text>

                  <FontAwesome
                    name={'chevron-down'
                    }
                    style={[styles.downIcon, {
                      color: this.props.themeStyle.textColor
                    }]}
                  />
                </TouchableOpacity>
              </View>

              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>

                <Text style={[styles.cardTextHeading, {
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.largeSize
                }]}>{this.props.language['Expire Year']}</Text>

                <TouchableOpacity onPress={() => {
                  this.setState({
                    modalVisibleSubCategory: true,
                    isMonthSelected: false
                  })
                }} style={[styles.selectedView, {
                  borderColor: this.props.themeStyle.primary
                }]}>

                  <Text style={{ color: this.props.themeStyle.textColor }}>
                    {this.state.expireYear}
                  </Text>

                  <FontAwesome
                    name={'chevron-down'
                    }
                    style={[styles.downIcon, {
                      color: this.props.themeStyle.textColor
                    }]}
                  />
                </TouchableOpacity>
              </View>

              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>

                <Text style={[styles.cardTextHeading, {
                  fontFamily: appTextStyle.fontFamily,
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.largeSize
                }]}>{this.props.language.Cvc}</Text>

                <TextInput
                  style={[styles.textInputStyle, {
                    color: this.props.themeStyle.textColor,
                    borderColor: this.props.themeStyle.primary,
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}
                  placeholderTextColor={this.props.themeStyle.iconPrimaryColor}
                  selectionColor={this.props.themeStyle.iconPrimaryColor}
                  placeholder={
                    this.props.language.Cvc
                  }
                  onChangeText={cvc =>
                    this.setState({ cvc, errorMessageSignUp: '' })
                  }
                  value={this.state.cvc}
                />
              </View>

            </View>
            : null}
          <View style={{
            width: WIDTH,
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
            height: HEIGHT * 0.16,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: 5,
            paddingBottom: 20
          }}>
            <Button onPress={() => {
              if (this.props.navigation.state.params.methodType === 'webview') {
                this.payWithWebview()
              } else {
                this.payDirect()
              }
            }}
            borderRadius={true}
            disable={true} themeStyle={this.props.themeStyle}
            navigation={this.props.navigation}
            title={this.props.language.PlaceOrder}
            ></Button>
          </View>
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
  placeOrderCall: (th, data, sessionId, method, obj) => {
    dispatch(async dispatch => {
      await placeOrderFun(dispatch, data, sessionId, th, method, obj)
    })
  }
})

const getTheme = (state) => state.appConfig.themeStyle
const getSessionId = (state) => state.userData.sessionId
const getUsertoken = (state) => state.userData.user.token
const getCartArray = (state) => state.cartData.cartProductsArray
const getSettings = (state) => state.settingsCall.settings
const getCoupon = (state) => state.cartData.couponText

const cartSubTotalFloatFun = (state) => state.cartData.cartSubTotalFloat
const cartDiscountFloatFun = (state) => state.cartData.cartDiscountFloat
const cartShippingFloatFun = (state) => state.cartData.cartShippingFloat
const cartTaxFloatFun = (state) => state.cartData.cartTaxFloat
const cartTotalFloatFun = (state) => state.cartData.cartTotalFloat

const getCouponFun = createSelector(
  [getCoupon],
  (getCoupon) => {
    return getCoupon
  }
)
const getUsertokenFun = createSelector(
  [getUsertoken],
  (getUsertoken) => {
    return getUsertoken
  }
)
const cartSubTotalFloatState = createSelector(
  [cartSubTotalFloatFun],
  (cartSubTotalFloatFun) => {
    return cartSubTotalFloatFun
  }
)
const cartDiscountFloatState = createSelector(
  [cartDiscountFloatFun],
  (cartDiscountFloatFun) => {
    return cartDiscountFloatFun
  }
)
const cartShippingFloatState = createSelector(
  [cartShippingFloatFun],
  (cartShippingFloatFun) => {
    return cartShippingFloatFun
  }
)
const cartTaxFloatState = createSelector(
  [cartTaxFloatFun],
  (cartTaxFloatFun) => {
    return cartTaxFloatFun
  }
)
const cartTotalFloatState = createSelector(
  [cartTotalFloatFun],
  (cartTotalFloatFun) => {
    return cartTotalFloatFun
  }
)

const getCartArrayFun = createSelector(
  [getCartArray],
  (getCartArray) => {
    return getCartArray
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
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
const getLanguage = (state) => state.appConfig.languageJson
const getAddressData = (state) => state.shippingAddress.addressData

const getgetAddressDataFun = createSelector(
  [getAddressData],
  (getAddressData) => {
    return getAddressData
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
  language: getLanguageFun(state),
  sessionId: getSessionIdFun(state),
  cartProductsArray: getCartArrayFun(state),
  settings: getSettingsFun(state),
  cartSubTotalFloat: cartSubTotalFloatState(state),
  cartDiscountFloat: cartDiscountFloatState(state),
  cartShippingFloat: cartShippingFloatState(state),
  cartTaxFloat: cartTaxFloatState(state),
  cartTotalFloat: cartTotalFloatState(state),
  getAddressData: getgetAddressDataFun(state),
  getUserToken: getUsertokenFun(state),
  coupon: getCouponFun(state)
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
  downIcon: {
    paddingRight: 12,
    paddingLeft: 12,
    fontSize: 10
  },
  selectedView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WIDTH * 0.85,
    padding: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: appTextStyle.customRadius - 12

  },
  modalText: {
    marginBottom: 0,
    textAlign: 'center'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
  modalView: {
    margin: 20,
    borderRadius: appTextStyle.customRadius - 15,
    padding: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: HEIGHT * 0.5
  },
  cardTextHeading: {
    alignSelf: 'flex-start',
    padding: 15,
    paddingBottom: 8
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingVertical: 4
  },
  priceText: {
    paddingRight: 6,
    alignSelf: 'flex-start',
    textAlign: 'left'
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
  viewContainer: {
    paddingVertical: 9,
    width: WIDTH * 0.93,
    borderRadius: appTextStyle.customRadius - 10,
    alignSelf: 'center',
    marginBottom: 15,
    borderWidth: 1
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
  textInputStyle: {
    height: 38,
    width: WIDTH * 0.85,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 12,
    fontSize: appTextStyle.mediumSize + 1,
    borderRadius: appTextStyle.customRadius - 12,
    borderWidth: 1
  },
  textInputRow: {
    flexDirection: 'row'
  },
  headingText: {
    fontSize: appTextStyle.largeSize,
    paddingVertical: 15,
    width: WIDTH,
    textAlign: 'center'
  },
  cardView: {
    marginVertical: 14,
    width: WIDTH * 0.92,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 19,
    borderRadius: appTextStyle.customRadius - 10,
    alignSelf: 'center',
    borderWidth: 1
  },
  addressText: {
    paddingTop: 4,
    paddingBottom: 1
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddress)
