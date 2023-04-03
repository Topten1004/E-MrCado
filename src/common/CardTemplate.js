import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import HTML from 'react-native-render-html'
import theme, { appConfigStyle, appTextStyle } from './Theme.style'
import CardOne from './CardStyles/CardOne'
import CardTwo from './CardStyles/CardTwo'
import CardThree from './CardStyles/CardThree'
import CardFour from './CardStyles/CardFour'
import CardFive from './CardStyles/CardFive'
import CardSix from './CardStyles/CardSix'
import CardSeven from './CardStyles/CardSeven'
import CardEight from './CardStyles/CardEight'
import CardNine from './CardStyles/CardNine'
import CardTenth from './CardStyles/CardTenth'
import CardElev from './CardStyles/CardElev'
import CardTwelve from './CardStyles/CardTwelve'
import CardThirteen from './CardStyles/CardThirteen'
import CardFourteen from './CardStyles/CardFourteen'
import CardFifteen from './CardStyles/CardFifteen'
import CardSixteen from './CardStyles/CardSixteen'
import CardZero from './CardStyles/CardZero'
import CardSeventeen from './CardStyles/CardSeventeen'
import CardEighteen from './CardStyles/CardEighteen'
import CardNineteen from './CardStyles/CardNineteen'
import CardTwenty from './CardStyles/CardTwenty'
import CardTOne from './CardStyles/CardTOne'
import CardTtwo from './CardStyles/CardTtwo'
import CardtThree from './CardStyles/CardtThree'
import CardTFour from './CardStyles/CardTFour'
import CardTFive from './CardStyles/CardTFive'
import CardTSix from './CardStyles/cardTSix'
import CardZeroOne from './CardStyles/CardZeroOne'

import CardtSeven from './CardStyles/CardtSeven'

import { createSelector } from 'reselect'
import { removeWishlistFun, storeWishlist, addToCartFun } from '../redux/actions/actions'

import Toast from 'react-native-easy-toast'

