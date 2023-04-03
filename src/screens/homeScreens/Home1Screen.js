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
  Linking,
  ScrollView
} from 'react-native'
import { createSelector } from 'reselect'
import {
  getProducts,
  CLEAR_PRODUCTS,
  getOneProduct,
  colorFun
} from '../../redux/actions/actions'
import Toast from 'react-native-easy-toast'

import { UIActivityIndicator } from 'react-native-indicators'
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
import CategoryHeading from '../../common/CategoryHeading'
import ProductItem from '../../common/ProductItem'
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
      selectedTab: '',
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
    console.log('\n', JSON.stringify(this.props.themeStyle, null, 2))
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

  // categoryHeading (text) {
  //   return (
  //     <Text
  //       style={[styles.categoryTypeStyle, {
  //         fontFamily: appTextStyle.fontFamily,
  //         fontSize: appTextStyle.largeSize + 3,
  //         color: this.props.themeStyle.textColor
  //       }]}>
  //       {text}
  //     </Text>

  //   )
  // }

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
        <Header searchIcon={true} menuIcon={true} cartIcon={true} navigation={this.props.navigation} name={this.props.settings.app_name} />
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
          ListHeaderComponent={
            <View style={styles.headerListStyle}>
              <View
                style={{
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor

                }}>

                <Banner
                  navigation={this.props.navigation}
                />

                <CategoryHeading
                  key={0}
                  text={this.props.language['SHOP BY CATEGORY']}
                />

                <ScrollView key={1} horizontal={true}>
                  {Array(10).fill(0).map((item, index) => {
                    return <View key={index + 100} style={{ paddingBottom: 10, paddingLeft: 5 }}>
                      <View style={{ width: 80, height: 80, justifyContent: 'center', borderWidth: 1, margin: 5 }}>
                        <Text style={{ alignItems: 'center', textAlign: 'center' }}>{index}</Text>
                      </View>
                      <Text style={{ alignItems: 'center', textAlign: 'center' }}>CATEGORY{index}</Text>
                    </View>
                  })}
                </ScrollView>

                <View key={2} style={{ width: '95%', height: 2, backgroundColor: 'black', alignSelf: 'center' }}></View>

                <CategoryHeading
                  key={3}
                  text={this.props.language['SHOP BY BRAND']}
                />

                <ScrollView key={4} horizontal={true}>
                  {Array(10).fill(0).map((item, index) => {
                    return <View key={index + 200} style={{ paddingBottom: 10, paddingLeft: 5 }}>
                      <View style={{ width: 80, height: 80, justifyContent: 'center', borderWidth: 1, margin: 5 }}>
                        <Text style={{ alignItems: 'center', textAlign: 'center' }}>{index}</Text>
                      </View>
                      <Text style={{ alignItems: 'center', textAlign: 'center' }}>BRAND{index}</Text>
                    </View>
                  })}
                </ScrollView>

                <View key={5} style={{ width: '95%', height: 2, backgroundColor: 'black', alignSelf: 'center' }}></View>

                <View key={6} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5 }}>
                  <View key={0} style={{ width: 80, height: 40, backgroundColor: 'red', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>Offer</Text>
                  </View>
                  <View key={1} style={{ width: 80, height: 40, backgroundColor: 'black', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>New Arrival</Text>
                  </View>
                  <View key={2} style={{ width: 80, height: 40, backgroundColor: 'orange', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>Best Seller</Text>
                  </View>
                  <View key={3} style={{ width: 80, height: 40, backgroundColor: 'dodgerblue', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>Most liked</Text>
                  </View>
                </View>

                <View key={7} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                  <Text key={0} style={{ color: 'black' }}>Offer</Text>
                  <Text key={1} style={{ color: 'black' }}>See All</Text>
                </View>
                <ScrollView key={8} horizontal={true}>
                  {Array(10).fill(0).map((item, index) => {
                    return <TouchableOpacity key={index + 300} style={{ paddingBottom: 30, paddingLeft: 5 }} onLongPress={() => this.props.navigation.navigate('ProductDetailScreen')}>
                      <ProductItem
                        navigation={this.props.navigation}
                        header={{ rate: 50, option1: 'Best Seller', option2: 'New Arrival' }}
                        imgLink={require('../../images/granite_pot.png')}
                        title="Saflon Granite Pot with steel lid"
                        priceOld={10.99}
                        priceCurrent={5.99}
                        favorite={false}
                        smallImageList={[
                          require('../../images/granite_pot.png'),
                          require('../../images/granite_pot.png')
                        ]}
                        time={{ days: 17, hrs: 17, mins: 17, seconds: 17 }}
                        onAddCart={() => this.handleAddCart()}
                      />
                    </TouchableOpacity>
                  })}
                </ScrollView>
                <View key={9} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                  <Text key={0} style={{ color: 'black' }}>Deal Of the Day</Text>
                  <Text key={1} style={{ color: 'black' }}>See All</Text>
                </View>
                <ScrollView key={10} horizontal={true}>
                  {Array(10).fill(0).map((item, index) => {
                    return <TouchableOpacity key={index + 400} style={{ paddingBottom: 30, paddingLeft: 5 }} onLongPress={() => this.props.navigation.navigate('ProductDetailScreen')}>
                      <ProductItem
                        navigation={this.props.navigation}
                        header={{ rate: 50, option1: 'Best Seller', option2: 'New Arrival' }}
                        imgLink={require('../../images/granite_pot.png')}
                        title='Saflon Granite Pot with steel lid'
                        priceOld={10.99}
                        priceCurrent={5.99}
                        favorite={false}
                        smallImageList={[
                          require('../../images/granite_pot.png'),
                          require('../../images/granite_pot.png')
                        ]}
                        time={{ days: 17, hrs: 17, mins: 17, seconds: 17 }}
                        onAddCart={() => this.handleAddCart()}
                      />
                    </TouchableOpacity>
                  })}
                </ScrollView>
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

const gettopsellerProductsArrayFun = createSelector(
  [gettopsellerProductsArray],
  (gettopsellerProductsArray) => {
    return gettopsellerProductsArray
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
  topsellerProducts: gettopsellerProductsArrayFun(state)

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
    padding: 110,
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
    bottom: 90,
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
    marginBottom: 60
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
    width: WIDTH,
    height: 160,
    marginTop: 0,
    marginBottom: 5
  },
  noProductView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
    alignSelf: 'center'
  }
})
