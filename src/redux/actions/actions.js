import { getUrl, getHttp, postHttp, deleteHttp } from '../../common/WooComFetch'
import { store } from '../store/index'
import CookieManager from 'react-native-cookies'
import { appConfigStyle } from '../../common/Theme.style'
import AsyncStorage from '@react-native-async-storage/async-storage'
export const SET_MODE = 'SET_MODE'
export const GET_ALL_CATEGORIES = 'GET_ALL_CATEGORIES'
export const ADD_TOP_SELLER_PRODUCTS = 'ADD_TOP_SELLER_PRODUCTS'
export const ADD_MOST_LIKED_PRODUCTS = 'ADD_MOST_LIKED_PRODUCTS'
export const SET_THEME = 'SET_THEME'
export const ADD_SPECIAL_PRODUCTS = 'ADD_SPECIAL_PRODUCTS'
export const SHOW_INTRO = 'SHOW_INTRO'
export const LANG_CODE = 'LANG_CODE'
export const GET_CODE = 'GET_CODE'
export const GET_BANNERS = 'GET_BANNERS'
export const GET_CATEGORIES = 'GET_CATEGORIES'
export const GET_PRODUCTS = 'GET_PRODUCTS'
export const CLEAR_PRODUCTS = 'CLEAR_PRODUCTS'
export const ADD_SEARCH_TEXT = 'ADD_SEARCH_TEXT'
export const REMOVE_SEARCH_TEXT = 'REMOVE_SEARCH_TEXT'
export const GET_TOPSELLER_PRODUCTS = 'GET_TOPSELLER_PRODUCTS'
export const CLEAR_TOPSELLER_PRODUCTS = 'CLEAR_TOPSELLER_PRODUCTS'
export const GET_FEATURED_PRODUCTS = 'GET_FEATURED_PRODUCTS'
export const CLEAR_FEATURED_PRODUCTS = 'CLEAR_FEATURED_PRODUCTS'
export const GET_ONSALE_PRODUCTS = 'GET_ONSALE_PRODUCTS'
export const CLEAR_ONSALE_PRODUCTS = 'CLEAR_ONSALE_PRODUCTS'
export const GET_HOT_PRODUCTS = 'GET_HOT_PRODUCTS'
export const CLEAR_HOT_PRODUCTS = 'CLEAR_HOT_PRODUCTS'
export const GET_DETAIL_PAGE_PRODUCTS = 'GET_DETAIL_PAGE_PRODUCTS'
export const CLEAR_DETAIL_PAGE_PRODUCTS = 'CLEAR_DETAIL_PAGE_PRODUCTS'
export const GET_CART_PAGE_PRODUCTS = 'GET_CART_PAGE_PRODUCTS'
export const CLEAR_CART_PAGE_PRODUCTS = 'CLEAR_CART_PAGE_PRODUCTS'
export const SET_FIRST_SETTINGS = 'SET_FIRST_SETTINGS'
export const SET_SECOND_SETTINGS = 'SET_SECOND_SETTINGS'
export const GET_LANGUAGE = 'GET_LANGUAGE'
export const SET_LANGUAGE = 'SET_LANGUAGE'
export const SET_LANGUAGE_ID = 'SET_LANGUAGE_ID'
export const SET_CURRENCY_ID = 'SET_CURRENCY_ID'
export const CLEAR_LANGUAGES = 'CLEAR_LANGUAGES'
export const CLEAR_CURRENCY = 'CLEAR_CURRENCY'
export const GET_CURRENCY = 'GET_CURRENCY'
export const SET_CURRENCY = 'SET_CURRENCY'
export const DEFAULT_LANGUAGE = 'DEFAULT_LANGUAGE'
export const SET_BANNER_STYLE = 'SET_BANNER_STYLE'
export const SET_CARD_STYLE = 'SET_CARD_STYLE'
export const SET_HOME_STYLE = 'SET_HOME_STYLE'
export const SET_CATEGORY_STYLE = 'SET_CATEGORY_STYLE'
export const SET_SESSION_ID = 'SET_SESSION_ID'
export const REMOVE_SESSION_ID = 'REMOVE_SESSION_ID'
export const ADD_CART_PRODUCTS = 'ADD_CART_PRODUCTS'
export const ADD_ADDRESS = 'ADD_ADDRESS'
export const ADD_CART_QUANTITY = 'ADD_CART_QUANTITY'
export const REMOVE_CART_QUANTITY = 'REMOVE_CART_QUANTITY'
export const CLEAR_CART_QUANTITY = 'CLEAR_CART_QUANTITY'
export const ADD_COUPON = 'ADD_COUPON'
export const DEL_COUPON = 'DEL_COUPON'
export const REGISTER_USER = 'REGISTER_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const REMOVE_COUPON = 'REMOVE_COUPON'
export const SAVE_ALL_PRICES = 'SAVE_ALL_PRICES'
export const GET_WISHLIST_ARRAY = 'GET_WISHLIST_ARRAY'
export const GET_WISHLIST_REMOVE_ID = 'GET_WISHLIST_REMOVE_ID'
export const STORE_WISHLIST = 'STORE_WISHLIST'
export const DELETE_WISHLIST = 'DELETE_WISHLIST'

