/* eslint-disable no-useless-escape */
import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  FlatList,
  StyleSheet,
  RefreshControl
} from 'react-native'
import { createSelector } from 'reselect'
import { UIActivityIndicator } from 'react-native-indicators'
import { getUrl, getHttp } from '../common/WooComFetch'
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import Ionicons from 'react-native-vector-icons/Ionicons'
import themeStyle, { appTextStyle } from '../common/Theme.style'
import OrderCard from '../common/orderCard'
const WIDTH = Dimensions.get('window').width
class Login extends Component {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      headerTitleAlign: 'center',
      headerTintColor: iconColor,
      headerStyle: {
        backgroundColor: colorProps
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 2
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      gestureEnabled: false
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Order,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
    this.getOrders()
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      spinnerTemp: false,
      selectedTab: this.props.navigation.state.params.selectedTab,
      /// ////
      ordersPendingArray: [],
      ordersDeliveredArray: [],
      ordersCancelledArray: [],
      indicatorValue: true,
      isRefreshing: false,
      arrayLength: 0,
      page: 1,
      callStart: true

    }
    this.toast = null
    this.onEndReachedCalledDuringMomentum = false
  }

  getOrders = async () => {
    if (Object.keys(this.props.userData).length > 0) {
      this.setState({ temp: true })
      let url = 'customer/order'
      url += '?limit=' + 10
      url += '&orderDetail=1'
      url += '&productDetail=1'
      url += '&language_id=' + this.props.settings.language_id
      url += '&currency=' + this.props.settings.currency_id
      url += '&page=' + this.state.page

      const json = await getHttp(getUrl() + url, {})
      if (json.status === 'success') {
        if (json.data.status === 'Success') {
          if (json.data.data.length > 0) {
            if (this.state.isRefreshing) {
              this.state.ordersPendingArray = []
              this.state.ordersDeliveredArray = []
              this.state.ordersCancelledArray = []
            }
            this.state.arrayLength = this.state.arrayLength + json.data.data.length
            json.data.data.forEach(element => {
              if (element.order_status.toLocaleLowerCase() === 'pending') { this.state.ordersPendingArray.push(element) }
              if (element.order_status.toLocaleLowerCase() === 'delivered') { this.state.ordersDeliveredArray.push(element) }
              if (element.order_status.toLocaleLowerCase() === 'cancelled') { this.state.ordersCancelledArray.push(element) }
            })
            this.setState({
              indicatorValue: false,
              isRefreshing: false,
              arrayLength: this.state.arrayLength,
              ordersPendingArray: this.state.ordersPendingArray,
              ordersDeliveredArray: this.state.ordersDeliveredArray,
              ordersCancelledArray: this.state.ordersCancelledArray,
              callStart: true
            })
          } else {
            this.setState({
              indicatorValue: false,
              callStart: false,
              isRefreshing: false,
              arrayLength: 0
            })
          }
        } else {
          this.toast.show(json.data.message)
          this.state.arrayLength = 0
        }
      } else {
        this.toast.show(json.data.data.message)
        this.state.arrayLength = 0
      }
    } else {
      this.setState({
        indicatorValue: false,
        isRefreshing: false,
        arrayLength: this.state.arrayLength,
        callStart: true
      })
      this.toast.show('Please login or create an account for free')
    }
  }

  onRefreshTemp () {
    this.setState({
      isRefreshing: true,
      page: 1
    }, () => {
      this.getOrders()
    })
  }

  onEndReached = () => {
    this.handleLoadMore()
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
      {!this.state.callStart &&
        this.state.arrayLength > 9 ? (
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

  handleLoadMore () {
    if (this.state.arrayLength > 9 &&
      this.state.callStart) {
      this.state.page = this.state.page + 1
      this.state.fabB = this.state.arrayLength > 9
      this.state.callStart = false
      this.getOrders()
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

  getOrderTotalPrice = (o) => {
    const priceFixed = parseFloat(o.order_price.toString()).toFixed(o.currency.decimal_place)
    return priceFixed + o.currency.code
  }

  formatDate = (date) => {
    // var d = new Date(date)
    // return d.toDateString()
    return date
  }

  card = (item, key) => (
    <TouchableOpacity
      key={key}
      style={{
        borderBottomWidth: 5,
        borderColor: this.props.themeStyle.secondryBackgroundColor,
        paddingBottom: 12
      }} onPress={() => {
        this.props.navigation.navigate('OrderDetail', {
          id: item.order_id
        })
      }}>
      <View style={styles.orderCardContainer}>
        <View>
          <Text style={{
            fontSize: appTextStyle.largeSize,
            color: this.props.themeStyle.textColor,
            fontFamily: appTextStyle.fontFamily
          }}>{this.props.language.Orderid + ': ' + item.order_id}</Text>
          <Text style={{
            fontSize: appTextStyle.mediumSize,
            color: 'gray',
            paddingVertical: 3,
            fontFamily: appTextStyle.fontFamily
          }}>{this.props.language.PlacedOn + ' ' +
            this.formatDate(item.order_date)
            }</Text>
        </View>
        <View style={styles.rowData}>
          <Text style={{
            fontSize: appTextStyle.smallSize,
            color: this.props.themeStyle.textColor,
            fontFamily: appTextStyle.fontFamily
          }}>
            {this.props.language.ViewDetails}
          </Text>
          <Ionicons
            name={!I18nManager.isRTL
              ? 'chevron-forward-outline'
              : 'chevron-back-outline'}
            style={[{
              color: this.props.themeStyle.textColor,
              fontSize: appTextStyle.largeSize
            }]}
          />
        </View>

      </View>
      {
        item.order_detail.map((item2, key2) => (
          <OrderCard
            key={key2}
            indexValue={key2}
            th={this}
            language={this.props.language}
            data={item2.product}
            item2={item2}
            themeStyle={this.props.themeStyle}
            sessionId={this.props.sessionId}
            settings={this.props.settings}
            quantity={item2.product_qty}
          />
        ))}

      <View style={styles.totalPriceView}>
        <Text style={{
          fontSize: appTextStyle.largeSize,
          color: this.props.themeStyle.textColor,
          paddingHorizontal: 1,
          fontFamily: appTextStyle.fontFamily
        }}>
          {this.props.language.itemsTotal + ': '}</Text>
        <Text style={{
          fontSize: appTextStyle.mediumSize,
          color: 'gray',
          paddingHorizontal: 8,
          fontFamily: appTextStyle.fontFamily
        }}>{this.getOrderTotalPrice(item)}</Text>
      </View>
    </TouchableOpacity>
  )

  render () {
    return (
      <FlatList
        data={['']}
        extraData={this.state}
        listKey={'products'}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={() => this.renderFooter()}
        onEndReachedThreshold={0.1}
        style={{ backgroundColor: this.props.themeStyle.secondryBackgroundColor }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefreshTemp.bind(this)}
          />
        }
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
        onEndReached={this.onEndReached}
        renderItem={item => (
          <View>
            <Toast
              ref={ref => { this.toast = ref }}
              style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
              position='top'
              positionValue={400}
              fadeOutDuration={7000}
              textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
            />
            <View
              style={[styles.container, {
                backgroundColor: this.props.themeStyle.secondryBackgroundColor
              }]}>

              <Spinner
                visible={this.state.spinnerTemp}
                textStyle={{
                  backgroundColor: themeStyle.loadingIndicatorColor,
                  color: themeStyle.loadingIndicatorColor
                }}
              />

              <View style={[styles.tabContainer]}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ selectedTab: '1' })
                  }}
                  style={[styles.tabText, {
                    backgroundColor: this.state.selectedTab === '1' ? this.props.themeStyle.primary : this.props.themeStyle.primaryBackgroundColor
                  }]}>
                  <Text style={{
                    fontSize: appTextStyle.largeSize,
                    paddingVertical: 6,
                    fontFamily: appTextStyle.fontFamily,
                    color: this.state.selectedTab === '1' ? this.props.themeStyle.textTintColor : this.props.themeStyle.textColor
                  }}>{this.props.language.InProgress}</Text>
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
                    paddingVertical: 6,
                    fontFamily: appTextStyle.fontFamily,
                    color: this.state.selectedTab === '2' ? this.props.themeStyle.textTintColor : this.props.themeStyle.textColor
                  }}>{this.props.language.Delivered}</Text>
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
                  }}>{this.props.language.Reviews}</Text>
                </TouchableOpacity>
              </View>

              {this.state.indicatorValue
                ? <View style={{
                  paddingVertical: 10,
                  marginBottom: 40
                }}>
                  <UIActivityIndicator
                    size={27}
                    count={12}
                    color={this.props.themeStyle.primary}
                  />
                </View>
                : null}
              <View
                style={styles.screenContainer}>
                {this.state.selectedTab === '2'
                  ? <View style={styles.screenInnerContainer}>
                    {this.state.ordersDeliveredArray.length === 0 && !this.state.indicatorValue
                      ? <Text style={{
                        fontSize: appTextStyle.largeSize + 2,
                        color: this.props.themeStyle.textColor,
                        paddingVertical: 10,
                        fontFamily: appTextStyle.fontFamily
                      }}>
                        {this.props.language['No Data Found']}
                      </Text> : null}
                    {this.state.ordersDeliveredArray.map((item, key) => (
                      this.card(item, key)
                    ))}
                  </View>
                  : this.state.selectedTab === '1'
                    ? <View style={styles.tabInnerContainer}>
                      {this.state.ordersPendingArray.length === 0 && !this.state.indicatorValue
                        ? <Text style={{
                          fontSize: appTextStyle.largeSize + 2,
                          color: this.props.themeStyle.textColor,
                          paddingVertical: 10,
                          fontFamily: appTextStyle.fontFamily
                        }}>
                          {this.props.language['No Data Found']}
                        </Text> : null}
                      {this.state.ordersPendingArray.map((item, key) => (
                        this.card(item, key)
                      ))}
                    </View>
                    : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      {this.state.ordersCancelledArray.length === 0 && !this.state.indicatorValue
                        ? <Text style={{
                          fontSize: appTextStyle.largeSize + 2,
                          color: this.props.themeStyle.textColor,
                          paddingVertical: 10,
                          fontFamily: appTextStyle.fontFamily
                        }}>
                          {this.props.language['No Data Found']}
                        </Text> : null}
                      {this.state.ordersCancelledArray.map((item, key) => (
                        this.card(item, key)
                      ))}
                    </View>}

              </View>
            </View>
          </View>
        )}
      />
    )
  }
}

const getTheme = (state) => state.appConfig.themeStyle
const getSessionId = (state) => state.userData.sessionId
const getUserData = (state) => state.userData.user
const getSettings = (state) => state.settingsCall.settings

const getSessionIdFun = createSelector(
  [getSessionId],
  (getSessionId) => {
    return getSessionId
  }
)
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
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
  tabInnerContainer: {
    justifyContent: 'center', alignItems: 'center'
  },
  tabContainer: {
    justifyContent: 'space-around',
    width: '100%',
    flexDirection: 'row',
    marginVertical: 8
  },
  tabText: {
    paddingBottom: 3,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 2,
    alignItems: 'center',
    justifyContent: 'center'
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
  }
})
export default connect(mapStateToProps, null)(Login)
