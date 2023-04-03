import {
  REMOVE_CART_QUANTITY,
  ADD_CART_PRODUCTS,
  ADD_CART_QUANTITY,
  ADD_COUPON,
  CLEAR_CART_QUANTITY,
  SAVE_ALL_PRICES,
  DEL_COUPON
} from '../actions/actions'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
const initialState = {
  cartProductsArray: [],
  cartQuantity: 0,
  coupon: {},
  cartSubTotalFloat: 0,
  cartDiscountFloat: 0,
  cartShippingFloat: 0,
  cartTaxFloat: 0,
  cartTotalFloat: 0,
  couponText: ''
}

function cartData (state = initialState, action) {
  switch (action.type) {
    case ADD_CART_PRODUCTS:
      state.cartProductsArray = action.payload
      return { ...state }

    case ADD_CART_QUANTITY:
      state.cartQuantity = action.payload

      return { ...state }

    case SAVE_ALL_PRICES:
      state.cartSubTotalFloat = action.cartSubTotalFloat
      state.cartDiscountFloat = action.cartDiscountFloat
      state.cartShippingFloat = action.cartShippingFloat
      state.cartTaxFloat = action.cartTaxFloat
      state.cartTotalFloat = action.cartTotalFloat

      return { ...state }

    case CLEAR_CART_QUANTITY:
      state.cartQuantity = 0
      return { ...state }

    case ADD_COUPON:
      state.coupon = action.payload
      state.couponText = action.couponText
      return { ...state }

    case DEL_COUPON:
      state.coupon = {}
      state.couponText = ''
      return { ...state }

    case REMOVE_CART_QUANTITY:
      state.cartProductsArray = state.cartProductsArray.filter(
        cartItem => Number(cartItem.product_id) !== Number(action.payload)
      )
      return {
        ...state
      }
    default:
      return state
  }
}

const persistConfig = {
  key: 'cartData',
  storage: AsyncStorage,
  blacklist: [
    'cartProductsArray', 'cartQuantity', 'coupon'] // will be persisted
}
export default persistReducer(persistConfig, cartData)