export function ForgotPasswordFun (dispatch, th, email) {
  dispatch(async dispatch => {
    const obj = {}
    obj.email = email
    const json = await postHttp(getUrl() + 'forget_password?', obj)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      }
    } else {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
  })
}

export function addSearchValue (value) {
  return {
    type: ADD_SEARCH_TEXT,
    value
  }
}

export function colorFun (th, index) {
  let productColorsArray = []
  if (appConfigStyle.cardsColor) { productColorsArray = ['#eaf3de', '#fbe5e2', '#d7f2fe', '#ffe9a5'] } else { productColorsArray = [th.props.themeStyle.secondryBackgroundColor, th.props.themeStyle.secondryBackgroundColor, th.props.themeStyle.secondryBackgroundColor, th.props.themeStyle.secondryBackgroundColor] }
  if (th.state.productColorCounter > 3 || index === 0) {
    th.state.productColorCounter = 0
  }
  th.state.productBackgroundColor = productColorsArray[th.state.productColorCounter]
  th.state.productColorCounter = th.state.productColorCounter + 1
  return th.state.productBackgroundColor
}

export function clearSearchValue () {
  return {
    type: REMOVE_SEARCH_TEXT
  }
}

export function placeOrderFun (dispatch, data, sessionId, th, method) {
  dispatch(async dispatch => {
    const obj = data
    if (sessionId === '') {
      obj.currency_id = th.props.settings.currency_id
      obj.payment_method = method
    } else {
      obj.currency_id = th.props.settings.currency_id
      obj.session_id = sessionId
      obj.payment_method = method
    }
    console.log(getUrl() + 'order', obj)
    const json = await postHttp(getUrl() + 'order', obj)
    console.log('final', json)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.setState({
          spinnerTemp: false
        }, () => {
          th.toast.show('Order Placed')
          th.props.navigation.navigate('ThankUScreen')
        })
        getCartProductsQuantity(dispatch, '', th,
          json.data, false)
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      }
    } else {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
  })
}

export function getAddress (dispatch, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'customer_address_book', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.toast.show(json.data.data.message)
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getOneProduct (dispatch, languageId, currencyId, id, th) {
  dispatch(async dispatch => {
    let url = 'products/' + id
    url += '?getCategory=1'
    url += '&getDetail=1'
    url += '&language_id=' + languageId
    url += '&stock=1'
    url += '&currency=' + currencyId

    const json = await getHttp(getUrl() + url, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.props.getProductsFun(th.props, th.state.page,
          json.data.data.category[0].category_detail.detail[0].category_id)
        th.setState({ spinnerTemp: false }, () => {
          th.navigate(json.data.data)
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getStates (dispatch, th, id, langId, lang) {
  dispatch(async dispatch => {
    let url = 'country/' + id
    url += '?getStates=1'
    url += '&language_id=' + langId

    const json = await getHttp(getUrl() + url, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        if (json.data.data.states.length > 0) {
          th.setState({
            statesArray: json.data.data.states,
            spinnerTemp: false
          })
        } else {
          th.setState({
            statesArray: [{
              name: lang.other,
              country_id: 0,
              id: 0
            }],
            spinnerTemp: false
          })
        }
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false,
          statesArray: []
        })
      }
    } else {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false,
        statesArray: []
      })
    }
  })
}

export function getCountry (dispatch, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'country?sortBy=id&limit=999', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.setState({
          countryArray: json.data.data
        })
      } else {
        th.toast.show(json.data.message)
        th.setState({
          countryArray: []
        })
      }
    } else {
      th.toast.show(json.data.data.message)
      th.setState({
        countryArray: []
      })
    }
  })
}

