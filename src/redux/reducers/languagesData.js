import {
  GET_LANGUAGE,
  SET_LANGUAGE,
  CLEAR_LANGUAGES
} from '../actions/actions'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import config from '../../common/Theme.style'
const initialState = {
  languages: [],
  selectedlang: {}
}

function languagesCall (state = initialState, action) {
  switch (action.type) {
    case GET_LANGUAGE:
      state.languages = action.payload
      return { ...state }

    case SET_LANGUAGE:
      state.selectedlang = action.payload
      return { ...state }

    case CLEAR_LANGUAGES:
      state.languages = []
      return { ...state }
    default:
      return state
  }
}

const persistConfig = {
  key: 'languagesCall',
  storage: AsyncStorage,
  whitelist: [
    'selectedlang'], // will be persisted
  blacklist: ['languages']
}
export default persistReducer(persistConfig, languagesCall)
