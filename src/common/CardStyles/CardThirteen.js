import React from 'react'
import { View, TouchableOpacity, Text, Platform, I18nManager, StyleSheet } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { appTextStyle } from '../Theme.style'
import Timer from '../Timer'
import FontAwesome from 'react-native-vector-icons/Ionicons'
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

          <View style={{ left: 0, position: 'absolute', top: 0 }}>
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
                  top: props.objectArray.product_discount_price !== 0 ? 22 : 0
                }]}>
                <Text style={{
                  color: props.themeStyle.textTintColor,
                  fontSize: appTextStyle.smallSize - 2,
                  fontFamily: appTextStyle.fontFamily
                }}>
                  {t.props.language.Featured}
                </Text>
              </View>
            ) : null}

          </View>

          <View style={{ right: 7, position: 'absolute', top: 7 }}>
            <TouchableOpacity
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
                    if (props.objectArray.product_type === 'simple') {
                      t.newMethod6(props, t)
                    } else if (props.objectArray.product_type === 'variable') {
                      props.navigation.push('ProductDetails', {
                        objectArray: props.objectArray //
                      })
                    }
                  }
                }}
              />

            </TouchableOpacity>

          </View>

        </TouchableOpacity>

        <View style={{
          backgroundColor: props.backgroundColor
        }}>
          <Text
            style={[styles.titleText, {
              color: props.themeStyle.cardTextColor,
              width: widthPic / 1,
              paddingBottom: 0,
              textAlign: 'center'
            }]}
            numberOfLines={2}>
            {props.objectArray.category[0].category_detail.detail[0].name}
          </Text>
          <Text
            style={[styles.titleText, {
              color: props.themeStyle.cardTextColor,
              width: widthPic / 1,
              textAlign: 'center'
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
    justifyContent: 'center',
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
    padding: 1,
    height: 27,
    width: 27,
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
  tagsView: {
    zIndex: 6,
    padding: 4,
    paddingHorizontal: 5,
    left: 0,
    top: 0,
    position: 'absolute'
  },
  recentProductView: {
    margin: 5,
    marginBottom: 3,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  removeRecentView: {
    padding: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 0
  }
})
