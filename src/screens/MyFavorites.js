import React, { PureComponent } from 'react'
import {
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  RefreshControl,
  Platform,
  StyleSheet
} from 'react-native'
import Header from '../common/HeaderCustom'
import { createSelector } from 'reselect'
import {
  removeWishlistProductId,
  colorFun
} from '../redux/actions/actions'
import { NavigationEvents } from 'react-navigation'
import { getUrl, getHttp } from '../common/WooComFetch'
import { UIActivityIndicator } from 'react-native-indicators'
import CardTem from '../common/CardTemplate'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import themeStyle, { appTextStyle } from '../common/Theme.style'
import Toast from 'react-native-easy-toast'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

class wishListScreen extends PureComponent {
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language['My Wish List'],
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  componentDidUpdate () {
    if (this.props.wishlistArray !== '') { // for remove element
      const filteredArray = this.state.wishListProducts.filter(item =>

        item.product_id !== this.props.wishlistArray
      )
      this.props.removeWishlistProductId(this)
      if (this.state.wishListProducts.length !== filteredArray.length) {
        this.setState({ wishListProducts: filteredArray }, () => {
        })
      }
    }

    if (this.props.wishlist.length === 0 && this.state.wishListProducts.length > 0) {
      this.setState({ wishListProducts: [] }) // remove all data when logout
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      wishListProducts: [],
      page: 1,
      loading: true,
      refreshing: false,
      isRefreshing: false, // for pull to refresh
      temp: false,
      pageNumber: 1,
      fabB: false,
      globalWishlist: [],
      productColorCounter: 0
    }
    this.toast = null
  }

  onRefreshTemp () {
    this.setState({ isRefreshing: true, page: 1, refreshing: false }, () => {
      this.getProducts()
    }
    )
  }

