import {
  LANG_CODE,
  SET_MODE,
  SET_THEME,
  SHOW_INTRO,
  GET_CODE
} from '../actions/actions'
import * as global from '../../common/GlobalLanguageJson'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import themeStyle, { appTextStyle, appDarkTheme, appLightTheme } from '../../common/Theme.style'
const initialState = {
  counter: 0,
  isloading: true,
  themeStyle: appTextStyle.isDarkMode ? appDarkTheme : appLightTheme,
  appTextStyle: appTextStyle,
  appDarkTheme: appDarkTheme,
  appLightTheme: appLightTheme,
  isDarkMode: appTextStyle.isDarkMode,
  showIntro: true,
  languageCode: '',
  languageJson: '',
  appInProduction: themeStyle.appInProduction
}

function appConfig (state = initialState, action) {
  switch (action.type) {
    case LANG_CODE:
      state.languageCode = action.value.toUpperCase()
      state.languageJson = global.getLanguage(state.languageCode)
      return { ...state }

    case GET_CODE:
      state.languageCode = action.value.toUpperCase()
      state.languageJson = global.getLanguage(action.value.toUpperCase())
      return { ...state }

    case SHOW_INTRO:
      state.showIntro = action.value
      return { ...state }

    case SET_THEME:

      state.appDarkTheme = action.appDarkTheme
      state.appLightTheme = action.appLightTheme
      if (state.isDarkMode) {
        state.themeStyle = action.appDarkTheme
      } else {
        state.themeStyle = action.appLightTheme
      }
      return { ...state }

    case SET_MODE:
      state.isDarkMode = action.isDarkMode
      if (state.isDarkMode) {
        state.themeStyle = state.appDarkTheme
      } else {
        state.themeStyle = state.appLightTheme
      }
      return { ...state }

    default:
      return state
  }
}

const persistConfig = {
  key: 'config',
  storage: AsyncStorage,
  whitelist: [
    'themeStyle',
    'appTextStyle',
    'appDarkTheme',
    'appLightTheme',
    'isDarkMode',
    'showIntro', 'languageCode'], // will be persisted
  blacklist: ['languageJson']
}
export default persistReducer(persistConfig, appConfig)
