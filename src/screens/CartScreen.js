import React, { PureComponent } from 'react'
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  I18nManager
} from 'react-native'
import { createSelector } from 'reselect'
import {
  getCartProducts,
  deleteProductFromCart,
  checkCouponAvalability,
  REMOVE_COUPON,
  allPrices,
  CLEAR_CART_PAGE_PRODUCTS,
  getcartRelatedProducts,
  colorFun,
  DEL_COUPON
} from '../redux/actions/actions'
import Toast from 'react-native-easy-toast'
import ImageLoad from '../common/RnImagePlaceH'
import { UIActivityIndicator } from 'react-native-indicators'
import { NavigationEvents } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import CardTem from '../common/CardTemplate'
import { Icon } from 'native-base'
import Loader from 'react-native-easy-content-loader'
import theme, { appTextStyle } from '../common/Theme.style'
import Button from '../common/Button'
import CartCard from '../common/CartCard'
import Header from '../common/HeaderCustom'
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
class CartScreen extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      fabB: false,
      selected: '',
      timeValue: 400,
      selectedTab: '',
      productView: 'grid',
      loading: false,
      activityIndicatorTemp: true,
      spinnerTemp: true,
      //
      page: 1,
      couponText: '',
      cartTotalFloat: 0,
      cartSubTotalFloat: 0,
      cartTaxFloat: 0,
      cartDiscountFloat: 0,
      cartShippingFloat: 0,
      productColorCounter: 0
    }
    this.toast = null
  }

  calculateFinalPrice (data) {
    let total = 0
    data.forEach((value, index) => {
      const price = value.total
      total += price
    })
    this.applyCoupon()
    this.setState({
      cartSubTotalFloat: total,
      spinnerTemp: false,
      cartTotalFloat: total + this.state.cartTaxFloat + this.state.cartShippingFloat - this.state.cartDiscountFloat
    })
  }

  applyCoupon () {
    if (this.props.coupon !== {}) {
      if (this.props.coupon.type === 'fixed') {
        this.setState({ cartDiscountFloat: this.props.coupon.amount })
      }
      if (this.props.coupon.type === 'percentage') {
        const discount = (this.state.cartSubTotalFloat / 100) * this.props.coupon.amount
        this.setState({ cartDiscountFloat: discount })
      }
    }
  }

  deleteCoupon () {
    this.props.delCaupon()
    this.setState({ cartDiscountFloat: 0, spinnerTemp: true })
    this.props.clearProducts()
    this.props.getCartProductsCall(this.props.sessionId, this)
    this.toast.show(this.props.language.couponRemoved)
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Cart,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
    setTimeout(() => {
      this.setState({ activityIndicatorTemp: false })
    }, 1000)
    this.toast = null
    this.props.getProductsFun(this.props, this.state.page, this)
    this.props.clearProducts()
    this.props.getCartProductsCall(this.props.sessionId, this)
  }

  componentWillUnmount () {
    clearInterval(this.state.activityIndicatorTemp)
  }

  renderItem = (item, index) =>
    <View>
      <Loader
        secondaryColor='rgba(208, 205, 205, 1)'
        primaryColor='rgba(218, 215, 215, 1)'
        animationDuration={this.state.timeValue}
        active
        loading={this.state.loading}
        containerStyles={[styles.loaderContainer, {
          backgroundColor: this.props.themeStyle.primaryBackgroundColor,
          width: WIDTH * theme.twoRowCardWIdth
        }]}
        pRows={3}
        pWidth={['100%', '100%', '80%']}
        pHeight={30}
        titleStyles={[styles.titleStyle, {
          width: WIDTH * theme.twoRowCardWIdth
        }]}
        paragraphStyles={styles.paragraphStyles}>
        <CardTem
          backgroundColor={colorFun(this, item.index)}
          objectArray={item.item}
          rows={this.props.vertical}
          recent={this.state.recent}
          width={WIDTH * theme.twoRowCardWIdth}
        />
      </Loader>
    </View>
  // )

  handleLoadMore () {
    if (this.props.products.length % 10 === 0) {
      this.setState(
        {
          refreshing: true,
          fabB: this.props.products.length > 9
        },
        () => {
          this.state.page++
          this.props.getProductsFun(this.props, this.state.page, this)
        }
      )
    } else {
      this.setState({
        refreshing: false
      })
    }
  }

  renderFooter = () => (
    <View
      style={[styles.footerStyle, {
        marginBottom: this.state.refreshing ? 50 : 10
      }]}>
      {this.state.refreshing ? (
        <View
          style={styles.footerIndicator}>
          <UIActivityIndicator
            size={27}
            count={12}
            color={this.props.themeStyle.primary}
          />
        </View>
      ) : null}
    </View>
  )

  onEndReached = () => {
    this.handleLoadMore()
    this.onEndReachedCalledDuringMomentum = true
  }

  handleScroll (event) {
    if (
      this.state.fabB &&
      event.nativeEvent.contentOffset.y >= 0 &&
      event.nativeEvent.contentOffset.y < 300
    ) {
      this.setState({ fabB: false })
    }
  }

  categoryHeading (text) {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>

        <Text
          style={[styles.categoryTypeStyle, {
            fontSize: appTextStyle.largeSize + 1,
            color: this.props.themeStyle.textColor,
            fontWeight: 'bold',
            fontFamily: appTextStyle.fontFamily
          }]}>
          {text}
        </Text>
        <TouchableOpacity>
          <Text style={{
            color: this.props.themeStyle.primary,
            fontSize: appTextStyle.smallSize,
            fontFamily: appTextStyle.fontFamily,
            paddingHorizontal: 12
          }}>{this.props.language['View All']}</Text>
        </TouchableOpacity>

      </View>
    )
  }

  couponView = () => (
    <View style={[styles.promoContainer, {
      backgroundColor: this.props.themeStyle.primaryBackgroundColor,
      paddingBottom: this.state.cartDiscountFloat > 0 ? 60 : 20,
      borderColor: '#e8eaeb',
      borderWidth: 1
    }]}>
      <TouchableOpacity
        onPress={() => this.setState({ detailsDisplay: !this.state.detailsDisplay })}
        style={styles.productDetailsRow}>
        <Text style={[styles.priceText, {
          color: this.props.themeStyle.textColor,
          fontSize: appTextStyle.largeSize + 1
        }]}>
          {this.props.language.PromoCode}
        </Text>

        <FontAwesome
          style={{
            color: this.props.themeStyle.iconPrimaryColor,
            fontSize: appTextStyle.largeSize
          }}
          active
          name={'chevron-down'}

        />
      </TouchableOpacity>

      <TextInput
        style={[styles.couponTextInput, {
          fontSize: appTextStyle.mediumSize,
          color: this.props.themeStyle.textColor
        }]}
        selectionColor='#51688F'
        placeholder={this.props.language.EnterCodeHere}
        placeholderTextColor={'#c0c0c0'}
        onChangeText={text => {
          this.setState({ couponText: text })
        }}
        value={this.state.couponText}
      />

      <Button onPress={() => {
        if (this.state.couponText.length > 0) {
          this.setState({ spinnerTemp: true }, () => {
            this.props.checkCouponAvalabilityFun(this.state.couponText, this)
            this.props.getCartProductsCall(this.props.sessionId, this)
            this.setState({ couponText: '' })
          })
        }
      }
      } disable={this.state.couponText.length > 0} themeStyle={this.props.themeStyle} navigation={this.props.navigation}
      title={this.props.language.Apply}
      ></Button>
      {this.state.cartDiscountFloat > 0
        ? <TouchableOpacity
          style={{ position: 'absolute', right: 20, bottom: 10 }}
          onPress={() => {
            this.deleteCoupon()
          }}
        >
          <View
            style={[styles.btnView, {
              backgroundColor: 'red'
            }]}>

            <Text
              style={{
                textAlign: 'center',
                fontSize: appTextStyle.largeSize - 1,
                fontFamily: appTextStyle.fontFamily,
                color: this.props.themeStyle.textTintColor,
                fontWeight: '800',
                paddingVertical: 9
              }}>
              {this.props.language.Remove}
            </Text>
          </View>
        </TouchableOpacity>
        : null}
    </View>
  )

  singleRow = (text, value) => (
    <View style={styles.priceRow}>
      <Text style={[styles.priceText, {
        color: this.props.themeStyle.textColor,
        fontSize: appTextStyle.largeSize + 1
      }]}>
        {text}
      </Text>
      <View style={{ flexDirection: 'row', paddingRight: 0 }}>
        <Text style={[styles.priceText, {
          color: this.props.themeStyle.textColor,
          fontSize: appTextStyle.largeSize + 1

        }]}>
          {this.props.settings.currency_symbol}
        </Text>
        <Text style={[styles.priceText, {
          color: this.props.themeStyle.textColor,
          fontSize: appTextStyle.largeSize + 1

        }]}>
          {value.toFixed(2)}
        </Text>
      </View>
    </View>
  )

  render () {
    if (this.props.products.length > 0) {
      this.state.loading = false
      this.state.timeValue = 400
      if (this.props.products.length % 10 === 0) {
        this.state.refreshing = true
      } else {
        this.state.refreshing = false
      }
    } else {
      this.state.loading = true
      this.state.timeValue = 400
      this.state.refreshing = false
    }

    if (this.state.cartTotalFloat < 0) {
      this.state.cartDiscountFloat = 0
      this.state.cartTotalFloat = 0
    }

    return this.state.activityIndicatorTemp ? (
      <View
        style={{
          backgroundColor: this.props.themeStyle.secondryBackgroundColor,
          flex: 1
        }}>
        <Header navigation={this.props.navigation} name={this.props.language.Cart} />

        <View
          style={[styles.activityIndicatorContainer, {
            backgroundColor: this.props.themeStyle.primaryBackgroundColor
          }]}>

          <UIActivityIndicator
            size={27}
            color={this.props.themeStyle.primary}
          />
        </View>
      </View>
    ) : (

      <View
        style={{
          backgroundColor: this.props.themeStyle.secondryBackgroundColor,
          flex: 1
        }}>
        <Header navigation={this.props.navigation} name={this.props.language.Cart} />

        <NavigationEvents
          onDidFocus={() => {
            this.setState({ spinnerTemp: true }, () => {
              this.props.getCartProductsCall(this.props.sessionId, this)
            })
          }}
        />
        <Spinner
          visible={this.state.spinnerTemp}
          textStyle={styles.spinnerTextStyle}
        />
        <Toast
          ref={ref => { this.toast = ref }}
          style={styles.toastStyle}
          position='bottom'
          positionValue={200}
          fadeOutDuration={200}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.mediumSize }}
        />

        {this.state.fabB ? (
          <TouchableOpacity
            style={styles.fabStyle}
            onPress={() => {
              this.flatListRef.scrollToOffset({
                animated: true,
                offset: 0,
                useNativeDriver: true
              }, {
                useNativeDriver: true
              })
              this.setState({ fabB: false })
            }}>
            <View
              style={[styles.fabView, {
                backgroundColor: this.props.themeStyle.primary
              }]}>
              <Icon
                name={'md-arrow-up'}
                style={[styles.fabIcon, {
                  color: this.props.themeStyle.textTintColor
                }]}
              />
            </View>
          </TouchableOpacity>
        ) : null}
        {this.props.cartProductsArray.length === 0
          ? <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
            fontSize: 25,
            paddingBottom: HEIGHT / 5
          }}>
            <Icon name={'md-cart'} style={{ color: 'gray', fontSize: 80 }} />
            <View>
              <Text style={[styles.welcome, {
                color: this.props.themeStyle.textColor,
                fontFamily: appTextStyle.fontFamily
              }]}>
                {this.props.language['Your cart is empty']}
              </Text>
              <Text style={styles.textStyle}>
                {this.props.language['Continue Shopping']}
              </Text>
              <TouchableOpacity
                style={{ paddingTop: 5, width: 90, alignSelf: 'center' }}
                onPress={() =>
                  this.props.navigation.navigate('NewestScreen', {
                    id: undefined,
                    name: undefined,
                    sortOrder: 'Newest'
                  })
                }>
                <View
                  style={{
                    borderColor: this.props.themeStyle.primary,
                    alignItems: 'center',
                    height: 33,
                    width: 90,
                    backgroundColor: this.props.themeStyle.primary,
                    justifyContent: 'center',
                    elevation: 0.3,
                    marginTop: 5,
                    borderRadius: appTextStyle.customRadius

                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: this.props.themeStyle.textTintColor,
                      fontSize: 16,
                      fontFamily: appTextStyle.fontFamily
                    }}>
                    {this.props.language.Explore}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          : <FlatList
            showsVerticalScrollIndicator={false}
            windowSize={50}
            initialNumToRender={6}
            removeClippedSubviews={true}
            legacyImplementation={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={10}

            data={
              this.props.products !== undefined &&
              this.props.products !== null &&
              this.props.products.length > 0
                ? this.props.products
                : ['', '', '', '']
            }
            key={this.state.productView}
            numColumns={2}
            ref={ref => {
              this.flatListRef = ref
            }}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{
              paddingLeft: '0.2%',
              backgroundColor: this.props.themeStyle.secondryBackgroundColor

            }}
            contentContainerStyle={{
              backgroundColor: this.props.themeStyle.secondryBackgroundColor
            }}
            extraData={this.state}
            renderItem={this.renderItem}
            ListHeaderComponent={
              <View style={styles.headerListStyle}>

                {this.props.cartProductsArray.length > 0

                  ? this.props.cartProductsArray.map((data, index) => (
                    <CartCard
                      key={index}
                      keyValue={index}
                      th={this}
                      deleteProductFromCartCall={this.props.deleteProductFromCartCall}
                      language={this.props.language}
                      data={data}
                      themeStyle={this.props.themeStyle}
                      sessionId={this.props.sessionId}
                      settings={this.props.settings}

                    >

                    </CartCard>
                  ))
                  : null}

                {this.couponView()}

                <View style={[styles.viewContainer, {
                  backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                  borderWidth: 1,
                  borderColor: this.props.themeStyle.primary
                }]}>

                  {this.singleRow(this.props.language.SubTotal, this.state.cartSubTotalFloat)}
                  {this.singleRow(this.props.language.Discount, this.state.cartDiscountFloat)}
                  {this.singleRow(this.props.language.EstimatedShiping, this.state.cartShippingFloat)}
                  {this.singleRow(this.props.language.Tax, this.state.cartTaxFloat)}
                  <View style={{ marginVertical: 5 }} />
                  {this.singleRow(this.props.language.OrderTotal, this.state.cartTotalFloat)}
                </View>

                <View style={[styles.viewContainer]}>
                  <Button
                    borderRadius={true}
                    onPress={() => {
                      if (Object.keys(this.props.userData).length > 0) {
                        this.props.allPricesCall(this.state.cartSubTotalFloat,
                          this.state.cartDiscountFloat,
                          this.state.cartShippingFloat,
                          this.state.cartTaxFloat,
                          this.state.cartTotalFloat)
                        this.props.navigation.navigate('ShippingAddressScreen')
                      } else {
                        this.props.navigation.navigate('LoginScreen')
                      }
                    }}
                    disable={true} themeStyle={this.props.themeStyle} navigation={this.props.navigation}
                    title={this.props.language.ProceedToCheckout}
                  ></Button>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.push('NewestScreen', { id: '' })
                  }}>
                  <ImageLoad
                    style={styles.singleBanner}
                    loadingStyle={{
                      size: 'large',
                      color: this.props.themeStyle.primary
                    }}
                    placeholder={false}
                    ActivityIndicator={true}
                    placeholderStyle={{ width: 0, height: 0 }}
                    source={require('../images/Capture.png')}
                  />
                </TouchableOpacity>
                <View style={{
                  paddingTop: 9,
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }}>
                  {this.categoryHeading(
                    this.props.language['JUST FOR YOU'])}

                </View>
              </View>
            }
            onScroll={this.handleScroll.bind(this)}
          />}
      </View>
    )
  }
}

