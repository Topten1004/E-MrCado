import React from 'react'
import { View, TouchableOpacity, Text, Platform, I18nManager, StyleSheet } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { appTextStyle } from '../Theme.style'
import Timer from '../Timer'

import { getThumbnailImage } from '../WooComFetch'
export default CardOne = ({ props, widthPic, t, s, btnWidth }) => (
  <View
    style={[styles.container, {
      backgroundColor: props.backgroundColor,
      borderColor: props.themeStyle.primaryLight
    }]}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: props.backgroundColor
      }}>
      <View
        style={{
          backgroundColor: props.backgroundColor
        }}>
        <TouchableOpacity
          style={{
            flex: 2
          }}
          onPress={() =>
            props.navigation.push('ProductDetails', {
              objectArray: props.objectArray //
            })
          }>
          <ImageLoad
            key={props.objectArray.id}
            style={{
              height: widthPic,
              width: widthPic,
              backgroundColor:
                t.props.card_style === 12
                  ? '#000'
                  : 'rgb(236, 236, 236)'
            }}
            source={{ uri: getThumbnailImage() + props.objectArray.product_gallary.gallary_name }}>
          </ImageLoad>
          {props.objectArray.product_discount_price !== 0
            ? <View style={{ left: 7, position: 'absolute', top: 7 }}>
              <TouchableOpacity
                onPress={() => {
                  if (t.newMethod3(props, t) !== 1) {
                    t.addWishlist(props, t)
                  }
                }}
                style={[styles.discountView, {
                  backgroundColor: props.themeStyle.primary
                }]}>
                <Text style={{
                  fontSize: appTextStyle.smallSize - 4,
                  fontWeight: 'bold',
                  fontFamily: appTextStyle.fontFamily,
                  color: props.themeStyle.textTintColor
                }}>
                  {t.productDiscount(props)}
                </Text>

              </TouchableOpacity>

            </View>
            : null}

        </TouchableOpacity>

        <Text
          style={[styles.titleText, {
            color: props.themeStyle.cardTextColor,
            width: widthPic / 1
          }]}
          numberOfLines={2}>
          {props.objectArray.detail[0].title}
        </Text>
        <View
          style={[styles.priceView, {
            marginBottom: props.objectArray.flash_price === undefined ? 0 : 2
          }]}>

          { props.objectArray.product_price !== undefined ? (
            <View style={{ flexDirection: 'row' }}>

              {props.objectArray.product_discount_price === 0
                ? t.priceFun(
                  appTextStyle.mediumSize,
                  props.objectArray.product_price,
                  'none',
                  props.themeStyle.primary,
                  true
                )
                : null}
              <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                {props.objectArray.product_discount_price !== 0
                  ? t.priceFun(
                    appTextStyle.mediumSize,
                    props.objectArray.product_discount_price,
                    'none',
                    props.themeStyle.primary,
                    true
                  )
                  : null}
                {props.objectArray.product_discount_price !== 0
                  ? t.priceFun(
                    appTextStyle.mediumSize,
                    props.objectArray.product_price,
                    'line-through',
                    props.themeStyle.textColor,
                    true
                  )
                  : null}
              </View>
            </View>
          ) : null
          }

        </View>
        {props.objectArray.product_type === 'simple'
          ? <TouchableOpacity
            style={{
              width: btnWidth,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: props.themeStyle.primary,
              padding: 6,
              marginTop: 7
            }}
            onPress={() => {
              if (t.newMethod3(props, t) !== 1) {
                t.newMethod6(props, t)
              }
            }}>
            <Text
              style={{
                color: props.themeStyle.textTintColor,
                fontSize: appTextStyle.mediumSize + 1,
                fontWeight: '500',
                fontFamily: appTextStyle.fontFamily
              }}>
              {t.props.language['Add to Bag']}
            </Text>

          </TouchableOpacity>
          : props.objectArray.product_type === 'variable'
            ? <TouchableOpacity
              style={{
                width: btnWidth,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: props.themeStyle.primary,
                padding: 6,
                marginTop: 7

              }}
              onPress={() => {
                if (t.newMethod3(props, t) !== 1) {
                  props.navigation.push('ProductDetails', {
                    objectArray: props.objectArray //
                  })
                }
              }}>
              <Text
                style={{
                  color: props.themeStyle.textTintColor,
                  fontSize: appTextStyle.mediumSize + 1,
                  fontWeight: '500',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {t.props.language.Details}
              </Text>

            </TouchableOpacity> : null
        }

      </View>
    </View>
    {t.props.dataName === 'Flash' ? (
      <Timer
        props={t.props}
        widthPic={widthPic}
        t={t}
        text={null}
        objectArray={props.objectArray}
        s={s}
        btnWidth={btnWidth}></Timer>
    ) : null}
  </View>
)

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderWidth: 1
  },
  removeStyle: {
    position: 'absolute',
    bottom: 4,
    left: 5
  },
  priceView: {
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 0,
    padding: 5,
    paddingTop: 0,
    paddingBottom: 3
  },
  removeView: {
    alignItems: 'center',
    height: Platform.OS === 'android' ? 30 : 28,
    justifyContent: 'center'
  },
  removeBtn2: {
    position: 'absolute',
    bottom: 4,
    left: 5
  },
  removebtnView: {
    alignItems: 'center',
    height: Platform.OS === 'android' ? 30 : 28,
    justifyContent: 'center'
  },
  discountView: {
    borderRadius: appTextStyle.customRadius - 4,
    padding: 2,
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wishlistView: {
    borderRadius: appTextStyle.customRadius - 4,
    borderWidth: 0.8,
    padding: 2,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heartIcon: {
    borderRadius: appTextStyle.customRadius - 4,
    borderWidth: 0.8,
    padding: 2,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: appTextStyle.mediumSize,
    fontFamily: appTextStyle.fontFamily,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    margin: 0,
    padding: 5,
    paddingTop: 3,
    paddingLeft: 5,
    paddingBottom: 8,
    marginBottom: 0,
    fontWeight: '400'
  },
  removeWishlistStyle: {
    margin: 5,
    marginBottom: 3,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  recentProductView: {
    margin: 5,
    marginBottom: 3,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
})
