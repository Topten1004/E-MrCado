import {
  CLEAR_PRODUCTS,
  GET_PRODUCTS,
  GET_DETAIL_PAGE_PRODUCTS,
  GET_CART_PAGE_PRODUCTS,
  GET_HOT_PRODUCTS,
  CLEAR_HOT_PRODUCTS,
  CLEAR_DETAIL_PAGE_PRODUCTS,
  CLEAR_CART_PAGE_PRODUCTS,

  GET_TOPSELLER_PRODUCTS,
  CLEAR_TOPSELLER_PRODUCTS,

  GET_FEATURED_PRODUCTS,
  CLEAR_FEATURED_PRODUCTS,

  GET_ONSALE_PRODUCTS,
  CLEAR_ONSALE_PRODUCTS

} from '../actions/actions'

import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
const initialState = {
  products: [],
  hotProducts: [],
  pdRelatedProducts: [],
  cartRelatedProducts: [],
  topsellerProducts: [],
  featuredProducts: [],
  onSaleProducts: []

}

function productsCall (state = initialState, action) {
  switch (action.type) {
    case GET_TOPSELLER_PRODUCTS:
      action.payload.forEach(element => {
        state.topsellerProducts = [...state.topsellerProducts, element]
      })
      return { ...state }

    case CLEAR_TOPSELLER_PRODUCTS:
      state.topsellerProducts = []
      return { ...state }

    case GET_FEATURED_PRODUCTS:
      action.payload.forEach(element => {
        state.featuredProducts = [...state.featuredProducts, element]
      })
      return { ...state }

    case CLEAR_FEATURED_PRODUCTS:
      state.featuredProducts = []
      return { ...state }

    case GET_ONSALE_PRODUCTS:
      action.payload.forEach(element => {
        state.onSaleProducts = [...state.onSaleProducts, element]
      })
      return { ...state }

    case CLEAR_ONSALE_PRODUCTS:
      state.onSaleProducts = []
      return { ...state }

    case GET_PRODUCTS:
      action.payload.forEach(element => {
        state.products = [...state.products, element]
      })
      return { ...state }

    case CLEAR_PRODUCTS:
      state.products = []
      return { ...state }

    case GET_DETAIL_PAGE_PRODUCTS:
      action.payload.forEach(element => {
        state.pdRelatedProducts = [...state.pdRelatedProducts, element]
      })
      return { ...state }

    case CLEAR_DETAIL_PAGE_PRODUCTS:
      state.pdRelatedProducts = []
      return { ...state }

    case GET_CART_PAGE_PRODUCTS:
      action.payload.forEach(element => {
        state.cartRelatedProducts = [...state.cartRelatedProducts, element]
      })
      return { ...state }

    case CLEAR_CART_PAGE_PRODUCTS:
      state.cartRelatedProducts = []
      return { ...state }

    case GET_HOT_PRODUCTS:
      action.payload.forEach(element => {
        state.hotProducts = [...state.hotProducts, element]
      })
      return { ...state }

    case CLEAR_HOT_PRODUCTS:
      state.hotProducts = []
      return { ...state }

    default:
      return state
  }
}

const persistConfig = {
  key: 'productsCall',
  storage: AsyncStorage,
  blacklist: [
    'products', 'hotProducts', 'pdRelatedProducts', 'cartRelatedProducts',
    'topsellerProducts', 'featuredProducts', 'onSaleProducts'] // will be persisted
}

export default persistReducer(persistConfig, productsCall)