class CardTemplate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      spinnerTemp: false,
      page: 11,
      refreshing: false,
      temp1: 0,
      counter: 0,
      stepperArray: [],
      wishListId: 0,
      quantityNumber: 0,
      wishListValue: '0',
      counterQuantity: 1 //
    }
    global.SampleVar = false
    this.toast = null
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.settings.card_style === '24' ||
      this.props.settings.card_style === '25' ||
      this.props.settings.card_style === '26' ||
      this.props.settings.card_style === '27' ||
      this.props.settings.card_style === '28') {
      this.props.cartProductsArray.forEach(element => {
        if (this.props.objectArray.product_id === element.product_id) {
          if (element.qty !== prevState.quantityNumber && this.props.objectArray.product_id === element.product_id) {
            this.setState({
              quantityNumber: element.qty,
              counterQuantity: element.qty //
            })
          }
        }
      })
    }
  }

  componentDidMount () {
    if (this.props.settings.card_style === '24' ||
      this.props.settings.card_style === '25' ||
      this.props.settings.card_style === '26' ||
      this.props.settings.card_style === '27' ||
      this.props.settings.card_style === '28') {
      this.setState({}) // render counter update
    }
  }

  checkProductNew = props => {
    const pDate = new Date(props.objectArray.date_created)
    const date =
      pDate.getTime() +
      this.props.newProductDuration * 86400000
    const todayDate = new Date().getTime()
    if (date > todayDate) {
      return true
    }
    return false
  }

  // priceFun = (size, name, textDecorationLine, textColor, bold) => (
  //   <View style={{ flexDirection: 'row', paddingRight: 5 }}>
  //     <HTML
  //       html={this.props.settings.currency_symbol}
  //       baseFontStyle={{
  //         fontSize: size,
  //         color: textColor || (textDecorationLine === 'line-through' ? this.props.cardTextColor : this.props.themeStyle.cardTextColor),
  //         textDecorationLine,
  //         fontWeight: bold ? 'bold' : 'normal'
  //       }}
  //     />
  //     <Text
  //       style={{
  //         color: textColor || (textDecorationLine === 'line-through' ? this.props.cardTextColor : this.props.themeStyle.cardTextColor),
  //         fontSize: size,
  //         textDecorationLine,
  //         fontWeight: bold ? 'bold' : 'normal',
  //         paddingHorizontal: 1,
  //         fontFamily: appTextStyle.fontFamily
  //       }}>
  //       {name.toFixed(Number(this.props.settings.currency_decimals))}
  //     </Text>
  //   </View>
  // )

  // <HTML
  //   html={this.props.settings.currency_symbol}
  //   baseFontStyle={{
  //     fontSize: size,
  //     color: textColor || (textDecorationLine === 'line-through' ? this.props.textColor : this.props.themeStyle.primary),
  //     textDecorationLine,
  //     fontWeight: bold ? 'bold' : 'normal'
  //   }}
  // />
  priceFun = (size, name, textDecorationLine, textColor, bold) => (
    <Text style={{ flexDirection: 'row' }}>
      <Text
        numberOfLines={1}
        style={{
          // color: appConfigStyle.cardsColor ? this.props.themeStyle.cardTextColor :
          // this.props.themeStyle.textColor,
          color: textColor || (textDecorationLine === 'line-through' ? this.props.cardTextColor : this.props.themeStyle.cardTextColor),
          fontSize: size,
          textDecorationLine,
          fontWeight: bold ? 'bold' : 'normal',
          paddingHorizontal: 1,
          fontFamily: appTextStyle.fontFamily
        }}>
        {this.props.settings.currency_symbol}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          // color: appConfigStyle.cardsColor ? this.props.themeStyle.cardTextColor :
          // this.props.themeStyle.textColor,
          color: textColor || (textDecorationLine === 'line-through' ? this.props.cardTextColor : this.props.themeStyle.cardTextColor),
          fontSize: size,
          textDecorationLine,
          fontWeight: bold ? 'bold' : 'normal',
          paddingHorizontal: 1,
          fontFamily: appTextStyle.fontFamily
        }}>
        {name.toFixed(Number(this.props.settings.currency_decimals)) + ' '}
      </Text>
    </Text>
  )

  SingleComponent = (props, widthPic, t, s, btnWidth) =>
    this.props.cardStyle === '118' ? (
      <CardZero
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={false}
        wishListProducts={false}
        card_style={this.props.settings.card_style}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    )
      : this.props.settings.card_style === '1' ? (
        <CardZeroOne
          props={props}
          widthPic={widthPic}
          t={this}
          s={s}
          btnWidth={btnWidth}
          cartProductArray={this.props.cartProductArrayViewedProducts}
          recentViewedProducts={false}
          wishListProducts={false}
          card_style={this.props.settings.card_style}
          newProductDuration={this.props.newProductDuration}
          cartButton={this.props.cartButton}
          inventory={this.props.inventory}
          language={this.props.language}
          language2={this.props.language2}
        />
      )
        : this.props.settings.card_style === '2' ? (
          <CardOne
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '3' ? (
          <CardTwo
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '4' ? (
          <CardThree
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '5' ? (
          <CardFour
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '6' ? (
          <CardFive
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '7' ? (
          <CardSix
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '8' ? (
          <CardSeven
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '9' ? (
          <CardEight
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '10' ? (
          <CardNine
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '11' ? (
          <CardTenth
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '12' ? (
          <CardElev
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '13' ? (
          <CardTwelve
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '14' ? (
          <CardThirteen
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '15' ? (
          <CardFourteen
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '16' ? (
          <CardFifteen
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '17' ? (
          <CardSixteen
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '18' ? (
          <CardSeventeen
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '19' ? (
          <CardEighteen
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '20' ? (
          <CardNineteen
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '21' ? (
          <CardTwenty
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '22' ? (
          <CardTOne
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '23' ? (
          <CardTtwo
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '24' ? (
          <CardtThree
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '25' ? (
          <CardTFour
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '26' ? (
          <CardTFive
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '27' ? (
          <CardTSix
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : this.props.settings.card_style === '28' ? (
          <CardtSeven
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        ) : (
          <CardZeroOne
            props={props}
            widthPic={widthPic}
            t={this}
            s={s}
            btnWidth={btnWidth}
            cartProductArray={this.props.cartProductArrayViewedProducts}
            recentViewedProducts={false}
            wishListProducts={false}
            card_style={this.props.settings.card_style}
            newProductDuration={this.props.newProductDuration}
            cartButton={this.props.cartButton}
            inventory={this.props.inventory}
            language={this.props.language}
            language2={this.props.language2}
          />
        )

  /// ////////////////////
  getPer = (r, s) => {
    const a = r / 100
    const b = r - s
    return b / a
  }

  /// ///////////////////
  imageIcon = (bagBtn, otherBtn, h, w) => {
    return (
      <Image
        source={require('../images/shopping_bag.png')}
        style={{
          height: h,
          width: w,
          marginBottom: 2,
          tintColor:
            this.newMethod3(this.props, this) === 1 ? otherBtn : bagBtn
        }}></Image>
    )
  }

  getCategoryName () {
    if (this.props.objectArray.categories.length !== 0) { return this.props.objectArray.categories[0].categories_name }
  }

  productDiscount (props) {
    var rtn = ''
    var p1 = parseInt(props.objectArray.product_price)
    var p2 = parseInt(props.objectArray.product_discount_price)

    var result = Math.abs((p1 - p2) / p1 * 100)
    result = parseInt(result.toString())
    if (result === 0) {
      rtn = '-' + result + '%'
      return rtn
    }
    rtn = '-' + result + '%'
    return rtn
  }

  /// /////////////////
  pDiscount (props) {
    if (props.dataName !== 'Flash') {
      var rtn = ''
      var p1 = parseInt(props.objectArray.products_price)
      var p2 = parseInt(props.objectArray.discount_price)
      if (p1 === 0 || p2 == null || p2 === undefined || p2 === 0) {
        rtn = ''
      }
      var result = Math.abs(((p1 - p2) / p1) * 100)
      result = parseInt(result.toString())
      if (result === 0) {
        rtn = ''
      }
      rtn = result + '%'
      return rtn
    } else if (props.dataName === 'Flash') {
      let rtn = ''
      const p1 = parseInt(props.objectArray.products_price)
      const p2 = parseInt(props.objectArray.flash_price)
      if (p1 === 0 || p2 == null || p2 === undefined || p2 === 0) {
        rtn = ''
      }
      let result = Math.abs(((p1 - p2) / p1) * 100)
      result = parseInt(result.toString())
      if (result === 0) {
        rtn = ''
      }
      rtn = result + '%'
      return rtn
    }
  }

  removeWishlist = (props, t) => {
    t.setState({
      spinnerTemp: true
    })
    const wishListId = this.getWishListId(props.objectArray.product_id)
    this.props.removeWishlistCall(this.props.userData, props.objectArray.product_id,
      this, wishListId)
  }

  productIsInList = (id) => {
    let found = false
    if (this.props.wishlistArray !== undefined &&
      this.props.wishlistArray !== null &&
      this.props.wishlistArray !== '') {
      this.props.wishlistArray.forEach(element => {
        if (element.product_id === id) { found = true }
      })
    }
    return found
  }

  quantityMinus = (value) => {
    if (this.state.quantityNumber > 0) {
      this.setState({ quantityNumber: value }, () => {
        this.setState({ spinnerTemp: true, counter: this.state.counter + 1 })
        this.props.addToCartCall(this.props.objectArray.product_id, value, null,
          this.props.sessionId, this)
      })
    }
  }

  quantityPlus = (value) => {
    this.setState({ quantityNumber: value }, () => {
      this.setState({ spinnerTemp: true, counter: this.state.counter + 1 })
      this.props.addToCartCall(this.props.objectArray.product_id, this.state.quantityNumber, null,
        this.props.sessionId, this)
    })
  }

  quantityMinusTwo = (value) => { //
    if (this.state.counterQuantity > 0) {
      this.setState({ counterQuantity: value }, () => {
      })
    }
  }

  quantityPlusTwo = (value) => { //
    this.setState({ counterQuantity: value }, () => {
    })
  }

  addToCartTwo = (props, t) => { //
    t.setState({ spinnerTemp: true })
    this.props.addToCartCall(props.objectArray.product_id, this.state.counterQuantity, null,
      this.props.sessionId, this)
  }

  getWishListId = (id) => {
    let found = 0
    if (this.props.wishlistArray !== undefined &&
      this.props.wishlistArray !== null &&
      this.props.wishlistArray !== '') {
      this.props.wishlistArray.forEach(element => {
        if (element.product_id === id) { found = element.wishlist }
      })
    }
    return found
  }

  addWishlist = async (props, t) => {
    if (Object.keys(this.props.userData).length === 0) {
      props.navigation.navigate('LoginScreen')
    } else {
      t.setState({
        spinnerTemp: true
      })
      if (this.productIsInList(props.objectArray.product_id)) {
        this.props.removeWishlistCall(this.props.userData, props.objectArray.product_id,
          this)
      } else {
        const data2 = this.props.storeWishlistCall(this.props.userData, props.objectArray.product_id,
          this)
      }
    }
  }

  /// ///////////////////////////////////////////////////////////
  removeRecent = (props, t) => {
    t.setState({ spinnerTemp: true })
    setTimeout(() => {
      props.removeRecentItems(props.objectArray)
      this.setState({ spinnerTemp: false })
    }, Math.floor(100 / 360000))
  }

  /// //////////////////////////////////////////////////////////
  newMethod6 = (props, t) => {
    t.setState({ spinnerTemp: true, counter: t.state.counter + 1 })
    this.props.addToCartCall(props.objectArray.product_id, 1, null,
      this.props.sessionId, this)
  }

  /// ////////////////////////////////////////////////////////////
  setTimePassed (props, q) {
    props.addItemToCart(
      props.objectArray,
      q,
      this.props.settings.card_style
    )
    this.setState({ spinnerTemp: false })
  }

  /// ///////////////////////////////////////////////////////////////
  removeCartitems = (props, t) => {
    if (props.settings.card_style === '22') {
      if (
        props.objectArray.quantity === undefined ||
        props.objectArray.quantity === null
      ) {
        let temp2 = 0
        props.cartProductArrayViewedProducts.map((val, key) => {
          const temp = []
          for (
            let i = 0;
            i < props.cartProductArrayViewedProducts.length;
            i++
          ) {
            if (val.products_id === props.objectArray.product_id || temp2 === 1) {
              temp[i] = props.cartProductArrayViewedProducts[i]
              val.quantity = val.quantity - 1
              props.objectArray.quantity = val.quantity
            } else {
              temp2 = 1
            }
          }
          props.cartProductArrayViewedProducts = temp
        })
      } else {
        let temp2 = 0
        const temp = []
        for (
          let i = 0;
          i < props.cartProductArrayViewedProducts.length;
          i++
        ) {
          if (
            props.cartProductArrayViewedProducts[i].products_id ===
            props.objectArray.product_id ||
            temp2 === 1
          ) {
            temp[i] = props.cartProductArrayViewedProducts[i]
            props.cartProductArrayViewedProducts[i].quantity =
              props.cartProductArrayViewedProducts[i].quantity - 1
            props.objectArray.quantity =
              props.cartProductArrayViewedProducts[i].quantity
          } else {
            temp2 = 1
          }
        }
        props.cartProductArrayViewedProducts = temp
        return
      }
      setTimeout(() => { }, Math.floor(100 / 360000))
    }
  }

  /// ////////////////////////////////////////////////////////////
  newMethod3 = (props, t) => {
    let temp = 0
    props.cartProductArrayViewedProducts.map(row => {
      if (row.products_id === props.objectArray.products_id) {
        temp = 1
      }
    })
    if (temp === 1) {
      return 1
    }
    temp = 0
    return 0
  }

  /// ////////////////////////////////////////////////////////////

  /// /////////////////////////////////////////////////////////////
  componentWillUnmount () {
    clearInterval(this.state.spinnerTemp)
  }

  render () {
    const s = ''
    return (
      <View>
        <Spinner visible={this.state.spinnerTemp} />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{
            backgroundColor: '#c1c1c1'
          }}
          position='top'
          positionValue={10}
          fadeOutDuration={200}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.mediumSize }}
        />
        {this.props.rows === false
          ? this.SingleComponent(
            this.props,
            this.props.width ? this.props.width : theme.singleRowCardWidth,
            this,
            s,
            this.props.width
              ? this.props.width
              : theme.singleRowCardWidth
          )
          : this.SingleComponent(
            this.props,
            this.props.width ? this.props.width : theme.singleRowCardWidth,
            this,
            s,
            this.props.width
              ? this.props.width
              : theme.singleRowCardWidth
          )}
      </View>
    )
  }
}

const wishlistArray = (state) => state.wishlistData.wishlistArray
const wishlistArrayFun = createSelector(
  [wishlistArray],
  (wishlistArray) => {
    return wishlistArray
  }
)
const getLanguage2 = (state) => state.appConfig.languageJson
const getLanguage = (state) => state.appConfig.languageJson
const getCartArray = (state) => state.cartData.cartProductsArray
const getSettings = (state) => state.settingsCall.settings
const getSessionId = (state) => state.userData.sessionId
const getUserData = (state) => state.userData.user
const getSessionIdFun = createSelector(
  [getSessionId],
  (getSessionId) => {
    return getSessionId
  }
)
const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
const getCartArrayFun = createSelector(
  [getCartArray],
  (getCartArray) => {
    return getCartArray
  }
)
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const getLanguageFun2 = createSelector(
  [getLanguage2],
  (getLanguage2) => {
    return getLanguage2
  }
)

const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)

const mapStateToProps = state => {
  return {
    themeStyle: getThemeFun(state),
    cartProductArrayViewedProducts: [],
    newProductDuration: 20,
    cartButton: true,
    inventory: true,
    language: getLanguageFun(state),
    language2: getLanguageFun2(state),
    settings: getSettingsFun(state),
    sessionId: getSessionIdFun(state),
    userData: getUserDataFun(state),
    wishlistArray: wishlistArrayFun(state),
    cartProductsArray: getCartArrayFun(state)

  }
}

const mapDispatchToProps = dispatch => ({
  addToCartCall: (productId, quantityNumber, productCombinationId, sessionId, th) => {
    dispatch(async dispatch => {
      await addToCartFun(dispatch, productId, quantityNumber, productCombinationId,
        sessionId, th)
    })
  },
  removeWishlistCall: (userData, productId, th, wishListId) => {
    dispatch(async dispatch => {
      await removeWishlistFun(dispatch, userData, productId, th, wishListId)
      // await getCategories(dispatch, props.selectedlang.id)
    })
  },
  storeWishlistCall: (userData, productId, th) => {
    dispatch(async dispatch => {
      await storeWishlist(dispatch, userData, productId, th)
      // await getCategories(dispatch, props.selectedlang.id)
    })
  },
  addItemToCart: (product, productQuantity, card) => {
    dispatch({
      type: 'ADD_TO_CARTS',
      product,
      attributes: [],
      productQuantity,
      card
    })
  },
  removeCardFromCart: productObject => {
    dispatch({
      type: 'REMOVE_CARD_FROM_CART',
      product: productObject,
      variation: null,
      metaData: null
    })
  },
  removeFlashCard: productObject => {
    dispatch({
      type: 'REMOVE_FLASH_CARD',
      product: productObject
    })
  },
  cartTotalItems: () => {
    dispatch({
      type: 'CART_TOTAL_ITEMS'
    })
  },
  removeItemToCart: (productObject, productQuantity) =>
    dispatch({
      type: 'REMOVE_TO_CARTS_QUANTITY',
      product: productObject,
      cartProductQuantity: productQuantity,
      variation: null,
      metaData: null
    }),
  removeRecentItems: productArray =>
    dispatch({ type: 'REMOVE_RECENT', product: productArray }),
  addWishlistProduct: productArray =>
    dispatch({ type: 'ADD_WISHLIST_PRODUCTS', product: productArray }),
  removeWishListProduct: productArray =>
    dispatch({ type: 'REMOVE_WISHLIST_PRODUCTS', product: productArray })
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(CardTemplate))
