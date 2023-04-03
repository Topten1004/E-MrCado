import React from 'react'
import { View, TouchableOpacity, Text, Platform, I18nManager, StyleSheet } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { appTextStyle } from '../Theme.style'
import Timer from '../Timer'
import { getThumbnailImage } from '../WooComFetch'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import { Icon } from 'native-base'

export default CardOne = ({ props, widthPic, t, s, btnWidth }) => (
  <View
    style={[styles.container, {
      backgroundColor: props.backgroundColor,
      borderColor: props.themeStyle.primaryLight
    }]}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: appTextStyle.customRadius - 7
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
          <View style={styles.btnMainContainer}>
            <View>
              {props.objectArray.product_type === 'simple'
                ? <TouchableOpacity
                  style={[styles.btnView, {
                    width: btnWidth * 0.75,
                    backgroundColor: props.themeStyle.primary
                  }]}
                  onPress={() => {
                    if (t.newMethod3(props, t) !== 1) {
                      t.newMethod6(props, t)
                    }
                  }}>
                  <Text
                    style={[styles.btnText, {
                      color: props.themeStyle.textTintColor
                    }]}>
                    {t.props.language['Add to Bag']}
                  </Text>

                </TouchableOpacity>
                : props.objectArray.product_type === 'variable'
                  ? <TouchableOpacity
                    style={[styles.btnView, {
                      width: btnWidth * 0.75,
                      backgroundColor: props.themeStyle.primary
                    }]}
                    onPress={() => {
                      if (t.newMethod3(props, t) !== 1) {
                        props.navigation.push('ProductDetails', {
                          objectArray: props.objectArray //
                        })
                      }
                    }}>
                    <Text
                      style={[styles.btnText, {
                        color: props.themeStyle.textTintColor
                      }]}>
                      {t.props.language.Details}
                    </Text>

                  </TouchableOpacity> : null
              }
            </View>
            <View style={{ marginLeft: 6 }}>
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
                        fontSize: appTextStyle.smallSize + 3,
                        marginTop: Platform.OS === 'ios' ? 1 : 0
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
                        fontSize: appTextStyle.smallSize + 1,
                        marginTop: Platform.OS === 'ios' ? 2 : 1
                      }}
                      active
                      name='heart-o'
                    />
                  </TouchableOpacity>

                )}
            </View>
          </View>

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
          backgroundColor: props.backgroundColor,
          borderRadius: appTextStyle.customRadius - 7
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
    borderWidth: 1,
    borderRadius: appTextStyle.customRadius - 7
  },
  btnMainContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeStyle: {
    position: 'absolute',
    bottom: 4,
    left: 5
  },
  removeView: {
    alignItems: 'center',
    height: Platform.OS === 'android' ? 30 : 28,
    justifyContent: 'center'
  },
  btnView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 2,
    borderRadius: appTextStyle.customRadius
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
  wishlistView: {
    borderRadius: appTextStyle.customRadius - 15,
    padding: 2,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heartIcon: {
    borderRadius: appTextStyle.customRadius - 15,
    padding: 2,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontSize: appTextStyle.mediumSize + 1,
    fontWeight: '500',
    fontFamily: appTextStyle.fontFamily
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
    padding: 2,
    paddingLeft: 5,
    paddingRight: 0,
    borderRadius: appTextStyle.customRadius - 15,
    left: 4,
    top: 10,
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
