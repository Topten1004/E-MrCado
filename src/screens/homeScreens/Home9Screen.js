import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  PixelRatio,
  StyleSheet,
  I18nManager,
  Linking
} from 'react-native'
import { createSelector } from 'reselect'
import {
  getProducts,
  CLEAR_PRODUCTS,
  getOneProduct,
  colorFun
} from '../../redux/actions/actions'
import { UIActivityIndicator } from 'react-native-indicators'
import CategoryHeading from '../../common/CategoryHeading'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Spinner from 'react-native-loading-spinner-overlay'
import Header from '../../common/HeaderCustom'
import { connect } from 'react-redux'
import CardTem from '../../common/CardTemplate'
import { Icon } from 'native-base'
import Loader from 'react-native-easy-content-loader'
import Banner from '../../common/Banner'
import ImageLoad from '../../common/RnImagePlaceH'
import FlatListView from '../../common/FlatListView'
import CategoryFlatList from '../../common/CategoriesFlatList'
import theme, { appTextStyle } from '../../common/Theme.style'
import Toast from 'react-native-easy-toast'

const WIDTH = Dimensions.get('window').width
class Newest extends Component {
  static navigationOptions = () => ({
    headerShown: false
  })

  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      fabB: false,
      selected: '',
      timeValue: 400,
      selectedTab: '1',
      productView: 'grid',
      loading: false,
      activityIndicatorTemp: true,
      spinnerTemp: false,
      //
      page: 1,
      productColorCounter: 0

    }
    this.toast = null
  }

  handleOpenURL = event => {
    // D
    if (event.url !== '' && event.url !== undefined && event.url !== null) {
      const route = event.url.replace(/.*?:\/\//g, '')
      const id = route.match(/\/([^/]+)\/?$/)[1]
      if (id !== '' && id !== undefined && id !== null) {
        this.setState({ spinnerTemp: true }, () => {
          this.props.getOneProductsFun(this.props, this, id)
        })
      }
    }
  }

  navigate = json => {
    // E
    if (json !== '' && json !== undefined && json !== null) {
      Linking.removeEventListener('url', this.handleOpenURL)
      this.props.navigation.navigate('ProductDetails', { objectArray: json })
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({ activityIndicatorTemp: false })
    }, 1000)
    this.props.navigation.setParams({
      headerTitle: this.props.language.Home
    })
    if (Platform.OS === 'android') {
      const NativeLinking = require('react-native/Libraries/Linking/NativeLinking')
        .default
      NativeLinking.getInitialURL().then(url => {
        if (url !== '' && url !== undefined && url !== null) {
          const route = url.replace(/.*?:\/\//g, '')
          const id = route.match(/\/([^/]+)\/?$/)[1]
          if (id !== '' && id !== undefined && id !== null) {
            this.setState({ spinnerTemp: true }, () => {
              this.props.getOneProductsFun(this.props, this, id)
            })
          }
        }
      })
    } else {
      this.dimensionsSubscription = Linking.addEventListener('url', this.handleOpenURL)
    }
  }

  componentWillUnmount () {
    clearInterval(this.state.activityIndicatorTemp)
    if (this.dimensionsSubscription !== undefined) { this.dimensionsSubscription.remove() }
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

  noProductFun = () => (
    <View
      style={styles.noProductView}>
      <Icon
        name={'logo-dropbox'}
        style={{ color: 'gray', fontSize: 80 }}
      />
      <Text
        style={{
          fontFamily: appTextStyle.fontFamily,
          fontSize: appTextStyle.largeSize + 2,
          color: this.props.themeStyle.textColor
        }}>
        {
          this.props.language[
            'No Products Found'
          ]
        }
      </Text>
    </View>
  )

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

  iconTextFun = (iconName, text) => (
    <View
      style={styles.iconTextStyle}>
      <FontAwesome
        name={iconName}
        style={{
          color: this.props.themeStyle.iconPrimaryColor,
          transform: [{ rotateY: '180deg' }],
          fontSize: appTextStyle.largeSize +
            PixelRatio.getPixelSizeForLayoutSize(6)
        }}
      />
      <Text
        style={{
          fontSize: appTextStyle.smallSize - 1,
          color: this.props.themeStyle.textColor,
          fontFamily: appTextStyle.fontFamily,
          paddingTop: 5
        }}>
        {
          text
        }
      </Text>
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

    return this.state.activityIndicatorTemp ? (
      <View
        style={[styles.activityIndicatorContainer, {
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }]}>
        <UIActivityIndicator
          size={27}
          color={this.props.themeStyle.primary}
        />
      </View>
    ) : (
      // return
      <View
        style={{
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }}>
        <Spinner visible={this.state.spinnerTemp} />
        <Header searchIcon={true} menuIcon={true} cartIcon={true} navigation={this.props.navigation} name={this.props.settings.app_name} navigation={this.props.navigation} />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        {this.props.appInProduction ? (
          <TouchableOpacity
            style={[styles.demoPanalContainer, {
              backgroundColor: this.props.themeStyle.primary
            }]}
            onPress={() => {
              this.props.navigation.navigate('DemoScreen')
            }}>

            <Icon
              name={'md-settings'}
              style={[styles.demoPanal, {
                color: this.props.themeStyle.textTintColor
              }]}
            />

          </TouchableOpacity>
        ) : null}

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

        <FlatList
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
          ListFooterComponent={() => this.renderFooter()}
          keyExtractor={(item, index) => index.toString()}
          columnWrapperStyle={{
            paddingLeft: WIDTH * 0.01
          }}
          contentContainerStyle={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}
          extraData={this.state}
          renderItem={this.renderItem}
          ListHeaderComponent={
            <View style={styles.headerListStyle}>
              <View
                style={{
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor,
                  marginBottom: 6
                }}>

                {
                  <CategoryFlatList
                    dataSource={this.props.sortCategory}
                    products={this.props.language.Products}
                    allCategories={this.props.sortCategory}
                    props={this.props}
                    vertical={true}
                    noOfCol={1}
                    categoryPage={63}
                  />
                }
                <Banner
                  navigation={this.props.navigation}
                />

                <View style={[styles.tabContainer, {
                }]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ selectedTab: '1' })
                    }}
                    style={[styles.tabText, {
                      backgroundColor: this.state.selectedTab === '1' ? this.props.themeStyle.primary : this.props.themeStyle.primaryBackgroundColor
                    }]}>
                    <Text style={{
                      fontSize: appTextStyle.largeSize,
                      fontFamily: appTextStyle.fontFamily,
                      paddingVertical: 6,
                      color: this.state.selectedTab === '1' ? this.props.themeStyle.textTintColor : this.props.themeStyle.textColor
                    }}>{this.props.language['Top Seller']}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ selectedTab: '2' })
                    }}
                    style={[styles.tabText, {
                      backgroundColor: this.state.selectedTab === '2' ? this.props.themeStyle.primary : this.props.themeStyle.primaryBackgroundColor
                    }]}>
                    <Text style={{
                      fontSize: appTextStyle.largeSize,
                      fontFamily: appTextStyle.fontFamily,
                      paddingVertical: 6,
                      color: this.state.selectedTab === '2' ? this.props.themeStyle.textTintColor : this.props.themeStyle.textColor
                    }}>{this.props.language['On Sale']}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ selectedTab: '3' })
                    }}
                    style={[styles.tabText, {
                      backgroundColor: this.state.selectedTab === '3' ? this.props.themeStyle.primary : this.props.themeStyle.primaryBackgroundColor
                    }]}>
                    <Text style={{
                      fontSize: appTextStyle.largeSize,
                      paddingVertical: 6,
                      fontFamily: appTextStyle.fontFamily,
                      color: this.state.selectedTab === '3' ? this.props.themeStyle.textTintColor : this.props.themeStyle.textColor
                    }}>{this.props.language.Featured}</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={styles.screenContainer}>
                  {this.state.selectedTab === '1'
                    ? <View style={styles.screenInnerContainer}>

                      {this.props.topsellerProducts !== undefined ? (
                        <FlatListView
                          vertical={false}
                          noOfCol={2}
                          dataName={'topSelling'}
                          viewButton={false}
                          navigation={this.props.navigation}
                          cardStyle={this.props.settings.home_style}
                          tabArray={
                            this.props.topsellerProducts !== undefined &&
                              this.props.topsellerProducts !== null
                              ? this.props.topsellerProducts
                              : []
                          }
                        />
                      ) : (
                        this.noProductFun()
                      )}
                    </View>
                    : this.state.selectedTab === '3'
                      ? <View style={styles.tabInnerContainer}>

                        {this.props.featuredProducts !== undefined ? (
                          <FlatListView
                            vertical={false}
                            noOfCol={2}
                            dataName={'topSelling'}
                            viewButton={false}
                            navigation={this.props.navigation}
                            cardStyle={this.props.settings.home_style}
                            tabArray={
                              this.props.featuredProducts !== undefined &&
                                this.props.featuredProducts !== null
                                ? this.props.featuredProducts
                                : []
                            }
                          />
                        ) : (
                          this.noProductFun()
                        )}
                      </View>
                      : <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        {this.props.onSaleProducts !== undefined ? (
                          <FlatListView
                            vertical={false}
                            noOfCol={2}
                            dataName={'topSelling'}
                            viewButton={false}
                            navigation={this.props.navigation}
                            cardStyle={this.props.settings.home_style}
                            tabArray={
                              this.props.onSaleProducts !== undefined &&
                                this.props.onSaleProducts !== null
                                ? this.props.onSaleProducts
                                : []
                            }
                          />
                        ) : (
                          this.noProductFun()
                        )}
                      </View>}

                </View>

                {/* {this.state.length > 0 ? (
                  <View
                    style={{
                      backgroundColor: this.props.themeStyle.secondryBackgroundColor,
                      marginBottom: 16
                    }}>
                    {this.props.categories.length > 0
                      ? this.categoryHeading(
                        this.props.language['Recently Viewed']
                      )
                      : null}
                    <FlatListView vertical dataName={'RecentlyViewed'} />
                  </View>
                ) : null} */}
              </View>

              <CategoryHeading
                text={this.props.language['YEARS END SALE']}
              />

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
                  source={require('../../images/Capture.png')}
                />
              </TouchableOpacity>

              <CategoryHeading
                text={this.props.language['Top Seller']}
              />
              {this.props.topsellerProducts !== undefined ? (
                <FlatListView
                  vertical={true}
                  noOfCol={1}
                  dataName={'topSelling'}
                  viewButton={true}
                  navigation={this.props.navigation}
                  cardStyle={'118'}
                  tabArray={
                    this.props.topsellerProducts !== undefined &&
                      this.props.topsellerProducts !== null
                      ? this.props.topsellerProducts
                      : []
                  }
                />
              ) : (
                this.noProductFun()
              )}

              <View style={{ paddingTop: 16, marginBottom: -14 }}>
                <CategoryHeading
                  text={this.props.language['JUST FOR YOU']}
                />
                {this.props.products.length > 0 ? (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={this.props.products}
                    extraData={this.state}
                    horizontal
                    style={{
                      marginTop: 5,
                      paddingTop: 0
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={item => null}
                  />
                ) : (
                  this.noProductFun()
                )}
              </View>
            </View>
          }
          onScroll={this.handleScroll.bind(this)}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
        />
      </View>
    )
  }
}