  temp = () => {
    if (this.state.wishListProducts.length > 9) {
      this.setState(
        {
          refreshing:
          this.state.wishListProducts.length > 9,
          page: this.state.page + 1,
          fabB: this.state.wishListProducts.length > 9
        },
        () => {
          this.getProducts()
        }
      )
    }
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

  renderFooter = () => (
    <View
      style={{
        marginBottom: 30,
        marginTop: 10,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center'
      }}>
      {this.state.refreshing &&
        this.state.wishListProducts.length !== 0 ? (
          <View style={{ height: 20, marginTop: 30 }}>
            <UIActivityIndicator
              size={27}
              count={12}
              color={this.props.themeStyle.primary}
            />
          </View>
        ) : null}
    </View>
  )

  /// //////////////////////////////////////////
  getProducts = async () => {
    if (Object.keys(this.props.userData).length > 0) {
      this.setState({ temp: true })
      let url = 'wishlist'
      url += '?limit=' + 10
      url += '&getCategory=1'
      url += '&products=1'
      url += '&getDetail=1'
      url += '&language_id=' + this.props.settings.language_id
      url += '&currency=' + this.props.settings.currency_id
      url += '&stock=1'
      url += '&page=' + this.state.page

      const json = await getHttp(getUrl() + url, {})

      if (json.status === 'success') {
        if (json.data.status === 'Success') {
          if (this.state.isRefreshing) {
            this.state.wishListProducts = []
          }
          for (const value of json.data.data) {
            if (!this.state.wishListProducts.includes(value.products)) { this.state.wishListProducts.push(value.products) }
          }
        } else {
          this.toast.show(json.data.message)
        }
      } else {
        this.toast.show(json.data.data.message)
      }
    }
    this.setState({
      temp: false,
      isRefreshing: false,
      refreshing: false
    })
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>

        <Header menuIcon={true} cartIcon={true} navigation={this.props.navigation} backIcon={true} name={this.props.language['My Wish List']} />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <NavigationEvents
          onDidFocus={() => {
            this.setState({ wishListProducts: [], page: 1 }, () => {
              this.getProducts()
            })
          }}
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
        ) : null
        }
        <FlatList
          data={['']}
          extraData={this.state}
          showsVerticalScrollIndicator={false}
          listKey={'products'}
          contentContainerStyle={{
            width: WIDTH
          }}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => this.renderFooter()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefreshTemp.bind(this)}
            />
          }
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
          onEndReached={() => {
          }}
          ref={ref => {
            this.flatListRef = ref
          }}
          renderItem={item =>

            this.state.wishListProducts <= 0 &&
              this.state.temp &&
              !this.state.isRefreshing ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignContent: 'center',
                    alignItems: 'center'
                  }}>
                  <UIActivityIndicator
                    size={27}
                    color={this.props.themeStyle.primary}
                  />
                </View>
              ) : this.state.wishListProducts.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                    paddingTop: 6,
                    width: WIDTH,
                    marginTop:
                    this.state.wishListProducts.length === 0
                      ? HEIGHT * 0.3
                      : 0
                  }}>

                  <Icon name={'basket'} style={{ color: 'gray', fontSize: 80 }} />
                  <View>
                    <Text style={{
                      fontSize: appTextStyle.largeSize + 2,
                      color: this.props.themeStyle.textColor,
                      fontFamily: appTextStyle.fontFamily
                    }}>
                      {
                        this.props.language[
                          'Your wish List is empty'
                        ]
                      }
                    </Text>
                    <Text
                      style={{
                        fontSize: appTextStyle.mediumSize,
                        alignSelf: 'center',
                        color: this.props.themeStyle.textColor,
                        fontFamily: appTextStyle.fontFamily
                      }}>
                      {
                        this.props.language[
                          'Continue Shopping'
                        ]
                      }
                    </Text>
                    <TouchableOpacity
                      style={{
                        paddingTop: 5,
                        width: 90,
                        alignSelf: 'center',
                        borderRadius: appTextStyle.customRadius
                      }}
                      onPress={() =>
                        this.props.navigation.navigate('NewestScreen', {
                          id: undefined,
                          name: undefined,
                          sortOrder: 'Newest'
                        })
                      }>
                      <View
                        style={{
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
                            fontSize: appTextStyle.mediumSize,
                            fontWeight: '500',
                            color: this.props.themeStyle.textTintColor,
                            fontFamily: appTextStyle.fontFamily
                          }}>
                          {this.props.language.Explore}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{
                    flex: 1,
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor
                  }}
                  contentContainerStyle={{
                    backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                    marginTop: 5
                  }}
                  columnWrapperStyle={{
                    alignContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: 0,
                    paddingLeft:
                    WIDTH >= 375
                      ? WIDTH * 0.009
                      : WIDTH >= 360 && WIDTH <= 75
                        ? WIDTH * 0.008
                        : WIDTH * 0.007,
                    paddingBottom: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    marginTop: 0
                  }}
                  ref={ref => {
                    this.flatListRef = ref
                  }}
                  data={this.state.wishListProducts}
                  horizontal={false}
                  extraData={this.state}
                  numColumns={2}
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false
                  }}
                  onEndReached={() => {
                    if (!this.onEndReachedCalledDuringMomentum) {
                      this.temp()
                      this.onEndReachedCalledDuringMomentum = true
                    }
                  }}
                  onEndReachedThreshold={0.5}
                  onScroll={this.handleScroll.bind(this)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={item => (
                    <CardTem
                      backgroundColor={colorFun(this, item.index)}
                      objectArray={item.item}
                      index={item.index}
                      rows={false}
                      cardStyle={this.props.cardStyle}
                      width={
                        this.props.vertical
                          ? this.props.width
                          : WIDTH * themeStyle.twoRowCardWIdth
                      }
                    />
                  )}
                />
              )
          }
        />

        {/* /> */}
      </View>
    )
  }
}
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getSettings = (state) => state.settingsCall.settings
const removeProductId = (state) => state.wishlistData.removeProductId
const wishlistArray = (state) => state.wishlistData.wishlistArray
const getUserData = (state) => state.userData.user

const wishlistArrayFun = createSelector(
  [wishlistArray],
  (wishlistArray) => {
    return wishlistArray
  }
)
const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)

const removeProductIdFun = createSelector(
  [removeProductId],
  (removeProductId) => {
    return removeProductId
  }
)
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
  language: getLanguageFun(state),
  settings: getSettingsFun(state),
  wishlistArray: removeProductIdFun(state),
  userData: getUserDataFun(state),
  wishlist: wishlistArrayFun(state)

})
const styles = StyleSheet.create({
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
  }
})

const mapDispatchToProps = dispatch => ({
  removeWishlistProductId: (th) => dispatch(removeWishlistProductId(th))
})
export default connect(mapStateToProps, mapDispatchToProps)(wishListScreen)