// //////////////////////
const mapDispatchToProps = dispatch => ({
  checkCouponAvalabilityFun: (text, th) => {
    dispatch(async dispatch => {
      await checkCouponAvalability(dispatch, text, th)
    })
  },
  getProductsFun: (props, page, th) => {
    dispatch(async dispatch => {
      await getcartRelatedProducts(dispatch, props.settings.language_id, props.settings.currency_id, page, th)
    })
  },
  delCaupon: () => {
    dispatch({
      type: DEL_COUPON
    })
  },
  clearProducts: () => {
    dispatch({
      type: CLEAR_CART_PAGE_PRODUCTS
    })
  },
  removeCouponFun: () => {
    dispatch({
      type: REMOVE_COUPON
    })
  },
  deleteProductFromCartCall: (id, sessionId, combinationId, qty, th) => {
    dispatch(async dispatch => {
      await deleteProductFromCart(dispatch, id, sessionId, combinationId, qty, th)
    })
  },
  getCartProductsCall: (sessionId, th) => {
    dispatch(async dispatch => {
      await getCartProducts(dispatch, sessionId, th)
    })
  },
  allPricesCall: (cartSubTotalFloat,
    cartDiscountFloat,
    cartShippingFloat,
    cartTaxFloat,
    cartTotalFloat) => {
    dispatch(
      allPrices(cartSubTotalFloat,
        cartDiscountFloat,
        cartShippingFloat,
        cartTaxFloat,
        cartTotalFloat)
    )
  }
})
/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getCategories = (state) => state.getCategories.categories
const getBanners = (state) => state.bannersData.banners
const getSettings = (state) => state.settingsCall.settings
const getproductsArray = (state) => state.productsData.cartRelatedProducts
const getCartArray = (state) => state.cartData.cartProductsArray
const getSessionId = (state) => state.userData.sessionId
const getCoupon = (state) => state.cartData.coupon
const getUserData = (state) => state.userData.user