// //////////////////////
const mapDispatchToProps = dispatch => ({
  getOneProductsFun: (props, th, id) => {
    dispatch(async dispatch => {
      await getOneProduct(dispatch, props.settings.language_id, props.settings.currency_id, id, th)
    })
  },
  getProductsFun: (props, page, th) => {
    dispatch(async dispatch => {
      await getProducts(dispatch, props.settings.language_id, props.settings.currency_id, page, th)
    })
  },
  clearProducts: () => {
    dispatch({
      type: CLEAR_PRODUCTS
    })
  }
})
/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getAppinPro = (state) => state.appConfig.appInProduction

const getCategories = (state) => state.getCategories.sortCategory
const getBanners = (state) => state.bannersData.banners
const getSettings = (state) => state.settingsCall.settings
const getproductsArray = (state) => state.productsData.products
const getHotProductsArray = (state) => state.productsData.hotProducts

const gettopsellerProductsArray = (state) => state.productsData.topsellerProducts
const getfeaturedProductsArray = (state) => state.productsData.featuredProducts
const getonSaleProductsArray = (state) => state.productsData.onSaleProducts

const gettopsellerProductsArrayFun = createSelector(
  [gettopsellerProductsArray],
  (gettopsellerProductsArray) => {
    return gettopsellerProductsArray
  }
)
const getfeaturedProductsArrayFun = createSelector(
  [getfeaturedProductsArray],
  (getfeaturedProductsArray) => {
    return getfeaturedProductsArray
  }
)
const getonSaleProductsArrayFun = createSelector(
  [getonSaleProductsArray],
  (getonSaleProductsArray) => {
    return getonSaleProductsArray
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

const getHotProductsArrayFun = createSelector(
  [getHotProductsArray],
  (getHotProductsArray) => {
    return getHotProductsArray
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
  sortCategory: getCategoriesFun(state),
  banners: getBannersFun(state),
  settings: getSettingsFun(state),
  products: getproductsArrayFun(state),
  appInProduction: getAppinProFun(state),
  hotProducts: getHotProductsArrayFun(state),

  topsellerProducts: gettopsellerProductsArrayFun(state),
  featuredProducts: getfeaturedProductsArrayFun(state),
  onSaleProducts: getonSaleProductsArrayFun(state)
})

/// //////////////////////////////////////////
export default connect(mapStateToProps, mapDispatchToProps)(Newest)
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
    paddingBottom: 20,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center'
  },
  categoryTypeStyle: {
    padding: 10,
    alignSelf: 'center'
  },
  iconTextStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    alignSelf: 'center'
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  demoPanalContainer: {
    zIndex: 5,
    position: 'absolute',
    left: 20,
    bottom: 70,
    alignItems: 'center',
    height: 55,
    width: 55,
    borderRadius: 55 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 10
  },
  demoPanal: {
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    fontSize: 22
  },
  fabStyle: {
    zIndex: 5,
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: 25,
    marginBottom: 70
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16
  },
  singleBanner: {
    width: WIDTH * 0.95,
    height: 130,
    marginTop: 0,
    marginBottom: 5,
    alignSelf: 'center'
  },
  noProductView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
    alignSelf: 'center'
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderCardContainer: {
    flexDirection: 'row',
    width: WIDTH,
    justifyContent: 'space-between',
    padding: 10
  },
  rowData: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  totalPriceView: {
    width: WIDTH,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12
  },
  policyView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 38,
    paddingBottom: 38,
    width: WIDTH * 0.7
  },
  tabInnerContainer: {
    justifyContent: 'center', alignItems: 'center'
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 1
  },
  validationText: {
    marginTop: 5,
    color: 'red',
    fontSize: appTextStyle.mediumSize,
    alignSelf: 'center'
  },
  googleView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabContainer: {
    justifyContent: 'space-around',
    width: '100%',
    flexDirection: 'row',
    marginVertical: 18
  },
  tabText: {
    // borderBottomWidth: 2,
    paddingBottom: 3,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 2,
    alignItems: 'center',
    justifyContent: 'center'

  },
  containerTextinput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1
  },
  commentAvatar: {
    height: 45,
    width: 45,
    borderRadius: appTextStyle.customRadius - 13,
    overflow: 'hidden'
  },
  socialIcon: {
    color: '#ffffff'
  },
  textInputStyle: {
    height: 38,
    width: WIDTH * 0.9,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 6,
    fontSize: appTextStyle.mediumSize + 1
  },
  signBtnView: {
    marginTop: 8,
    alignItems: 'center',
    height: 38,
    width: WIDTH * 0.9,
    justifyContent: 'center',
    borderRadius: appTextStyle.customRadius - 15
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  screenInnerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  socialLoginRow: {
    flexDirection: 'row',
    width: WIDTH,
    justifyContent: 'space-evenly',
    marginBottom: 5
  },
  textInputIcon: {
    paddingHorizontal: 10,
    paddingLeft: 29,
    marginBottom: Platform.OS === 'android' ? 5 : 0
  },
  containerDevi: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%',
    marginBottom: '10%',
    width: '60%',
    alignSelf: 'center'
  },
  googleIcon: {
    color: '#dd4b39',
    fontSize: 40
  },
  forgotView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  forgotRow: {
    justifyContent: 'space-between',
    width: WIDTH,
    padding: Platform.OS === 'android' ? 16 : 19,
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backIconView: {
    padding: 10,
    alignSelf: 'flex-start'
  },
  backIconStyle: {
    alignSelf: 'flex-start'
  },
  signUpView: {
    marginTop: 18,
    alignItems: 'center',
    height: 38,
    borderRadius: appTextStyle.customRadius - 15,
    justifyContent: 'center'
  },
  childContainerView: {
    flex: 1,
    height: 1
  },
  deviderText: {
    marginHorizontal: 12,
    textAlign: 'center'
  }
})