export async function logOut (dispatch, th) {
  dispatch(async dispatch => {
    const json = await postHttp(getUrl() + 'customer_logout', {})

    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        await CookieManager.clearAll()
        th.setState({
          spinnerTemp: false
        })
        dispatch({
          type: REMOVE_USER,
          dispatch
        })

        dispatch({
          type: ADD_CART_PRODUCTS,
          payload: [],
          dispatch
        })
        dispatch({
          type: GET_WISHLIST_ARRAY,
          payload: [],
          dispatch
        })
        dispatch({
          type: REMOVE_SESSION_ID,
          dispatch
        })
        dispatch({
          type: CLEAR_CART_QUANTITY
        })
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      }
    } else if (json.status === 'error') {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
    th.setState({
      spinnerTemp: false
    })
  })
}

export function clearCartQuantity () {
  return {
    type: CLEAR_CART_QUANTITY
  }
}

export function allPrices (cartSubTotalFloat,
  cartDiscountFloat,
  cartShippingFloat,
  cartTaxFloat,
  cartTotalFloat) {
  return {
    type: SAVE_ALL_PRICES,
    cartSubTotalFloat: cartSubTotalFloat,
    cartDiscountFloat: cartDiscountFloat,
    cartShippingFloat: cartShippingFloat,
    cartTaxFloat: cartTaxFloat,
    cartTotalFloat: cartTotalFloat
  }
}

export function socialLogin (dispatch, url, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + url)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.setState({
          spinnerTemp: false,
          emailSignIn: '',
          passwordSignIn: ''
        }, () => { th.props.navigation.pop() })
        dispatch({
          type: REGISTER_USER,
          payload: json.data.data,
          dispatch
        })
        getCartProductsQuantity(dispatch, '', th,
          json.data.data, false)
        getWishlist(dispatch)
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }

    th.setState({
      spinnerTemp: false
    })
  })
}

export function signIn (dispatch, emailSignIn, passwordSignIn,
  sessionId, th) {
  dispatch(async dispatch => {
    const obj = {}
    obj.email = emailSignIn
    obj.password = passwordSignIn
    obj.session_id = sessionId
    const json = await postHttp(getUrl() + 'customer_login', obj)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.setState({
          spinnerTemp: false,
          emailSignIn: '',
          passwordSignIn: ''
        }, () => { th.props.navigation.pop() })
        dispatch({
          type: REGISTER_USER,
          payload: json.data.data,
          dispatch
        })
        getCartProductsQuantity(dispatch, '', th,
          json.data.data, false)
        getWishlist(dispatch)
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }

    th.setState({
      spinnerTemp: false
    })
  })
}

