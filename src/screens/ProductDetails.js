import React, { PureComponent } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform,
  Modal,
  Share,
  TouchableWithoutFeedback
} from 'react-native'
import Header from '../common/HeaderCustom'
import Loader from 'react-native-easy-content-loader'
import CardTem from '../common/CardTemplate'
import Counter from '../common/Counter'
import ImageLoad from '../common/RnImagePlaceH'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import ProductsBanner from '../common/ProductsBanner'
import Stars from 'react-native-stars'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { getThumbnailImage, getUrl } from '../common/WooComFetch'
import theme, { appTextStyle } from '../common/Theme.style'
import { Icon } from 'native-base'
import {
  addToCartFun, checkProductStock, getProducts,
  storeWishlist,
  removeWishlistFun,
  CLEAR_DETAIL_PAGE_PRODUCTS,
  getpdRelatedProducts,
  colorFun,
  getOneProduct
} from '../redux/actions/actions'
import Toast from 'react-native-easy-toast'

const WIDTH = Dimensions.get('window').width

class ProductDetail extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerForceInset: { top: 'never', vertical: 'never' },
      headerShown: false,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed'
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      detailsDisplay: false,
      isModalVisible: false,
      quantityNumber: 1,
      priceNumber: 0,
      selectedVariationsArray: [],
      selectedCombitionProductObject: {},
      enableOutOFStockButtonBool: false,
      imageUrlString: '',
      spinnerTemp: true,
      stockIndicator: false,
      page: 1,
      selected: '',
      timeValue: 400,
      loading: false,
      fabB: false,
      productData: [],
      productColorCounter: 0
    }
    this.props.getOneProductsFun(this.props, this, this.props.navigation.state.params.objectArray.product_id)
    this.state.priceNumber = this.props.navigation.state.params.objectArray.product_price
    if (this.props.navigation.state.params.objectArray.product_discount_price !== 0) { this.state.priceNumber = this.props.navigation.state.params.objectArray.product_discount_price }
    this.toast = null
    this.props.clearProducts()
  }

  navigate = json => {
    this.setState({ productData: json })
  }

  componentDidMount () {
    this.setState({ activityIndicatorTemp: false })
    this.props.cartProductsArray.forEach(element => {
      if (this.state.productData.product_id === element.product_id) {
        if (element.qty !== this.state.quantityNumber &&
          this.state.productData.product_id === element.product_id) { this.setState({ quantityNumber: element.qty }) }
      }
    })
  }

  labelesFun = (color, value) => (
    <View style={[styles.labelView, {
      backgroundColor: color
    }]}>
      <Text style={[styles.textBold, {
        color: this.props.themeStyle.textTintColor,
        fontFamily: appTextStyle.fontFamily,
        fontSize: appTextStyle.largeSize + 2
      }]}>
        {value}
      </Text>
    </View>
  )

  productDiscount = (data) => {
    let rtn = ''
    const p1 = parseInt(data.product_price)
    const p2 = parseInt(data.product_discount_price)

    let result = Math.abs((p1 - p2) / p1 * 100)
    result = parseInt(result.toString())
    if (result === 0) { return false }
    rtn = '-' + result + '%'
    return rtn
  }

  quantityMinus = (value) => {
    if (this.state.quantityNumber > 1) { this.setState({ quantityNumber: value }) }
  }

  calculatePrice = () => {
    return this.state.quantityNumber * this.state.priceNumber
  }

  quantityPlus = (value) => {
    this.setState({ quantityNumber: value })
  }

  selectedBadge = (attribute, id) => {
    let found = 0
    this.state.selectedVariationsArray.forEach(element => {
      if (attribute === element.attribute && id === element.id) {
        found++
      }
    })
    if (found === 0) {
      return false
    } else { return true }
  }

  addVaration = (attribute, id, name) => {
    const array = [...this.state.selectedVariationsArray]
    let found = 0
    array.forEach(element => {
      if (attribute === element.attribute) {
        element.id = id
        element.name = name
        found++
      }
    })
    if (found === 0) {
      array.push({ attribute: attribute, id: id, name: name })
    }
    this.setState({ selectedVariationsArray: array, enableOutOFStockButtonBool: false }, () => {
      if (array.length === this.state.productData.attribute.length) {
        this.findAndSelectProductCombination()
      }
    })
  }

  findAndSelectProductCombination = () => {
    let found = 0
    this.state.productData.product_combination.forEach(combination => {
      found = 0
      this.state.selectedVariationsArray.forEach(inner => {
        const searchString = JSON.stringify(combination)
        if (searchString.includes('"variation_id":' + inner.id)) found++
        if (found === this.state.selectedVariationsArray.length) {
          this.state.selectedCombitionProductObject = combination
        }
      })
    })

    this.setState({
      imageUrlString: this.state.selectedCombitionProductObject.gallary !== null &&
        this.state.selectedCombitionProductObject.gallary !== undefined
        ? this.state.selectedCombitionProductObject.gallary.gallary_name : '',
      priceNumber: this.state.selectedCombitionProductObject.price,
      enableOutOFStockButtonBool: false
    })
  }
  /// /////

  productIsInList = (id) => {
    let found = false
    if (this.props.wishlistArray !== undefined &&
      this.props.wishlistArray !== null &&
      this.props.wishlistArray !== '') {
      this.props.wishlistArray.forEach(element => {
        if (element.product_id === id) { found = true }
      })
    }
    return found
  }

  getWishListId = (id) => {
    let found = 0
    if (this.props.wishlistArray !== undefined &&
      this.props.wishlistArray !== null &&
      this.props.wishlistArray !== '') {
      this.props.wishlistArray.forEach(element => {
        if (element.product_id === id) { found = element.wishlist }
      })
    }
    return found
  }

  addWishlist = (props, t, data) => {
    if (Object.keys(this.props.userData).length === 0) {
      this.props.navigation.navigate('LoginScreen')
    } else {
      t.setState({
        spinnerTemp: true
      })

      if (this.productIsInList(data.product_id)) {
        const wishListId = this.getWishListId(data.product_id)
        this.props.removeWishlistCall(this.props.userData, data.product_id,
          this, wishListId)
      } else {
        const data2 = this.props.storeWishlistCall(this.props.userData, data.product_id,
          this)
      }
    }
  }

  // /////////////////
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          getUrl() +
          'product/' +
          this.state.productData.product_id
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert(error.message)
    }
  }
  /// ///////////////

  handleLoadMore () {
    if (this.props.products.length % 10 === 0) {
      this.setState(
        {
          refreshing: true,
          fabB: this.props.products.length > 9
        },
        () => {
          this.state.page++
          this.props.getProductsFun(this.props, this.state.page,
            this.state.productData.category[0].category_detail.detail[0].category_id, this)
        }
      )
    } else {
      this.setState({
        refreshing: false
      })
    }
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
          backgroundColor: this.props.themeStyle.secondryBackgroundColor,
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

  renderSeparator = () => (
    <View style={styles.separatorStyle} />
  )

  renderFooter = () => (
    <View
      style={[styles.footerStyle, {
        marginBottom: this.state.refreshing ? 50 : 10
      }]}>
      {this.state.refreshing ? (
        <View
          style={{
            height: 10,
            marginTop: 25
          }}>
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
    // }
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

  /// /////////////

  render () {
    const data = this.state.productData

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

    return this.state.productData.length === 0 ? (
      <View style={[styles.IndicatorStyles, { backgroundColor: this.props.themeStyle.primaryBackgroundColor }]}>
        <Header shadow={false} backIcon={true} cartIcon={true} navigation={this.props.navigation} name={this.props.language['Product Details']} navigation={this.props.navigation} />

        <UIActivityIndicator
          size={27}
          color={this.props.themeStyle.primary}
        />
      </View>
    ) : (
      <View style={[styles.container, { backgroundColor: this.props.themeStyle.primaryBackgroundColor }]}>
        <Header shadow={false} backIcon={true} cartIcon={true} navigation={this.props.navigation} name={this.props.language['Product Details']} navigation={this.props.navigation} />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
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

        <Toast
          ref={ref => { this.toast = ref }}
          style={styles.toastStyle}
          position='bottom'
          positionValue={200}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.mediumSize }}
        />

        {/* add to cart modal start */}

        <Modal visible={this.state.isModalVisible}
          transparent={true}
          onRequestClose={() => { this.setState({ isModalVisible: false }) }}

          animationType={'fade'}
        >
          <Toast
            ref={ref => { this.toast = ref }}
            style={styles.toastStyle}
            position='bottom'
            positionValue={200}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.mediumSize }}
          />
          {data.product_type === 'variable'
            ? <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={() => this.setState({ isModalVisible: false })}>
                <View style={styles.modalOverlay} />
              </TouchableWithoutFeedback>
              <View
                style={[
                  {
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor,
                    paddingHorizontal: 10,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30

                  }
                ]}>
                <View
                  style={[styles.closeIconView, {
                    backgroundColor: this.props.themeStyle.iconPrimaryColor

                  }]}
                />

                <View style={styles.modalDetailContainer}>
                  {data.product_gallary_detail[0] !== undefined
                    ? <ImageLoad
                      key={1}
                      style={styles.modalProductImage}
                      source={{ uri: getThumbnailImage() + data.product_gallary_detail[0].gallary_name }}
                    ></ImageLoad>
                    : null}
                  <View style={styles.modalPriceContainer}>
                    <Text style={[styles.priceText, {
                      color: this.props.themeStyle.primary,
                      fontSize: appTextStyle.largeSize,
                      fontFamily: appTextStyle.fontFamily,
                      fontWeight: 'bold'
                    }]}>
                      {this.props.settings.currency_symbol + ' ' + this.calculatePrice()}
                    </Text>

                    <View style={[styles.tagView, {
                      paddingTop: 5
                    }]}>
                      <Text style={[{
                        color: this.props.themeStyle.iconPrimaryColor,
                        fontSize: appTextStyle.largeSize,
                        fontFamily: appTextStyle.fontFamily,
                        fontWeight: 'bold'
                      }]}>
                        {this.props.language.Selected + ': '}
                      </Text>
                      {this.state.selectedVariationsArray.map((value, key) => (
                        <Text
                          key={key}
                          style={[{
                            color: this.props.themeStyle.textColor,
                            fontFamily: appTextStyle.fontFamily,
                            fontSize: appTextStyle.largeSize
                          }]}>
                          {value.name + ' ,'}
                        </Text>
                      ))}

                    </View>
                  </View>
                </View>
                {
                  data.attribute !== undefined
                    ? data.attribute.map((att, key) => (

                      <View key={key}>
                        <Text style={[styles.modalAttrKey, {
                          color: this.props.themeStyle.textColor,
                          fontFamily: appTextStyle.fontFamily,
                          fontSize: appTextStyle.largeSize + 2
                        }]}>
                          {att.attributes.detail[0].name}
                        </Text>

                        <View style={styles.modalWrapAtt}>

                          {att.variations.map((attValue, key) => (

                            <TouchableOpacity
                              key={key}
                              onPress={() => this.addVaration(att.attributes.detail[0].name, attValue.product_variation.id, attValue.product_variation.detail[0].name)}
                              style={[styles.attributeView, {
                                backgroundColor: this.selectedBadge(att.attributes.detail[0].name, attValue.product_variation.id) ? this.props.themeStyle.primary : this.props.themeStyle.secondryBackgroundColor,
                                borderColor: this.selectedBadge(att.attributes.detail[0].name, attValue.product_variation.id) ? this.props.themeStyle.primary : this.props.themeStyle.iconPrimaryColor
                              }]}>
                              <Text style={[{
                                color: !this.selectedBadge(att.attributes.detail[0].name, attValue.product_variation.id) ? this.props.themeStyle.textColor : this.props.themeStyle.textTintColor,
                                fontSize: appTextStyle.largeSize,
                                fontFamily: appTextStyle.fontFamily
                              }]}>
                                {attValue.product_variation.detail[0].name}
                              </Text>
                            </TouchableOpacity>

                          ))}
                        </View>
                      </View>
                    )) : null}

                <Text style={[styles.modalQltyText, {
                  color: this.props.themeStyle.textColor,
                  fontFamily: appTextStyle.fontFamily,
                  fontSize: appTextStyle.largeSize
                }]}>
                  {'Quantity'}
                </Text>

                <Counter
                  minimumValue={1}
                  initialValue={this.state.quantityNumber}
                  width={35}
                  containerWidth={90}
                  height={4}
                  onDecrement={value =>
                    this.quantityMinus(value)
                  }
                  onIncrement={value =>
                    this.quantityPlus(value)
                  }
                />
                {this.state.stockIndicator
                  ? <UIActivityIndicator
                    style={styles.stockIndicator}
                    size={27}
                    color={this.props.themeStyle.primary}
                  />
                  : <TouchableOpacity
                    style={[styles.addtoCartBtn, {
                      paddingBottom: 30
                    }]}
                    onPress={() => {
                      if (!this.state.enableOutOFStockButtonBool) {
                        this.setState({ stockIndicator: true }, async () => {
                          const data1 = await checkProductStock(
                            data.product_id,
                            data.product_type,
                            this.state.selectedCombitionProductObject.product_combination_id,
                            this.state.quantityNumber,
                            this
                          )
                          if (data1.status === 'outOfStock') {
                            this.setState({
                              enableOutOFStockButtonBool: true,
                              stockIndicator: false
                            })
                          } else if (data1.status === 'canAddToCart') {
                            this.props.addToCartCall(data.product_id,
                              this.state.quantityNumber,
                              this.state.selectedCombitionProductObject.product_combination_id,
                              this.props.sessionId, this)
                          } else if (data1.status === 'quantityIsLimited') {
                            this.setState({
                              quantityNumber: data1.stock,
                              stockIndicator: false
                            }, () => {
                              this.toast.show(this.props.language['Product Quantity is Limited!'])
                            })
                          }
                        })
                      }
                    }}
                    disabled={this.state.selectedVariationsArray.length !== data.attribute.length}
                  >
                    <View
                      style={[styles.btnView, {
                        width: WIDTH * 0.8,
                        backgroundColor: this.state.selectedVariationsArray.length !== data.attribute.length ? 'gray' : this.props.themeStyle.primary
                      }]}>
                      <Icon
                        name={'cart'}
                        style={[styles.myStarStyle, {
                          color: this.props.themeStyle.primary
                        }, styles.myEmptyStarStyle]}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: appTextStyle.mediumSize,
                          fontFamily: appTextStyle.fontFamily,
                          color: this.props.themeStyle.textTintColor,
                          padding: 10
                        }}>
                        {this.state.enableOutOFStockButtonBool
                          ? this.props.language['Out of Stock']
                          : this.props.language.Continue}
                      </Text>
                    </View>
                  </TouchableOpacity>

                }
              </View>
            </View> : null}
        </Modal>

        {/* add to cart modal end */}

        <Spinner
          visible={this.state.spinnerTemp}
          textStyle={styles.spinnerTextStyle}
        />

        <FlatList
          showsVerticalScrollIndicator={false}
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
          key={'1'}
          numColumns={2}
          ref={ref => {
            this.flatListRef = ref
          }}
          keyExtractor={(item, index) => index.toString()}
          columnWrapperStyle={{
            paddingLeft: '0.7%',
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}
          contentContainerStyle={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}
          extraData={this.state}
          renderItem={this.renderItem}
          ListHeaderComponent={
            <View style={styles.headerListStyle}>

              <View style={[styles.headerBar, { width: WIDTH }]}>
                <TouchableOpacity
                  onPress={() => { this.onShare() }}>
                  <FontAwesome
                    style={{
                      color: this.props.themeStyle.textTintColor,
                      fontSize: appTextStyle.largeSize + 4,
                      paddingRight: 12
                    }}
                    active
                    name='share'
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.addWishlist(this.props, this, data)
                }}>
                  <Ionicons
                    style={{
                      color: this.props.themeStyle.textTintColor,
                      fontSize: appTextStyle.largeSize + 8
                    }}
                    active
                    name={this.productIsInList(this.state.productData.product_id) ? 'heart' : 'heart-outline'}

                  />
                </TouchableOpacity>
              </View>

              <ProductsBanner
                productImage={data.product_gallary_detail}
                navigation={this.props.navigation}
                reset={() => this.setState({ visible: false })}
                objectArray={data}
              />

              <View style={[styles.labelsContainer, {
                backgroundColor: this.props.themeStyle.secondryBackgroundColor
              }]}>

                <View style={[styles.labelRow]}>
                  <View style={styles.labelsView}>
                    {
                      data.product_discount_price !== 0
                        ? this.labelesFun('red', this.props.language.SALE) : <View />}

                    {
                      data.is_featured
                        ? this.labelesFun('red', this.props.language.FEATURED)

                        : <View />}

                  </View>

                </View>

                <Text style={[styles.titleText, {
                  color: this.props.themeStyle.textColor,
                  fontFamily: appTextStyle.fontFamily,
                  fontSize: appTextStyle.largeSize + 2,
                  fontWeight: 'bold'
                }]}>
                  {data.detail[0].title}
                </Text>

                <View style={styles.priceView}>

                  {data.product_discount_price === 0
                    ? <Text style={[styles.priceText, {
                      color: this.props.themeStyle.primary,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.largeSize
                    }]}>
                      {this.props.settings.currency_symbol + ' ' + data.product_price}
                    </Text>
                    : null}

                  {data.product_discount_price !== 0

                    ? <View style={{ flexDirection: 'row' }}>

                      <Text style={[styles.priceText, {
                        color: this.props.themeStyle.primary,
                        fontFamily: appTextStyle.fontFamily,
                        fontSize: appTextStyle.largeSize
                      }]}>
                        {this.props.settings.currency_symbol + ' ' + data.product_discount_price}
                      </Text>
                      <Text style={[styles.priceText, {
                        color: this.props.themeStyle.iconPrimaryColor,
                        fontFamily: appTextStyle.fontFamily,
                        fontSize: appTextStyle.largeSize,
                        textDecorationLine: 'line-through'
                      }]}>
                        {this.props.settings.currency_symbol + ' ' + data.product_price}
                      </Text>
                      <Text style={[styles.percentText, {
                        color: this.props.themeStyle.textTintColor,
                        fontFamily: appTextStyle.fontFamily,
                        fontSize: appTextStyle.smallSize
                      }]}>
                        {this.productDiscount(data)}
                      </Text>
                    </View>
                    : null}

                </View>

              </View>

              {/* Product description start */}
              <View style={[styles.productDetailsView, {
                backgroundColor: this.props.themeStyle.secondryBackgroundColor,
                padding: 15,
                paddingVertical: 0
              }]}>
                <View style={styles.tagView}>
                  <Text style={[styles.detailText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    fontSize: appTextStyle.largeSize,
                    marginLeft: -1
                  }]}>
                    {this.props.language.Categories + ': '}
                  </Text>
                  {data.category.map((value) => (

                    <Text style={[styles.detailText, {
                      color: this.props.themeStyle.iconPrimaryColor,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.largeSize
                    }]}>
                      {value.category_detail.parent_name}
                    </Text>

                  ))
                  }
                </View>

                <View>
                  <View style={styles.tagView}>
                    <Text style={[styles.detailText, {
                      color: this.props.themeStyle.textColor,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.largeSize
                    }]}>
                      {this.props.language.Id + ': '}
                    </Text>
                    <Text style={[styles.detailText, {
                      color: this.props.themeStyle.iconPrimaryColor,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.largeSize
                    }]}>
                      {data.product_id}
                    </Text>
                  </View>

                  {data.product_brand
                    ? <View style={styles.tagView}>
                      <Text style={[styles.detailText, {
                        color: this.props.themeStyle.textColor,
                        fontFamily: appTextStyle.fontFamily,
                        fontSize: appTextStyle.largeSize
                      }]}>
                        {this.props.language.Tags + ': '}
                      </Text>
                      <Text style={[styles.detailText, {
                        color: this.props.themeStyle.iconPrimaryColor,
                        fontFamily: appTextStyle.fontFamily,
                        fontSize: appTextStyle.largeSize
                      }]}>
                        {data.product_brand.brand_name}
                      </Text>
                    </View>
                    : null}

                  <Text style={[styles.detailText, {
                    color: this.props.themeStyle.primary,
                    fontFamily: appTextStyle.fontFamily,
                    fontSize: appTextStyle.largeSize
                  }]}>
                    {this.props.language.Description + ': '}
                  </Text>
                  <Text style={[styles.detailText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    fontSize: appTextStyle.mediumSize
                  }]}>
                    {data.detail[0].desc}
                  </Text>
                </View>
              </View>

              {/* Product description end */}

              {data.product_type === 'variable'
                ? <TouchableOpacity
                  onPress={() => this.setState({ isModalVisible: true })}

                  style={[styles.productDetailsView, styles.productDetailsRow,
                    styles.shadow, {
                      backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                      borderColor: this.props.themeStyle.primary,
                      padding: 12
                    }]}>
                  <Text style={[styles.priceText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    fontSize: appTextStyle.mediumSize
                  }]}>
                    {this.props.language.SelectColorSizeQuality}
                  </Text>

                  <FontAwesome
                    style={{
                      color: this.props.themeStyle.iconPrimaryColor,
                      fontSize: appTextStyle.largeSize
                    }}
                    active
                    name={this.state.detailsDisplay
                      ? 'chevron-down'
                      : !I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
                  />
                </TouchableOpacity>
                : data.product_type === 'simple'
                  ? <View
                    style={[styles.productDetailsView, styles.productDetailsRow,
                      styles.shadow, {
                        backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                        padding: 8,
                        borderColor: this.props.themeStyle.primary
                      }]}>
                    <Text style={[styles.priceText, styles.simpleQuantityText, {
                      color: this.props.themeStyle.textColor,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.mediumSize + 1
                    }]}>
                      {this.props.language.Quantity}
                    </Text>

                    <Counter
                      minimumValue={1}
                      containerWidth={90}
                      initialValue={this.state.quantityNumber}
                      width={34}
                      height={1}
                      onDecrement={value =>
                        this.quantityMinus(value)
                      }
                      onIncrement={value =>
                        this.quantityPlus(value)
                      }
                    />
                  </View>
                  : null
              }

              <View style={[styles.productDetailsView, {
                backgroundColor: this.props.themeStyle.secondryBackgroundColor
              }]}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('RatingAndReviewScreen', {
                      id: data.product_id
                    })
                  }}
                  style={[styles.productDetailsRow, {
                    borderWidth: 0
                  }]}>
                  <View style={styles.reviewContainer}>
                    <Text style={[styles.priceText, {
                      color: this.props.themeStyle.textColor,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.largeSize,
                      fontWeight: 'bold'
                    }]}>
                      {this.props.language.AllReviews}
                    </Text>

                    <Text style={[styles.priceText, {
                      color: this.props.themeStyle.iconPrimaryColor,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.largeSize,
                      fontWeight: 'bold'
                    }]}>
                      {'(' + data.reviews.length + ')'}
                    </Text>
                  </View>
                  <Text style={[styles.priceText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily,
                    fontSize: appTextStyle.smallSize,
                    fontWeight: 'bold'
                  }]}>
                    {this.props.language['View All']}
                  </Text>
                </TouchableOpacity>
                {data.product_rating !== undefined &&
                  data.product_rating !== null
                  ? <View style={styles.avgReviewContainer}>

                    <Text style={[styles.priceText, {
                      color: this.props.themeStyle.textColor,
                      fontFamily: appTextStyle.fontFamily,
                      fontSize: appTextStyle.largeSize + 6,
                      fontWeight: 'bold'
                    }]}>
                      {data.product_rating.toFixed(Number(this.props.settings.currency_decimals))}
                    </Text>

                    <Stars
                      disabled
                      default={parseFloat(
                        data.product_rating
                      )}
                      count={5}
                      starSize={10}
                      half
                      fullStar={<Icon name={'star'} style={[styles.myStarStyle, {
                        color: this.props.themeStyle.primary
                      }]} />}
                      emptyStar={
                        <Icon
                          name={'star-outline'}
                          style={[styles.myStarStyle, {
                            color: this.props.themeStyle.primary
                          }, styles.myEmptyStarStyle]}
                        />
                      }
                      halfStar={<Icon name={'star-half'} style={[styles.myStarStyle, {
                        color: this.props.themeStyle.primary
                      }]} />}
                    />

                  </View>
                  : null}
                {data.reviews.length !== 0
                  ? <View style={styles.commentContainer}>

                    <ImageLoad
                      key={1}
                      style={styles.commentAvatar}
                      backgroundColor='transparent'
                      color='transparent'
                      source={require('../images/avatar.png')}
                    />

                    <View style={styles.commentNameContainer}>
                      <Text style={[styles.priceText, {
                        color: this.props.themeStyle.textColor,
                        fontFamily: appTextStyle.fontFamily,
                        fontSize: appTextStyle.largeSize

                      }]}>
                        {data.reviews[0].title}
                      </Text>
                      <Stars
                        disabled
                        default={parseFloat(
                          data.reviews[0].rating
                        )}
                        count={5}
                        starSize={2}
                        half
                        fullStar={<Icon name={'star'} style={[styles.myStarStyle, {
                          color: this.props.themeStyle.primary,
                          fontSize: 14
                        }]} />}
                        emptyStar={
                          <Icon
                            name={'star-outline'}
                            style={[styles.myStarStyle, {
                              color: this.props.themeStyle.primary,
                              fontSize: 14
                            }, styles.myEmptyStarStyle]}
                          />
                        }
                        halfStar={<Icon name={'star-half'} style={[styles.myStarStyle, {
                          color: this.props.themeStyle.primary,
                          fontSize: 14
                        }]} />}
                      />
                    </View>

                  </View>
                  : null}

              </View>

              <TouchableOpacity
                style={styles.addtoCartBtn}
                onPress={() => {
                  if (data.product_type === 'variable') {
                    this.setState({
                      isModalVisible: true
                    })
                  } else if (data.product_type === 'simple') {
                    if (!this.state.enableOutOFStockButtonBool) {
                      this.setState({ spinnerTemp: true }, async () => {
                        const data1 = await checkProductStock(
                          data.product_id,
                          data.product_type,
                          this.state.selectedCombitionProductObject.product_combination_id,
                          this.state.quantityNumber,
                          this
                        )
                        if (data1.status === 'outOfStock') {
                          this.setState({
                            enableOutOFStockButtonBool: true,
                            spinnerTemp: false
                          })
                        } else if (data1.status === 'canAddToCart') {
                          this.props.addToCartCall(data.product_id, this.state.quantityNumber, this.state.selectedCombitionProductObject.product_combination_id,
                            this.props.sessionId, this)
                        } else if (data1.status === 'quantityIsLimited') {
                          this.setState({
                            quantityNumber: data1.stock,
                            spinnerTemp: false
                          }, () => {
                            this.toast.show(this.props.language['Product Quantity is Limited!'])
                          })
                        }
                      })
                    }
                  }
                }}
                disabled={this.state.enableOutOFStockButtonBool}
              >
                <View
                  style={[styles.btnView, {
                    backgroundColor: this.props.themeStyle.primary
                  }]}>
                  <Icon
                    name={'cart'}
                    style={{
                      color: this.props.themeStyle.textTintColor,
                      fontSize: 17
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: appTextStyle.mediumSize,
                      fontFamily: appTextStyle.fontFamily,
                      color: this.props.themeStyle.textTintColor,
                      padding: 10
                    }}>
                    {this.state.enableOutOFStockButtonBool
                      ? this.props.language['Out of Stock']
                      : this.props.language['ADD TO CART']}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.headingView, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>

                <Text style={{
                  color: this.props.themeStyle.textColor,
                  fontFamily: appTextStyle.fontFamily,
                  fontSize: appTextStyle.largeSize,
                  alignSelf: 'flex-start',
                  fontWeight: 'bold'
                }}>{this.props.language['JUST FOR YOU']}</Text>
              </View>
            </View>
          }
          onScroll={this.handleScroll.bind(this)}
        />

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalAddToCartBtn: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    elevation: 1,
    padding: 50,
    shadowOffset: { width: 1, height: 1 }
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    elevation: 1,
    shadowOffset: { width: 1, height: 1 }
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
  productsImage: {
    height: 45,
    width: 45,
    overflow: 'hidden',
    marginTop: 10,
    marginRight: 10
  },
  headingView: {
    alignSelf: 'center',
    padding: 12,
    width: WIDTH,
    marginTop: 0,
    marginBottom: -5
  },
  avgReviewContainer: {
    flexDirection: 'row',
    width: WIDTH * 0.8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center'
  },
  modalDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
    paddingHorizontal: 0
  },
  commentStars: {
    width: WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 50,
    paddingBottom: 10
  },
  attributeView: {
    padding: 5,
    paddingHorizontal: 12,
    borderRadius: appTextStyle.customRadius - 15,
    margin: 10,
    marginLeft: 0,
    marginBottom: 0,
    borderWidth: 1
  },
  reviewImageWrap: {
    padding: 2,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  singleBannerView: {
    paddingVertical: 8,
    marginTop: 8
  },
  btnView: {
    alignItems: 'center',
    width: WIDTH * 0.93,
    justifyContent: 'center',
    borderRadius: appTextStyle.customRadius,
    flexDirection: 'row'
  },
  labelsContainer: {
    padding: 15,
    width: WIDTH,
    marginBottom: 6,
    paddingBottom: 0
  },
  commentNameContainer: {
    paddingHorizontal: 12
  },
  absoluteAddtoCartText: {
    padding: 10,
    textAlign: 'center'
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  absoluteAddtoCart: {
    width: WIDTH * 0.9,
    borderRadius: appTextStyle.customRadius,
    alignSelf: 'center'
  },
  reviewContainer: {
    flexDirection: 'row'
  },
  simpleQuantityText: {
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  commentAvatar: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    overflow: 'hidden'
  },
  modalAddToCartText: {
    padding: 10,
    alignSelf: 'center',
    marginTop: 60,
    width: WIDTH * 0.9,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  modalWrapAtt: {
    flexWrap: 'wrap', flexDirection: 'row'
  },
  closeIconView: {
    alignSelf: 'center',
    height: 3,
    marginTop: 20,
    marginBottom: 10,
    width: 70
  },
  labelsView: {
    flexDirection: 'row'
  },
  modalQltyText: {
    paddingVertical: 15
  },
  modalAttrKey: {
    margin: 10,
    marginLeft: 5,
    marginBottom: 0
  },
  addtoCartBtn: {
    paddingTop: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: appTextStyle.customRadius

  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 2,
    right: 15,
    top: 12
  },
  stockIndicator: {
    padding: 19,
    alignSelf: 'center',
    marginTop: 60,
    width: WIDTH * 0.9,
    textAlign: 'center',
    marginBottom: 19
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end'
  },
  productDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WIDTH * 0.94,
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: appTextStyle.customRadius - 10
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -1

  },
  tagView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  productDetailsView: {
    padding: 15,
    width: WIDTH,
    marginBottom: 6
  },
  labelRow: {
    flexDirection: 'row',
    paddingBottom: 9,
    justifyContent: 'space-between'
  },
  labelView: {
    padding: 0,
    paddingHorizontal: 6,
    marginRight: 6,
    borderRadius: appTextStyle.customRadius - 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textBold: {
    fontWeight: 'bold'
  },
  categoryLabel: {
    paddingBottom: 4,
    alignSelf: 'flex-start'
  },
  modalPriceContainer: {
    paddingHorizontal: 10
  },
  toastStyle: {
    backgroundColor: '#c1c1c1'
  },
  titleText: {
    paddingBottom: 10,
    alignSelf: 'flex-start',
    textAlign: 'left',
    marginLeft: -2
  },
  modalProductImage: {
    height: 90,
    width: 90,
    backgroundColor: 'rgb(236, 236, 236)',
    borderRadius: appTextStyle.customRadius - 11
  },
  priceText: {
    paddingRight: 6,
    alignSelf: 'flex-start',
    textAlign: 'left'
  },
  detailText: {
    paddingTop: 9,
    paddingRight: 6,
    alignSelf: 'flex-start',
    textAlign: 'left'
  },
  percentText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    backgroundColor: 'red',
    fontWeight: 'bold',
    paddingHorizontal: 3,
    paddingVertical: 1
  },
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
  IndicatorStyles: {
    flex: 1,
    justifyContent: 'center'
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
  paragraphStyles: {
    paddingTop: 7,
    padding: 6,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  separatorStyle: {
    height: 1, width: '100%', backgroundColor: '#ddd'
  },
  footerStyle: {
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center'
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
    marginBottom: 5
  },
  singleBanner: {
    width: WIDTH,
    height: 160,
    marginVertical: 5
  },
  myStarStyle: {
    backgroundColor: 'transparent',
    fontSize: 17,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  myEmptyStarStyle: {
    color: '#e0e0e0'
  }
})

/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getAppinPro = (state) => state.appConfig.appInProduction
const getCartArray = (state) => state.cartData.cartProductsArray
const getCategories = (state) => state.getCategories.categories
const getBanners = (state) => state.bannersData.banners
const getSettings = (state) => state.settingsCall.settings
const getproductsArray = (state) => state.productsData.pdRelatedProducts
const getSessionId = (state) => state.userData.sessionId
const wishlistArray = (state) => state.wishlistData.wishlistArray
const getUserData = (state) => state.userData.user
const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)
const wishlistArrayFun = createSelector(
  [wishlistArray],
  (wishlistArray) => {
    return wishlistArray
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
const getAppinProFun = createSelector(
  [getAppinPro],
  (getAppinPro) => {
    return getAppinPro
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
const mapDispatchToProps = dispatch => ({
  getOneProductsFun: (props, th, id) => {
    dispatch(async dispatch => {
      await getOneProduct(dispatch, props.settings.language_id, props.settings.currency_id, id, th)
    })
  },
  removeWishlistCall: (userData, productId, th, wishListId) => {
    dispatch(async dispatch => {
      await removeWishlistFun(dispatch, userData, productId, th, wishListId)
    })
  },
  storeWishlistCall: (userData, productId, th) => {
    dispatch(async dispatch => {
      await storeWishlist(dispatch, userData, productId, th)
    })
  },
  getProductsFun: (props, page, selectedItem, th) => {
    dispatch(async dispatch => {
      await getpdRelatedProducts(dispatch, props.settings.language_id, props.settings.currency_id, page, selectedItem, th)
    })
  },
  clearProducts: () => {
    dispatch({
      type: CLEAR_DETAIL_PAGE_PRODUCTS
    })
  },
  addToCartCall: (productId, quantityNumber, productCombinationId, sessionId, th) => {
    dispatch(async dispatch => {
      await addToCartFun(dispatch, productId, quantityNumber, productCombinationId,
        sessionId, th)
    })
  }
})
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  sessionId: getSessionIdFun(state),
  categories: getCategoriesFun(state),
  banners: getBannersFun(state),
  settings: getSettingsFun(state),
  products: getproductsArrayFun(state),
  appInProduction: getAppinProFun(state),
  wishlistArray: wishlistArrayFun(state),
  userData: getUserDataFun(state),
  cartProductsArray: getCartArrayFun(state)

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail)