const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)

const getCouponFun = createSelector(
  [getCoupon],
  (getCoupon) => {
    return getCoupon
  }
)

const getSessionIdFun = createSelector(
  [getSessionId],
  (getSessionId) => {
    return getSessionId
  }
)

const getCartArrayFun = createSelector(
  [getCartArray],
  (getCartArray) => {
    return getCartArray
  }
)

const getproductsArrayFun = createSelector(
  [getproductsArray],
  (getproductsArray) => {
    return getproductsArray
  }
)

const getBannersFun = createSelector(
  [getBanners],
  (getBanners) => {
    return getBanners
  }
)

const getCategoriesFun = createSelector(
  [getCategories],
  (getCategories) => {
    return getCategories
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

const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)

const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  categories: getCategoriesFun(state),
  banners: getBannersFun(state),
  settings: getSettingsFun(state),
  products: getproductsArrayFun(state),
  cartProductsArray: getCartArrayFun(state),
  sessionId: getSessionIdFun(state),
  coupon: getCouponFun(state),
  userData: getUserDataFun(state)
})

/// //////////////////////////////////////////
export default connect(mapStateToProps, mapDispatchToProps)(CartScreen)
/// /////////////////////////////////////////////
const styles = StyleSheet.create({
  loaderContainer: {
    height: Platform.OS === 'android'
      ? 260
      : 230,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#000',
    shadowOpacity: 0.5,
    elevation: 3,
    margin: 5
  },
  toastStyle: {
    backgroundColor: '#c1c1c1'
  },
  viewContainer: {
    paddingVertical: 9,
    width: WIDTH * 0.93,
    borderRadius: appTextStyle.customRadius - 10,
    alignSelf: 'center',
    marginBottom: 15

  },
  singleBanner: {
    width: WIDTH,
    height: 140,
    marginTop: 0,
    marginBottom: 5
  },
  titleStyle: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
    height: 130
  },
  promoContainer: {
    padding: 8,
    width: WIDTH * 0.93,
    borderRadius: appTextStyle.customRadius - 10,
    alignSelf: 'center',
    marginVertical: 15
  },
  btnView: {
    alignItems: 'center',
    width: WIDTH * 0.25,
    justifyContent: 'center',
    borderRadius: appTextStyle.customRadius
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingVertical: 4
  },
  productsImage: {
    height: 68,
    width: 65,
    overflow: 'hidden',
    marginRight: 10,
    borderRadius: 12
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  paragraphStyles: {
    paddingTop: 7,
    padding: 6,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  couponTextInput: {
    marginTop: 2,
    height: 38,
    width: '93%',
    borderColor: '#c0c0c0',
    borderWidth: 1,
    alignSelf: 'center',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 9,
    marginBottom: 10
  },
  textStyle: {
    fontSize: 15,
    textAlign: 'center',
    margin: 2,
    color: 'gray',
    fontFamily: appTextStyle.fontFamily
  },
  footerStyle: {
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center'
  },
  cartAttContainer: {
    flexWrap: 'wrap', flexDirection: 'row'
  },
  productDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  priceText: {
    paddingRight: 6,
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontFamily: appTextStyle.fontFamily
  },
  categoryTypeStyle: {
    padding: 10,
    alignSelf: 'flex-start'
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerIndicator: {
    height: 10,
    marginTop: 25
  },
  cartCardView: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  cartCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2'
  },
  fabStyle: {
    zIndex: 5,
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: 25,
    marginBottom: 50
  },
  fabView: {
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 400,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  fabIcon: {
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    fontSize: 22
  },
  headerListStyle: {
    marginBottom: 0
  }
})
