import React from 'react'
import {
  View, TouchableOpacity, Text, Platform, I18nManager, StyleSheet,
  ImageBackground
} from 'react-native'
import { appTextStyle } from '../Theme.style'
import Timer from '../Timer'
import { Icon } from 'native-base'
import FontAwesome from 'react-native-vector-icons/Ionicons'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import { getThumbnailImage } from '../WooComFetch'
export default CardOne = ({ props, widthPic, t, s, btnWidth }) => (
  <View
    style={[styles.container, {
      backgroundColor: props.backgroundColor,
      paddingBottom: props.objectArray.product_type === 'variable' ? 2 : 2,
      borderRadius: appTextStyle.customRadius - 8
    }]}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: appTextStyle.customRadius - 8
      }}>
      <View
        style={{
          backgroundColor: 'transparent',
          borderRadius: appTextStyle.customRadius - 8,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderRadius: appTextStyle.customRadius - 8
          }}
          onPress={() =>
            props.navigation.push('ProductDetails', {
              objectArray: props.objectArray //
            })
          }>
          <ImageBackground
            key={props.objectArray.id}
            borderRadius={appTextStyle.customRadius - 8}
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
            style={{
              height: widthPic,
              width: widthPic,
              backgroundColor:
              props.backgroundColor,
              borderRadius: appTextStyle.customRadius - 8,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
            source={{ uri: getThumbnailImage() + props.objectArray.product_gallary.gallary_name }}>
            {props.objectArray.product_discount_price !== 0
              ? <View style={{ padding: 8, left: 1 }}>
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
            <View style={{
              position: 'absolute',
              top: 8,
              zIndex: 12,
              flexDirection: 'row',
              borderRadius: appTextStyle.customRadius - 8,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              right: 8
            }}>

              {t.productIsInList(props.objectArray.product_id)
                ? (
                  <TouchableOpacity
                    onPress={() => {
                      t.removeWishlist(props, t)
                    }}
                    style={[styles.wishlistView, {
                      backgroundColor: 'rgba(1,1,1,0.25)'
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
                      backgroundColor: 'rgba(1,1,1,0.25)',
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
          </ImageBackground>

        </TouchableOpacity>

        <View style={{
          backgroundColor: props.backgroundColor,
          borderRadius: 12
        }}>

          <Text
            style={[styles.titleText, {
              color: props.themeStyle.primary,
              width: widthPic / 1,
              paddingBottom: 0
            }]}
            numberOfLines={1}>
            {props.objectArray.detail[0].title}
          </Text>
          <View
            style={[styles.priceView, {
              marginBottom: props.objectArray.flash_price === undefined ? 0 : 2
            }]}>

          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 5,
            paddingTop: 0,
            borderRadius: 12
          }}>
            <View
              style={[styles.tagsView]}>
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
                  {props.objectArray.product_discount_price !== 0
                    ? <Text numberOfLines={1} style={{ flexDirection: 'row', width: widthPic - 42, marginLeft: 1 }}>
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
                    </Text> : null }
                </View>
              ) : null
              }
            </View>

            {props.objectArray.product_type === 'simple'
              ? <TouchableOpacity
                onPress={() => {
                  if (t.newMethod3(props, t) !== 1) {
                    t.newMethod6(props, t)
                  }
                }}
                style={[styles.discountView, {
                  backgroundColor: props.themeStyle.primary
                }]}>
                <FontAwesome
                  style={{
                    color: props.themeStyle.textTintColor,
                    fontSize: appTextStyle.largeSize + 3
                  }}
                  active
                  name='cart-outline'
                  onPress={() => {
                    if (t.newMethod3(props, t) !== 1) {
                      props.navigation.push('ProductDetails', {
                        objectArray: props.objectArray //
                      })
                    }
                  }}
                />

              </TouchableOpacity>
              : props.objectArray.product_type === 'variable'
                ? <TouchableOpacity
                  onPress={() => {
                    if (t.newMethod3(props, t) !== 1) {
                      if (props.objectArray.product_type === 'simple') {
                        t.newMethod6(props, t)
                      } else if (props.objectArray.product_type === 'variable') {
                        props.navigation.push('ProductDetails', {
                          objectArray: props.objectArray //
                        })
                      }
                    }
                  }}
                  style={[styles.discountView, {
                    backgroundColor: props.themeStyle.primary
                  }]}>
                  <FontAwesome
                    style={{
                      color: props.themeStyle.textTintColor,
                      fontSize: appTextStyle.largeSize + 3
                    }}
                    active
                    name='cart-outline'
                    onPress={() => {
                      if (t.newMethod3(props, t) !== 1) {
                        props.navigation.push('ProductDetails', {
                          objectArray: props.objectArray //
                        })
                      }
                    }}
                  />

                </TouchableOpacity>
                : null
            }
          </View>

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
    shadowOpacity: 0.2,
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
    borderRadius: appTextStyle.customRadius - 15
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
    borderRadius: appTextStyle.customRadius - 14,
    padding: 2,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wishlistView: {
    borderRadius: appTextStyle.customRadius - 14,
    padding: 2,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heartIcon: {
    borderRadius: appTextStyle.customRadius - 14,
    padding: 2,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: appTextStyle.largeSize - 1,
    fontFamily: appTextStyle.fontFamily,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    margin: 0,
    padding: 5,
    paddingTop: 5,
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
