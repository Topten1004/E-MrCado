import React from 'react'
import { View, TouchableOpacity, Text, Platform, I18nManager, StyleSheet } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { Icon } from 'native-base'
import Ionicons from 'react-native-vector-icons/FontAwesome'
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
      {t.newMethod3(props, t) === 1 ? (
        t.props.recentViewedProducts && props.recent ? (
          <TouchableOpacity
            style={[styles.removeStyle, {
              shadowColor: props.themeStyle.textColor,
              width: btnWidth
            }]}
            onPress={() => t.removeRecent(props, t)}>
            <View
              style={[styles.removeView, {
                backgroundColor: props.backgroundColor,
                width: btnWidth
              }]}>
              <Text
                style={{
                  color: props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontWeight: '500',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {t.props.language.Remove}
              </Text>
            </View>
          </TouchableOpacity>
        ) : props.removeButton ? (
          <TouchableOpacity
            style={[styles.removeBtn2, {
              width: btnWidth,
              shadowColor: props.themeStyle.textColor
            }]}
            onPress={() => t.removeWishlist(props, t)}>
            <View
              style={[styles.removebtnView, {
                backgroundColor: props.backgroundColor,
                width: btnWidth
              }]}>
              <Text
                style={{
                  color: props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontWeight: '500',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {t.props.language.Remove}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null
      ) : null}
      <View
        style={{
          backgroundColor: props.backgroundColor,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }}
          onPress={() =>
            props.navigation.push('ProductDetails', {
              objectArray: props.objectArray //
            })
          }>
          {props.objectArray.product_gallary !== null &&
            props.objectArray.product_gallary !== undefined
            ? <ImageLoad
              key={props.objectArray.id}
              style={{
                height: widthPic,
                width: widthPic,
                backgroundColor: props.backgroundColor,
                // t.props.card_style === 12
                //   ? '#000'
                //   : 'rgb(236, 236, 236)',
                borderRadius: 0
              }}
              source={{ uri: getThumbnailImage() + props.objectArray.product_gallary.gallary_name }}>
            </ImageLoad>
            : null }
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
          {
            <View style={{ right: 7, position: 'absolute', top: 7 }}>
              {t.productIsInList(props.objectArray.product_id)
                ? (
                  <TouchableOpacity
                    onPress={() => {
                      t.removeWishlist(props, t)
                    }}
                    style={[styles.wishlistView, {
                      borderColor: props.themeStyle.iconPrimaryColor,
                      backgroundColor: props.backgroundColor
                    }]}>
                    <Icon
                      style={{
                        color: props.themeStyle.iconPrimaryColor,
                        fontSize: appTextStyle.largeSize + 3,
                        marginTop: Platform.OS === 'ios' ? 2 : 1
                      }}
                      active
                      name='heart'
                      onPress={() => {
                        if (t.newMethod3(props, t) !== 1) {
                          t.removeWishlist(props, t)
                        }
                      }}
                    />
                  </TouchableOpacity>

                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      if (t.newMethod3(props, t) !== 1) {
                        t.addWishlist(props, t)
                      }
                    }}
                    style={[styles.heartIcon, {
                      backgroundColor: props.backgroundColor,
                      borderColor: props.themeStyle.iconPrimaryColor

                    }]}>
                    <Ionicons
                      style={{
                        color: props.themeStyle.iconPrimaryColor,
                        fontSize: appTextStyle.largeSize,
                        marginTop: Platform.OS === 'ios' ? 3 : 2
                      }}
                      active
                      name='heart-o'
                    />
                  </TouchableOpacity>

                )}
            </View>
            // ) : null
          }
        </TouchableOpacity>
        {/* {props.objectArray.detail !== undefined
          ?  */}
        <Text
          style={[styles.titleText, {
            color: props.themeStyle.cardTextColor,
            width: widthPic / 1,
            fontFamily: appTextStyle.fontFamily
          }]}
          numberOfLines={2}>
          {props.objectArray.detail[0].title}
        </Text>
        <View
          style={[styles.priceView, {
            marginBottom: props.objectArray.flash_price === undefined ? 0 : 2
          }]}>

          {props.objectArray.product_price !== undefined ? (
            <View style={{ flexDirection: 'row' }}>

              {props.objectArray.product_discount_price === 0
                ? t.priceFun(
                  appTextStyle.mediumSize,
                  props.objectArray.product_price,
                  'none',
                  props.themeStyle.cardTextColor,
                  true
                )
                : null}
              <View style={{ flexDirection: 'row' }}>
                {props.objectArray.product_discount_price !== 0
                  ? t.priceFun(
                    appTextStyle.mediumSize,
                    props.objectArray.product_discount_price,
                    'none',
                    props.themeStyle.cardTextColor,
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

        {props.removeButton ? (
          <TouchableOpacity
            style={[styles.removeWishlistStyle, {
              shadowColor: props.themeStyle.textColor,
              width: btnWidth
            }]}
            onPress={() => t.removeWishlist(props, t)}>
            <View
              style={{
                padding: 5,
                margin: 5,
                width: btnWidth,

                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 0,
                marginBottom: 0,
                backgroundColor: props.backgroundColor
              }}>
              <Text
                style={{
                  color: props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontWeight: '500',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {t.props.language.Remove}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {t.props.recentViewedProducts && props.recent ? (
          <TouchableOpacity
            style={[styles.recentProductView, {
              shadowColor: props.themeStyle.textColor,
              width: btnWidth
            }]}
            onPress={() => t.removeRecent(props, t)}>
            <View
              style={{
                padding: 5,
                margin: 5,
                width: btnWidth,

                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 0,
                marginBottom: 0,
                backgroundColor: props.backgroundColor
              }}>
              <Text
                style={{
                  color: props.themeStyle.textColor,
                  fontSize: appTextStyle.mediumSize,
                  fontWeight: '500',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {t.props.language.Remove}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
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
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 3,
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
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 3,
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
    alignSelf: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 3
  },
  recentProductView: {
    margin: 5,
    marginBottom: 3,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 3
  }
})
