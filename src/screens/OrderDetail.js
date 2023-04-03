import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import {
  View,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { createSelector } from 'reselect'
import CardOrderDetail from '../common/CardOrderDetail'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Text } from 'native-base'
import { getUrl, getHttp } from '../common/WooComFetch'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
import { appTextStyle } from '../common/Theme.style'
const WIDTH = Dimensions.get('window').width

class orderScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      gestureEnabled: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      drawerLockMode: 'locked-closed',
      headerTitleAlign: 'center',
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
      headerForceInset: { top: 'never', vertical: 'never' }
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language['Order Detail'],
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
    this.getOrders()
  }

  constructor (props) {
    super(props)
    this.state = {
      order: {},
      spinnerTemp: true,
      orderTotal: 0
    }
    this.toast = null
  }
  /// //////////////

  getOrders = async () => {
    let url = 'customer/order/' + this.props.navigation.state.params.id
    url += '?orderDetail=1'
    url += '&productDetail=1'
    url += '&language_id=' + this.props.settings.language_id
    url += '&currency=' + this.props.settings.currency_id

    const json = await getHttp(getUrl() + url, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        let total = json.data.data.order_price
        if (json.data.data.shipping_cost !== null &&
      json.data.data.shipping_cost !== undefined) {
          total += json.data.data.shipping_cost
        }
        if (json.data.data.total_tax !== null &&
      json.data.data.total_tax !== undefined) {
          total += json.data.data.total_tax
        }
        this.setState({
          order: json.data.data,
          spinnerTemp: false,
          orderTotal: total
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

  //= ===========================================================================================
  // placing order
  singleRow2 = (text, value) => (
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
          {value}
        </Text>
      </View>
    </View>
  )

  singleRow (name, address, body, postcode) {
    return (
      <View
        style={[styles.cardView, {
          backgroundColor: this.props.themeStyle.primaryBackgroundColor,
          borderWidth: 1,
          borderColor: this.props.themeStyle.primary
        }]}>

        <FontAwesome
          name={'map-marker'}
          style={{
            color: this.props.themeStyle.iconPrimaryColor,
            fontSize: appTextStyle.largeSize + 22,
            paddingRight: 22
          }}
        />
        <View style={{ paddingHorizontal: 5 }}>

          <Text style={[{
            color: this.props.themeStyle.textColor,
            fontFamily: appTextStyle.fontFamily,
            fontSize: appTextStyle.largeSize
          }]}>
            {name}   </Text>
          <Text style={[{
            color: this.props.themeStyle.textColor,
            fontFamily: appTextStyle.fontFamily,
            fontSize: appTextStyle.largeSize,
            paddingVertical: 2
          }]}>
            {address}   </Text>
          <Text style={[{
            color: this.props.themeStyle.textColor,
            fontFamily: appTextStyle.fontFamily,
            fontSize: appTextStyle.largeSize
          }]}>
            {body}   </Text>
          <Text style={[{
            color: this.props.themeStyle.textColor,
            fontFamily: appTextStyle.fontFamily,
            fontSize: appTextStyle.largeSize,
            paddingVertical: 2
          }]}>
            {postcode}   </Text>
        </View>

      </View>
    )
  }

  spaceBetweenElement = (heading, text) => (
    <View
      style={{
        flexDirection: 'row',
        padding: 14,
        width: WIDTH,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <Text
        style={{
          color: this.props.themeStyle.textColor,
          fontFamily: appTextStyle.fontFamily,
          fontSize: appTextStyle.largeSize + 2,
          paddingTop: 1
        }}>
        {heading}
      </Text>

      <Text
        style={{
          color: 'red',
          fontFamily: appTextStyle.fontFamily,
          fontSize: appTextStyle.largeSize + 2,
          paddingTop: 1
        }}>
        {text}
      </Text>
    </View>
  )

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.themeStyle.secondryBackgroundColor }}>
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
            color: this.props.themeStyle.primary
          }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
            marginBottom: 30
          }}>

          {
            this.state.order.order_detail !== undefined
              ? this.state.order.order_detail.length > 0

                ? this.state.order.order_detail.map((data, key) => (
                  <CardOrderDetail
                    key={key}
                    indexValue={key}
                    th={this}
                    language={this.props.language}
                    data={data}
                    themeStyle={this.props.themeStyle}
                    settings={this.props.settings}
                  >

                  </CardOrderDetail>
                ))
                : null : null}

          <View style={{ marginTop: 4 }} />
          {this.state.order.delivery_first_name !== undefined
            ? this.singleRow(
              this.state.order.delivery_first_name + ' ' + this.state.order.delivery_last_name,
              this.state.order.delivery_street_aadress, this.state.order.delivery_city,
              this.state.order.delivery_postcode
            ) : null}

          {this.state.order.billing_first_name !== undefined
            ? this.singleRow(
              this.state.order.billing_first_name + ' ' + this.state.order.billing_last_name,
              this.state.order.billing_street_aadress,
              this.state.order.billing_city, this.state.order.billing_postcode
            ) : null}

          {this.state.order.order_price !== undefined
            ? <View style={[styles.viewContainer, {
              backgroundColor: this.props.themeStyle.primaryBackgroundColor,
              borderColor: this.props.themeStyle.primary
            }]}>

              {this.singleRow2(this.props.language.SubTotal, this.state.order.order_price.toFixed(Number(this.props.settings.currency_decimals)))}

              {

                this.state.order.shipping_cost !== undefined && this.state.order.shipping_cost !== null

                  ? this.singleRow2(this.props.language.EstimatedShiping, this.state.order.shipping_cost.toFixed(Number(this.props.settings.currency_decimals)))
                  : this.singleRow2(this.props.language.EstimatedShiping, '0.00')}

              {
                this.state.order.total_tax !== undefined && this.state.order.total_tax !== null
                  ? this.singleRow2(this.props.language.Tax, this.state.order.total_tax.toFixed(Number(this.props.settings.currency_decimals)))
                  : this.singleRow2(this.props.language.Tax, '0.00')}
              <View style={{ marginVertical: 5 }} />
              {this.singleRow2(this.props.language.OrderTotal, this.state.orderTotal.toFixed(Number(this.props.settings.currency_decimals)))}
            </View>
            : null}

          {this.state.order.latlong !== null && this.state.order.latlong !== undefined

            ? <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('TrackLocationScreen', {
                  data: this.state.order
                })
              }}
              style={{
                width: WIDTH * 0.95,
                borderColor: '#fff',
                alignItems: 'center',
                height: 42,
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 8
              }}>
              <Text
                style={{
                  color: this.props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontWeight: '500',
                  position: 'absolute'
                }}>
                {this.props.language['TRACK ORDER']}
              </Text>
            </TouchableOpacity>
            : null}
        </ScrollView>
      </View>
    )
  }
}

const getLanguage = (state) => state.appConfig.languageJson
const getSettings = (state) => state.settingsCall.settings
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
const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  settings: getSettingsFun(state),
  language: getLanguageFun(state)
})
const styles = StyleSheet.create({
  cardView: {
    marginBottom: 5,
    width: WIDTH * 0.92,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 8
  },
  viewContainer: {
    paddingVertical: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderRadius: 12,
    alignSelf: 'center',
    width: WIDTH * 0.92,
    marginTop: 8
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    paddingVertical: 4
  },
  priceText: {
    paddingRight: 6,
    alignSelf: 'flex-start',
    fontFamily: appTextStyle.fontFamily,
    textAlign: 'left'
  }
})
export default connect(mapStateToProps, null)(orderScreen)
