import {
  SET_CURRENCY_ID,
  SET_FIRST_SETTINGS,
  SET_LANGUAGE_ID,
  SET_BANNER_STYLE,
  SET_CARD_STYLE,
  SET_HOME_STYLE,
  SET_CATEGORY_STYLE,
  SET_SECOND_SETTINGS
} from '../actions/actions'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
const initialState = {
  settings: {}
}

function settingsCall (state = initialState, action) {
  switch (action.type) {
    case SET_FIRST_SETTINGS:
      state.settings = action.payload
      return { ...state }
    case SET_SECOND_SETTINGS:
      state.settings = {
        ...state.settings,
        app_name: action.payload.app_name,
        banner_style: action.payload.banner_style,
        card_style: action.payload.card_style,
        category_style: action.payload.category_style,
        currency_decimals: action.payload.currency_decimals,
        email_login: action.payload.email_login,
        facebook_login: action.payload.facebook_login,
        google_login: action.payload.google_login,
        home_style: action.payload.home_style,
        inventory: action.payload.inventory,
        ios_app_url: action.payload.ios_app_url,
        phone_login: action.payload.phone_login,
        language_code: action.payload.language_code
      }
      return { ...state }
    case SET_LANGUAGE_ID:
      state.settings = { ...state.settings, language_id: action.value }
      return { ...state }
    case SET_CURRENCY_ID:
      state.settings = {
        ...state.settings,
        currency_id: action.value,
        currency_decimals: action.currencyDecimals,
        currency_symbol: action.currencySymbol,
        currency_pos: action.currencyPos,
        currency_code: action.currencyCode
      }
      return { ...state }

    case SET_BANNER_STYLE:
      state.settings = { ...state.settings, banner_style: action.payload }
      return { ...state }

    case SET_CARD_STYLE:
      state.settings = { ...state.settings, card_style: action.payload }
      return { ...state }

    case SET_HOME_STYLE:
      state.settings = { ...state.settings, home_style: action.payload }
      return { ...state }

    case SET_CATEGORY_STYLE:
      state.settings = { ...state.settings, category_style: action.payload }
      return { ...state }

    default:
      return state
  }
}

const persistConfig = {
  key: 'settingsCall',
  storage: AsyncStorage,
  whitelist: [
    'settings'] // will be persisted
}
export default persistReducer(persistConfig, settingsCall)
