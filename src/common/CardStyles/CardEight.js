import React from 'react'
import { View, TouchableOpacity, Text, Platform, I18nManager, StyleSheet } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { appTextStyle } from '../Theme.style'
import Timer from '../Timer'
import { getThumbnailImage } from '../WooComFetch'
export default CardOne = ({ props, widthPic, t, s, btnWidth }) => (
  <View
    style={[styles.container, {
      backgroundColor: props.backgroundColor
    }]}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: appTextStyle.customRadius - 11
      }}>
      <TouchableOpacity
        style={styles.imageTouchContainer}
        onPress={() =>
          props.navigation.push('ProductDetails', {
            objectArray: props.objectArray //
          })
        }>
        <ImageLoad
          key={props.objectArray.id}
          style={[styles.imageStyle, {
            height: widthPic,
            width: widthPic,
            backgroundColor:
                t.props.card_style === 12
                  ? '#000'
                  : 'rgb(236, 236, 236)'
          }]}
          source={{ uri: getThumbnailImage() + props.objectArray.product_gallary.gallary_name }}>
        </ImageLoad>
        {props.objectArray.product_discount_price !== 0
          ? <View style={styles.discountTag}>
            <View
              style={[styles.discountView, {
                backgroundColor: props.themeStyle.primary
              }]}>
              <Text style={[styles.tagText, {
                color: props.themeStyle.textTintColor
              }]}>
                {t.productDiscount(props)}
              </Text>

            </View>

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
      {props.objectArray.product_type === 'simple'
        ? <TouchableOpacity
          style={[styles.btnStyle, {
            width: btnWidth * 0.9,
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
            style={[styles.btnStyle, {
              width: btnWidth * 0.9,
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
    elevation: 3,
    paddingBottom: 8,
    borderRadius: appTextStyle.customRadius - 11
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
  btnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 2,
    borderRadius: appTextStyle.customRadius,
    marginTop: 7
  },
  discountTag: {
    left: 7, position: 'absolute', top: 7
  },
  imageStyle: {
    borderRadius: appTextStyle.customRadius - 11,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  imageTouchContainer: {
    flex: 2,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderRadius: appTextStyle.customRadius - 11
  },
  tagText: {
    fontSize: appTextStyle.smallSize - 4,
    fontWeight: 'bold',
    fontFamily: appTextStyle.fontFamily
  },
  btnText: {
    fontSize: appTextStyle.mediumSize + 1,
    fontWeight: '500',
    fontFamily: appTextStyle.fontFamily
  },
  discountView: {
    borderRadius: appTextStyle.customRadius - 4,
    padding: 2,
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: appTextStyle.mediumSize,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    margin: 0,
    padding: 5,
    paddingTop: 3,
    paddingLeft: 5,
    paddingBottom: 8,
    marginBottom: 0,
    fontWeight: '400',
    fontFamily: appTextStyle.fontFamily
  }
})
