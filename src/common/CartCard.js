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
  deleteProductFromCartCall, th, keyValue
}) => (
  <View
    key={keyValue}
    style={[styles.cartCardContainer, {
      backgroundColor: themeStyle.secondryBackgroundColor
    }]}>
    <View style={styles.cartCardView}>
      <ImageLoad
        key={1}
        style={styles.productsImage}
        source={{ uri: getLargeImage() + data.product_gallary.gallary_name }}
      />

      <View>
        <Text style={[styles.priceText, {
          color: themeStyle.textColor,
          fontSize: appTextStyle.largeSize,
          marginLeft: -4,
          fontWeight: 'bold',
          fontFamily: appTextStyle.fontFamily
        }]}>
          {data.product_detail[0].title}
        </Text>
        {data.discount_price > 0 &&
          data.discount_price !== undefined

          ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <Text style={[styles.priceText, {
              color: themeStyle.primary,
              fontSize: appTextStyle.largeSize,
              fontFamily: appTextStyle.fontFamily
            }]}>
              {settings.currency_symbol + ' ' + data.discount_price}
            </Text>
            <Text style={[styles.priceText, {
              color: themeStyle.iconPrimaryColor,
              fontSize: appTextStyle.mediumSize,
              textDecorationLine: 'line-through',
              fontFamily: appTextStyle.fontFamily
            }]}>
              {settings.currency_symbol + ' ' + data.price}
            </Text>
          </View>
          : data.discount_price === 0 ||
            data.discount_price === undefined
            ? <Text style={[styles.priceText, {
              color: themeStyle.primary,
              fontSize: appTextStyle.mediumSize,
              fontFamily: appTextStyle.fontFamily
            }]}>
              {settings.currency_symbol + ' ' + data.price}
            </Text> : <View />
        }

        <View style={{ marginTop: 5 }}>

          {data.product_combination !== undefined
            ? data.product_combination.map((att, index) => (

              <Text style={[styles.modalAttrKey, {
                color: themeStyle.iconPrimaryColor,
                fontSize: appTextStyle.mediumSize,
                fontFamily: appTextStyle.fontFamily
              }]}>
                {data.product_combination.length === (index + 1)
                  ? att.variation.detail[0].name + ' '
                  : att.variation.detail[0].name + ', '}
              </Text>

            )) : null}

        </View>

        <Text style={[{
          color: themeStyle.textColor,
          fontSize: appTextStyle.mediumSize,
          fontFamily: appTextStyle.fontFamily
        }]}>
          {language.Qty + data.qty}
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
    width: 65,
    overflow: 'hidden',
    marginRight: 10,
    borderRadius: appTextStyle.customRadius - 7
  },
  priceText: {
    paddingRight: 5
  }
})
