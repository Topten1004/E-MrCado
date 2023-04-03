import React from 'react'
import {
  TouchableOpacity,
  View, StyleSheet, Text
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { getLargeImage } from '../common/WooComFetch'
import ImageLoad from '../common/RnImagePlaceH'
import { appTextStyle } from './Theme.style'

const cartCard = ({
  data, themeStyle, sessionId, settings, language,
  deleteProductFromCartCall, th, indexValue
}) => (
  <View
    key={indexValue}
    style={[styles.cartCardContainer, {
      backgroundColor: themeStyle.primaryBackgroundColor
    }]}>
    <View style={styles.cartCardView}>
      <ImageLoad
        key={indexValue + '1'}
        style={styles.productsImage}
        source={{ uri: getLargeImage() + data.product.product_gallary.gallary_name }}
      />

      <View>

        {data.product_discount !== null &&
          data.product_discount !== undefined

          ? <View style={{ flexDirection: 'row' }}>

            <Text style={[styles.priceText, {
              color: themeStyle.primary,
              fontSize: appTextStyle.largeSize,
              fontFamily: appTextStyle.fontFamily
            }]}>
              {settings.currency_symbol + ' ' + data.product_discount.toFixed(Number(settings.currency_decimals))}
            </Text>
            <Text style={[styles.priceText, {
              color: themeStyle.iconPrimaryColor,
              fontFamily: appTextStyle.fontFamily,
              fontSize: appTextStyle.largeSize,
              textDecorationLine: 'line-through'
            }]}>
              {settings.currency_symbol + ' ' + data.product_price.toFixed(Number(settings.currency_decimals))}
            </Text>
          </View>
          : data.product_discount === null ||
            data.product_discount === undefined
            ? <Text style={[styles.priceText, {
              color: themeStyle.primary,
              fontSize: appTextStyle.largeSize,
              fontFamily: appTextStyle.fontFamily
            }]}>
              {settings.currency_symbol + ' ' + data.product_price.toFixed(Number(settings.currency_decimals))}
            </Text> : <View />
        }
        <Text style={[styles.priceText, {
          color: themeStyle.textColor,
          fontSize: appTextStyle.largeSize,
          marginVertical: 5,
          fontFamily: appTextStyle.fontFamily
        }]}>
          {data.product.detail[0].title}
        </Text>

        <Text style={[{
          color: themeStyle.textColor,
          fontSize: appTextStyle.largeSize + 2,
          fontFamily: appTextStyle.fontFamily
        }]}>
          {language.Qty + data.product_qty}
        </Text>

      </View>

    </View>

    {deleteProductFromCartCall
      ? <TouchableOpacity onPress={() => {
        th.setState({ spinnerTemp: true }, () => {
          deleteProductFromCartCall(data.product_id,
            sessionId, data.product_combination_id,
            data.qty, th)
        })
      }}>
        <FontAwesome
          name={'trash'}
          style={{
            color: themeStyle.iconPrimaryColor,
            transform: [{ rotateY: '180deg' }],
            fontSize: appTextStyle.largeSize + 2
          }}
        />
      </TouchableOpacity>
      : null}
  </View>
)

/// //////////////////////////////////////////
export default cartCard

const styles = StyleSheet.create({

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
  productsImage: {
    height: 68,
    width: 75,
    overflow: 'hidden',
    marginRight: 10,
    borderRadius: appTextStyle.customRadius - 13
  }
})
