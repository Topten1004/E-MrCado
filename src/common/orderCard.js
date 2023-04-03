import React from 'react'
import {
  View, StyleSheet, Text
} from 'react-native'
import { getLargeImage } from '../common/WooComFetch'
import ImageLoad from '../common/RnImagePlaceH'
import { appTextStyle } from './Theme.style'

const cartCard = ({
  data, themeStyle, settings, language, quantity, indexValue, item2
}) => (
  <View
    key={indexValue}
    style={[styles.cartCardContainer, {
      backgroundColor: themeStyle.primaryBackgroundColor,
      borderBottomWidth: 1,
      borderColor: themeStyle.secondryBackgroundColor,
      paddingVertical: 11,
      paddingTop: 11
    }]}>
    <View style={styles.cartCardView}>
      <ImageLoad
        key={indexValue + '1'}
        style={styles.productsImage}
        source={{ uri: getLargeImage() + data.product_gallary.gallary_name }}
      />

      <View>

        {item2.product_discount > 0

          ? <View style={{ flexDirection: 'row' }}>

            <Text style={[styles.priceText, {
              color: themeStyle.primary,
              fontSize: appTextStyle.mediumSize,
              fontFamily: appTextStyle.fontFamily
            }]}>
              {settings.currency_symbol + ' ' + item2.product_discount.toFixed(Number(settings.currency_decimals))}
            </Text>
            <Text style={[styles.priceText, {
              color: themeStyle.iconPrimaryColor,
              fontSize: appTextStyle.mediumSize,
              textDecorationLine: 'line-through',
              fontFamily: appTextStyle.fontFamily
            }]}>
              {' ' + settings.currency_symbol + ' ' + data.product_price.toFixed(Number(settings.currency_decimals))}
            </Text>
          </View>
          : data.product_discount === null ||
            data.product_discount === undefined
            ? <Text style={[styles.priceText, {
              color: themeStyle.primary,
              fontSize: appTextStyle.mediumSize,
              fontFamily: appTextStyle.fontFamily
            }]}>
              {settings.currency_symbol + ' ' + data.product_price.toFixed(Number(settings.currency_decimals))}
            </Text> : <View />
        }
        <Text style={[styles.priceText, {
          color: themeStyle.textColor,
          fontSize: appTextStyle.largeSize,
          paddingVertical: 5,
          fontFamily: appTextStyle.fontFamily
        }]}>
          {data.detail[0].title}
        </Text>

        <View style={styles.cartAttContainer}>

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
          {language.Qty + quantity}
        </Text>

      </View>

    </View>
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
    padding: 10,
    paddingTop: 0
  },
  productsImage: {
    height: 68,
    width: 65,
    overflow: 'hidden',
    marginRight: 10,
    borderRadius: appTextStyle.customRadius - 7
  }
})

// import React from 'react'
// import {
//   View, StyleSheet, Text
// } from 'react-native'
// import { getLargeImage } from '../common/WooComFetch'
// import ImageLoad from '../common/RnImagePlaceH'
// import { appTextStyle } from './Theme.style'

// const cartCard = ({
//   data, themeStyle, settings, language, quantity, indexValue
// }) => (
//   <View
//     key={indexValue}
//     style={[styles.cartCardContainer, {
//       backgroundColor: themeStyle.primaryBackgroundColor,
//       borderBottomWidth: 1,
//       borderColor: themeStyle.secondryBackgroundColor,
//       paddingVertical: 11,
//       paddingTop: 11
//     }]}>
//     <View style={styles.cartCardView}>
//       <ImageLoad
//         key={indexValue + '1'}
//         style={styles.productsImage}
//         source={{ uri: getLargeImage() + data.product_gallary.gallary_name }}
//       />

//       <View>

//         {data.product_discount !== null &&
//           data.product_discount !== undefined

//           ? <View style={{ flexDirection: 'row' }}>

//             <Text style={[styles.priceText, {
//               color: themeStyle.primary,
//               fontSize: appTextStyle.mediumSize,
//               fontFamily: appTextStyle.fontFamily
//             }]}>
//               {settings.currency_symbol + ' ' + data.product_discount.toFixed(Number(settings.currency_decimals))}
//             </Text>
//             <Text style={[styles.priceText, {
//               color: themeStyle.iconPrimaryColor,
//               fontSize: appTextStyle.largeSize,
//               textDecorationLine: 'line-through',
//               fontFamily: appTextStyle.fontFamily
//             }]}>
//               {settings.currency_symbol + ' ' + data.product_price.toFixed(Number(settings.currency_decimals))}
//             </Text>
//           </View>
//           : data.product_discount === null ||
//             data.product_discount === undefined
//             ? <Text style={[styles.priceText, {
//               color: themeStyle.primary,
//               fontSize: appTextStyle.mediumSize,
//               fontFamily: appTextStyle.fontFamily
//             }]}>
//               {settings.currency_symbol + ' ' + data.product_price.toFixed(Number(settings.currency_decimals))}
//             </Text> : <View />
//         }
//         <Text style={[styles.priceText, {
//           color: themeStyle.textColor,
//           fontSize: appTextStyle.largeSize,
//           paddingVertical: 5,
//           fontFamily: appTextStyle.fontFamily
//         }]}>
//           {data.detail[0].title}
//         </Text>

//         <View style={styles.cartAttContainer}>

//           {data.product_combination !== undefined
//             ? data.product_combination.map((att, index) => (

//               <Text style={[styles.modalAttrKey, {
//                 color: themeStyle.iconPrimaryColor,
//                 fontSize: appTextStyle.mediumSize,
//                 fontFamily: appTextStyle.fontFamily
//               }]}>
//                 {data.product_combination.length === (index + 1)
//                   ? att.variation.detail[0].name + ' '
//                   : att.variation.detail[0].name + ', '}
//               </Text>

//             )) : null}

//         </View>

//         <Text style={[{
//           color: themeStyle.textColor,
//           fontSize: appTextStyle.mediumSize,
//           fontFamily: appTextStyle.fontFamily
//         }]}>
//           {language.Qty + quantity}
//         </Text>

//       </View>

//     </View>
//   </View>
// )

// /// //////////////////////////////////////////
// export default cartCard

// const styles = StyleSheet.create({

//   cartCardView: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
//   },
//   cartCardContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//     paddingTop: 0
//   },
//   productsImage: {
//     height: 68,
//     width: 65,
//     overflow: 'hidden',
//     marginRight: 10,
//     borderRadius: appTextStyle.customRadius - 7
//   }
// })
