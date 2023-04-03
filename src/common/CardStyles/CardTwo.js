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
      borderRadius: appTextStyle.customRadius - 7
    }]}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={[styles.innerView, {
        backgroundColor: props.backgroundColor
      }]}>
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
          borderRadius: appTextStyle.customRadius - 7
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderRadius: appTextStyle.customRadius - 7
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
                  : 'rgb(236, 236, 236)',
              borderRadius: appTextStyle.customRadius - 7,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
            source={{ uri: getThumbnailImage() + props.objectArray.product_gallary.gallary_name }}>
          </ImageLoad>
          {props.objectArray.product_discount_price !== 0
            ? <View style={{ right: 7, position: 'absolute', top: 7 }}>
              <TouchableOpacity

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
          {props.objectArray.product_discount_price !== 0 ? (
            <View
              style={[styles.tagsView, {
                backgroundColor: props.themeStyle.primary
              }]}>
              <Text style={{
                color: props.themeStyle.textTintColor,
                fontSize: appTextStyle.smallSize - 2,
                fontFamily: appTextStyle.fontFamily
              }}>
                {t.props.language['On Sale']}
              </Text>
            </View>
          ) : null}
          {props.objectArray.is_featured !== 0 ? (
            <View
              style={[styles.tagsView, {
                backgroundColor: props.themeStyle.primary,
                top: props.objectArray.product_discount_price !== 0 ? 32 : 10
              }]}>
              <Text style={{
                color: props.themeStyle.textTintColor,
                fontFamily: appTextStyle.fontFamily,
                fontSize: appTextStyle.smallSize - 2
              }}>
                {t.props.language.Featured}
              </Text>
            </View>
          ) : null}

        </TouchableOpacity>

        <View>
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

            {props.objectArray.product_price !== undefined ? (
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
                <View style={{ flexDirection: 'row' }}>
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
        </View>
        {props.removeButton ? (
          <TouchableOpacity
            style={[styles.removeWishlistStyle, {
              shadowColor: props.themeStyle.textColor,
              width: btnWidth
            }]}
            onPress={() => t.removeWishlist(props, t)}>
            <View
              style={[styles.removeWishlistStyle2, {
                width: btnWidth,
                backgroundColor: props.backgroundColor
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
        ) : null}

        {t.props.recentViewedProducts && props.recent ? (
          <TouchableOpacity
            style={[styles.recentProductView, {
              shadowColor: props.themeStyle.textColor,
              width: btnWidth
            }]}
            onPress={() => t.removeRecent(props, t)}>
            <View
              style={[styles.removeRecentView, {
                width: btnWidth,
                backgroundColor: props.backgroundColor
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
    margin: 5
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
  removeWishlistStyle2: {
    padding: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 0
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
  tagsView: {
    zIndex: 6,
    padding: 4,
    paddingHorizontal: 5,
    borderRadius: appTextStyle.customRadius - 15,
    left: 8,
    top: 10,
    position: 'absolute'
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
  },
  removeRecentView: {
    padding: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 0
  },
  innerView: {
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    borderRadius: appTextStyle.customRadius - 7,
    elevation: 3
  }
})