export function signUp (dispatch, firstNameSignUp,
  lastNameSignUp,
  emailSignUp,
  passwordSignUp,
  confirmPasswordSignUp,
  th,
  sessionId
) {
  dispatch(async dispatch => {
    const obj = {}
    obj.first_name = firstNameSignUp
    obj.last_name = lastNameSignUp
    obj.email = emailSignUp
    obj.password = passwordSignUp
    obj.confirm_password = confirmPasswordSignUp
    obj.status = '1'
    if (sessionId !== '') {
      obj.session_id = sessionId
    }

    const json = await postHttp(getUrl() + 'customer_register', obj)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.setState({
          spinnerTemp: false,
          firstNameSignUp: '',
          lastNameSignUp: '',
          emailSignUp: '',
          passwordSignUp: '',
          confirmPasswordSignUp: ''

        }, () => { th.props.navigation.pop() })
        dispatch({
          type: REGISTER_USER,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      }
    } else if (json.status === 'error') {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
  })
}

export function checkCouponAvalability (dispatch, value, th) {
  const obj = {}
  obj.coupon_code = value
  dispatch(async dispatch => {
    const json = await postHttp(getUrl() + 'coupon', obj)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.toast.show(th.props.language['Coupons Applied'])
        dispatch({
          type: ADD_COUPON,
          payload: json.data.data,
          couponText: value,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      }
    } else if (json.status === 'error') {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
  })
}

export function removeCoupon () {
  return {
    type: REMOVE_COUPON
  }
}

export function clearProducts () {
  return {
    type: CLEAR_LANGUAGES
  }
}

export function clearCurrences (value) {
  return {
    type: CLEAR_CURRENCY,
    value
  }
}

export function setCurrencyId (value) {
  return {
    type: SET_CURRENCY_ID,
    value
  }
}

export function clearLanguages (value) {
  return {
    type: CLEAR_LANGUAGES,
    value
  }
}

export function setLanguageId (value) {
  return {
    type: SET_LANGUAGE_ID,
    value
  }
}

export function getCartProducts (dispatch, sessionId, th) {
  dispatch(async dispatch => {
    let url
    if (Object.keys(store.getState().userData.user).length === 0) {
      url = 'cart/guest/get?session_id=' + sessionId
    } else {
      url = 'cart?'
    }
    url += 'language_id=' + th.props.settings.language_id
    url += '&currency=' + th.props.settings.currency_id
    const json = await getHttp(getUrl() + url, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        if (json.data.data !== null) { th.calculateFinalPrice(json.data.data) }
        // th.setState({ spinnerTemp: false })
        if (json.data.data !== null) {
          dispatch({
            type: ADD_CART_PRODUCTS,
            payload: json.data.data,
            dispatch
          })
        }
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getCartProductsQuantity (dispatch, sessionId, th, userDat, isProductDetailPage) {
  dispatch(async dispatch => {
    try {
      let url
      if (Object.keys(userDat).length === 0) {
        url = 'cart/guest/get?session_id=' + sessionId
      } else {
        url = 'cart?'
      }
      url += 'language_id=' + th.props.settings.language_id
      url += '&currency=' + th.props.settings.currency_id
      const json = await getHttp(getUrl() + url, {})
      if (json.status === 'success') {
        if (json.data.status === 'Success') {
          let total = 0
          json.data.data.forEach((value, index) => {
            const price = value.qty
            total += price
          })
          dispatch({
            type: ADD_CART_PRODUCTS,
            payload: json.data.data,
            dispatch
          })
          dispatch({
            type: ADD_CART_QUANTITY,
            payload: json.data.data.length,
            dispatch
          })
          if (isProductDetailPage) {
            th.setState({
              stockIndicator: false,
              isModalVisible: false,
              spinnerTemp: false
            }, () => {
            })
          }
        } else {
          th.toast.show(json.data.message)
        }
      } else {
        th.toast.show(json.data.data.message)
      }
    } catch (error) {
      th.setState({
        spinnerTemp: false
      })
    }
  })
}

export function deleteProductFromCart (dispatch, id, sessionId, combinationId,
  qty, th) {
  dispatch(async dispatch => {
    let url
    if (Object.keys(store.getState().userData.user).length === 0) {
      url = 'cart/guest/delete?session_id=' + sessionId + '&'
    } else {
      url = 'cart/delete?'
    }
    const data = {}
    data.product_id = id.toString()
    let url2
    if (combinationId !== undefined && combinationId !== null && combinationId !== '') {
      url2 = getUrl() + url +
        'product_id=' + data.product_id + '&product_combination_id=' + combinationId
    } else {
      url2 = getUrl() + url +
        'product_id=' + data.product_id
    }
    const json = await deleteHttp(url2)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.toast.show(json.data.message)
        getCartProducts(dispatch, sessionId, th)
        dispatch({
          type: REMOVE_CART_QUANTITY,
          payload: data.product_id,
          dispatch
        })
        if (Object.keys(store.getState().userData.user).length === 0) {
          getCartProductsQuantity(dispatch, sessionId, th, store.getState().userData.user, true)
        } else {
          getCartProductsQuantity(dispatch, '', th, store.getState().userData.user, true)
        }
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      }
    } else {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
  })
}

export async function checkProductStock (id, type, combinationId = null, quantity, th) {
  let url = 'available_qty'
  url += '?product_id=' + id
  if (combinationId != null) url += '&product_combination_id=' + combinationId
  url += '&product_type=' + type
  const json = await getHttp(getUrl() + url, {})
  if (json.status === 'success') {
    if (json.data.status === 'Success') {
      const stock = parseInt(json.data.data.remaining_stock)

      if (stock === 0) {
        return { status: 'outOfStock' }
      } else if (stock >= quantity) {
        return { status: 'canAddToCart' }
      } else if (stock < quantity) {
        return { status: 'quantityIsLimited', stock: stock }
      }
    } else {
      th.toast.show(json.data.message)
    }
  } else {
    th.toast.show(json.data.data.message)
  }
}

export async function addToCartFun (dispatch, id, quantity, combinationId, sessionId, th) {
  let url
  if (Object.keys(store.getState().userData.user).length === 0) {
    url = 'cart/guest/store?session_id=' + sessionId
  } else {
    url = 'cart?'
  }
  url += 'language_id=' + th.props.settings.language_id
  url += '&currency=' + th.props.settings.currency_id

  const data = {}
  data.product_id = id
  data.qty = quantity

  if (combinationId !== undefined && combinationId !== null && combinationId !== '') {
    data.product_combination_id = combinationId
  }

  const json = await postHttp(getUrl() + url, data)
  if (json.status === 'success') {
    if (json.data.status === 'Success') {
      th.toast.show(json.data.message)
      if (Object.keys(store.getState().userData.user).length === 0) {
        dispatch({
          type: SET_SESSION_ID,
          payload: json.data.data.session,
          dispatch
        })
        getCartProductsQuantity(dispatch, json.data.data.session, th, store.getState().userData.user, true)
      } else {
        getCartProductsQuantity(dispatch, '', th, store.getState().userData.user, true)
      }
    } else {
      th.toast.show(json.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
  } else if (json.status === 'error') {
    th.toast.show(json.data.data.message)
    th.setState({
      spinnerTemp: false
    })
  }
}

export function getLanguages (dispatch, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'language?page=1&limit=10', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_LANGUAGE,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getCurrency (dispatch, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'currency', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_CURRENCY,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}
const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('settings')
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
  }
}

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('settings', jsonValue)
  } catch (e) {
    // saving error
  }
}

export function getLanguageCodeFun (languageCode) {
  return {
    type: GET_CODE,
    value: languageCode
  }
}

export function firstSettingCallFun (dispatch, th) {
  dispatch(async dispatch => {
    const firstSettingCall = await getHttp(getUrl() + 'setting?app_setting=1', {})
    if (firstSettingCall.status === 'success') {
      if (firstSettingCall.data.status === 'Success') {
        const temp = {}
        for (var i = 0; i < firstSettingCall.data.data.length; i++) {
          if (firstSettingCall.data.data[i].setting_key === 'card_style') {
            temp[firstSettingCall.data.data[i].setting_key] = getIntergerFromString(firstSettingCall.data.data[i].setting_value)
          } else
          if (firstSettingCall.data.data[i].setting_key === 'banner_style') {
            temp[firstSettingCall.data.data[i].setting_key] = getIntergerFromString(firstSettingCall.data.data[i].setting_value)
          } else
          if (firstSettingCall.data.data[i].setting_key === 'home_style') {
            temp[firstSettingCall.data.data[i].setting_key] = getIntergerFromString(firstSettingCall.data.data[i].setting_value)
          } else
          if (firstSettingCall.data.data[i].setting_key === 'category_style') {
            temp[firstSettingCall.data.data[i].setting_key] = getIntergerFromString(firstSettingCall.data.data[i].setting_value)
          } else { temp[firstSettingCall.data.data[i].setting_key] = firstSettingCall.data.data[i].setting_value }
        }
        storeData(temp)
        getBanners(dispatch)
        getCategories(dispatch, temp.language_id)
        getProducts(dispatch, temp.language_id, temp.currency_id, 1)
        gethotProducts(dispatch, temp.language_id, temp.currency_id, 1)
        getonSaleProducts(dispatch, temp.language_id, temp.currency_id, 1)
        getfeaturedProducts(dispatch, temp.language_id, temp.currency_id, 1)
        gettopsellerProducts(dispatch, temp.language_id, temp.currency_id, 1)
        setCurrencyId(temp.currency_id)
        dispatch({
          type: GET_CODE,
          value: temp.language_code,
          dispatch
        })
        dispatch({
          type: SET_FIRST_SETTINGS,
          payload: temp,
          dispatch
        })
      } else {
        th.toast.show(firstSettingCall.data.message)
      }
    } else {
      th.toast.show(firstSettingCall.data.data.message)
    }
  })
}

export function settingCallFun (dispatch, settings, th) {
  dispatch(async dispatch => {
    getData().then(res => {
      dispatch({
        type: SET_SECOND_SETTINGS,
        payload: res,
        dispatch
      })
    })

    const firstSettingCall = await getHttp(getUrl() + 'setting?app_setting=1', {})
    if (firstSettingCall.status === 'success') {
      if (firstSettingCall.data.status === 'Success') {
        const temp = {}
        for (var i = 0; i < firstSettingCall.data.data.length; i++) {
          if (firstSettingCall.data.data[i].setting_key === 'card_style') {
            temp[firstSettingCall.data.data[i].setting_key] = getIntergerFromString(firstSettingCall.data.data[i].setting_value)
          } else
          if (firstSettingCall.data.data[i].setting_key === 'banner_style') {
            temp[firstSettingCall.data.data[i].setting_key] = getIntergerFromString(firstSettingCall.data.data[i].setting_value)
          } else
          if (firstSettingCall.data.data[i].setting_key === 'home_style') {
            temp[firstSettingCall.data.data[i].setting_key] = getIntergerFromString(firstSettingCall.data.data[i].setting_value)
          } else
          if (firstSettingCall.data.data[i].setting_key === 'category_style') {
            temp[firstSettingCall.data.data[i].setting_key] = getIntergerFromString(firstSettingCall.data.data[i].setting_value)
          } else { temp[firstSettingCall.data.data[i].setting_key] = firstSettingCall.data.data[i].setting_value }
        }
        storeData(temp)
      } else {
        th.toast.show(firstSettingCall.data.message)
      }
    } else {
      th.toast.show(firstSettingCall.data.data.message)
    }
  })
}

export function getIntergerFromString (value) {
  return (value).replace(/[^0-9]/g, '').toString()
}
export function getBanners (dispatch, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'banner?getBannerNavigation=1&getBannerMedia=1&limit=100&sortBy=title&sortType=DESC', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_BANNERS,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}
export function gettopsellerProducts (dispatch, languageId, currencyId, page, th) {
  dispatch(async dispatch => {
    let url = 'products'
    url += '?limit=' + 10
    url += '&getCategory=1'
    url += '&getDetail=1'
    url += '&language_id=' + languageId
    url += '&currency=' + currencyId
    url += '&stock=1'
    url += '&sortType=ASC'
    url += '&topSelling=1'

    const json = await getHttp(getUrl() + url, {})

    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_TOPSELLER_PRODUCTS,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}
export function getfeaturedProducts (dispatch, languageId, currencyId, page, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'products?limit=10&getCategory=1&getDetail=1&' +
      'language_id=' + languageId + '&currency=' + currencyId + '&stock=1&sortType=ASC' +
      '&isFeatured=1', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_FEATURED_PRODUCTS,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}
export function getonSaleProducts (dispatch, languageId, currencyId, page, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'products?limit=10&getCategory=1&getDetail=1&' +
      'language_id=' + languageId + '&currency=' + currencyId + '&stock=1&sortType=ASC' +
      '&sortBy=discount_price', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_ONSALE_PRODUCTS,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getProducts (dispatch, languageId, currencyId, page, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'products?limit=10&getCategory=1&getDetail=1&' +
      'language_id=' + languageId + '&currency=' + currencyId + '&stock=1&sortBy=id' +
      '&page=' + page, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_PRODUCTS,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function gethotProducts (dispatch, languageId, currencyId, page, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'products?limit=10&getCategory=1&getDetail=1&' +
      'language_id=' + languageId + '&currency=' + currencyId + '&stock=1&sortBy=id' +
      '&page=' + page, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_HOT_PRODUCTS,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getpdRelatedProducts (dispatch, languageId, currencyId, page, selectedItem, th) {
  dispatch(async dispatch => {
    let url
    if (selectedItem !== '' && selectedItem && selectedItem !== undefined &&
      selectedItem !== null) {
      url = 'products?limit=10&getCategory=1&getDetail=1&' +
        'language_id=' + languageId + '&currency=' + currencyId + '&stock=1&sortBy=id' +
        '&page=' + page + '&productCategories=' + selectedItem
    } else {
      url = 'products?limit=10&getCategory=1&getDetail=1&' +
        'language_id=' + languageId + '&currency=' + currencyId + '&stock=1&sortBy=id' +
        '&page=' + page
    }
    const json = await getHttp(getUrl() + url, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_DETAIL_PAGE_PRODUCTS,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getcartRelatedProducts (dispatch, languageId, currencyId, page, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'products?limit=10&getCategory=1&getDetail=1&' +
      'language_id=' + languageId + '&currency=' + currencyId + '&stock=1&sortBy=id' +
      '&page=' + page, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_CART_PAGE_PRODUCTS,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getCategories (dispatch, languageId, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'category?getDetail=1&page=1&limit=999&getMedia=1&' +
      'language_id=' + languageId + '&sortBy=id&sortType=ASC', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_CATEGORIES,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function getWishlist (dispatch, th) {
  dispatch(async dispatch => {
    const json = await getHttp(getUrl() + 'wishlist', {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        dispatch({
          type: GET_WISHLIST_ARRAY,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
      }
    } else {
      th.toast.show(json.data.data.message)
    }
  })
}

export function storeWishlist (dispatch, userData, productId, th) {
  dispatch(async dispatch => {
    const obj = {}
    obj.customer_id = userData.id
    obj.product_id = productId
    const json = await postHttp(getUrl() + 'wishlist', obj)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
        dispatch({
          type: GET_WISHLIST_ARRAY,
          payload: json.data.data,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      }
    } else if (json.status === 'error') {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
  })
}

export function removeWishlistFun (dispatch, userData, productId, th, wishListId) {
  dispatch(async dispatch => {
    const obj = {}
    obj.customer_id = userData.id
    obj.product_id = productId
    const json = await deleteHttp(getUrl() + 'wishlist/' + wishListId, obj)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        th.setState({
          spinnerTemp: false
        })
        th.toast.show(json.data.message)
        dispatch({
          type: GET_WISHLIST_ARRAY,
          payload: json.data.data,
          dispatch
        })
        dispatch({
          type: GET_WISHLIST_REMOVE_ID,
          removeProductId: productId,
          dispatch
        })
      } else {
        th.toast.show(json.data.message)
        th.setState({
          spinnerTemp: false
        })
      }
    } else {
      th.toast.show(json.data.data.message)
      th.setState({
        spinnerTemp: false
      })
    }
  })
}

export function removeWishlistProductId () {
  return {
    type: GET_WISHLIST_REMOVE_ID,
    removeProductId: ''
  }
}
export function setThemeColor (appLightTheme, appDarkTheme) {
  return {
    type: SET_THEME,
    appLightTheme,
    appDarkTheme
  }
}

export function setLanguageCode (value) {
  return {
    type: LANG_CODE,
    value
  }
}

export function introShowFun (value) {
  return {
    type: SHOW_INTRO,
    value
  }
}

export function setModeValue (value) {
  return {
    type: SET_MODE,
    isDarkMode: value
  }
}

export function addAddressValue (firstName,
  lastName,
  selectedCountry,
  selectedState,
  addressOne,
  addressTwo,
  zip,
  stateValue,
  city,
  email,
  phone,
  latLong) {
  return {
    type: ADD_ADDRESS,
    firstName: firstName,
    lastName: lastName,
    selectedCountry: selectedCountry,
    selectedState: selectedState,
    addressOne: addressOne,
    addressTwo: addressTwo,
    zip: zip,
    stateValue: stateValue,
    city: city,
    email: email,
    phone: phone,
    latLong: latLong
  }
}
