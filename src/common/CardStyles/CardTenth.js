import React from 'react'
import { View, TouchableOpacity, Text, Platform, I18nManager, StyleSheet } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { appTextStyle } from '../Theme.style'
import Timer from '../Timer'
import { Icon } from 'native-base'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import { getThumbnailImage } from '../WooComFetch'
export default CardOne = ({ props, widthPic, t, s, btnWidth }) => (
  <View
    style={[styles.container, {
      backgroundColor: props.backgroundColor,
      paddingBottom: 8,
      borderRadius: appTextStyle.customRadius - 11
    }]}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: appTextStyle.customRadius - 11
      }}>
      <View
        style={{
          backgroundColor: props.backgroundColor,
          borderRadius: appTextStyle.customRadius - 11,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderRadius: appTextStyle.customRadius - 11
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
              borderRadius: appTextStyle.customRadius - 11,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
            source={{ uri: getThumbnailImage() + props.objectArray.product_gallary.gallary_name }}>
          </ImageLoad>

          <View
            style={[styles.tagsView, {
              backgroundColor: props.themeStyle.primary,
              top: 10
            }]}>
            {props.objectArray.product_price !== undefined ? (
              <View style={{ flexDirection: 'row' }}>

                {props.objectArray.product_discount_price === 0
                  ? t.priceFun(
                    appTextStyle.mediumSize,
                    props.objectArray.product_price,
                    'none',
                    '#ffffff',
                    true
                  )
                  : null}
                <View style={{ flexDirection: 'row' }}>
                  {props.objectArray.product_discount_price !== 0
                    ? t.priceFun(
                      appTextStyle.mediumSize,
                      props.objectArray.product_discount_price,
                      'none',
                      '#ffffff',
                      true
                    )
                    : null}
                  {props.objectArray.product_discount_price !== 0
                    ? t.priceFun(
                      appTextStyle.mediumSize,
                      props.objectArray.product_price,
                      'line-through',
                      '#ffffff',
                      true
                    )
                    : null}
                </View>

              </View>
            ) : null
            }
          </View>

        </TouchableOpacity>

        <View style={{
          backgroundColor: props.backgroundColor
        }}>
          <View style={{
            right: 7,
            position: 'absolute',
            top: -12,
            zIndex: 12
          }}>
            {t.productIsInList(props.objectArray.product_id)
              ? (
                <TouchableOpacity
                  onPress={() => {
                    t.removeWishlist(props, t)
                  }}
                  style={[styles.wishlistView, {
                    borderColor: props.themeStyle.textTintColor,
                    backgroundColor: props.themeStyle.primary
                  }]}>
                  <Icon
                    style={{
                      color: props.themeStyle.textTintColor,
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
                    backgroundColor: props.themeStyle.primary,
                    borderColor: props.themeStyle.textTintColor

                  }]}>
                  <Ionicons
                    style={{
                      color: props.themeStyle.textTintColor,
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

          </View>
          {props.objectArray.product_type === 'simple'
            ? <TouchableOpacity
              style={{
                width: btnWidth * 0.9,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: props.themeStyle.primary,
                padding: 2,
                borderRadius: appTextStyle.customRadius
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
                  width: btnWidth * 0.9,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: props.themeStyle.primary,
                  padding: 2,
                  borderRadius: appTextStyle.customRadius

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
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 3
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
  tagsView: {
    zIndex: 6,
    padding: 2,
    paddingLeft: 5,
    paddingRight: 0,
    borderRadius: appTextStyle.customRadius - 15,
    left: 8,
    top: 10,
    position: 'absolute'
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
    padding: 2,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 3
  },
  heartIcon: {
    borderRadius: appTextStyle.customRadius - 4,
    padding: 2,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 3
  },
  titleText: {
    fontSize: appTextStyle.mediumSize,
    fontFamily: 'Roboto',
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
