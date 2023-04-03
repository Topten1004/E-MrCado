import {
  ADD_SEARCH_TEXT,
  REMOVE_SEARCH_TEXT
} from '../actions/actions'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
const initialState = {
  recentSearch: []
}

function searchData (state = initialState, action) {
  switch (action.type) {
    case ADD_SEARCH_TEXT:
      if (!state.recentSearch.includes(action.value)) { state.recentSearch = [...state.recentSearch, action.value] }
      return { ...state }

    case REMOVE_SEARCH_TEXT:
      state.recentSearch = []
      return { ...state }
    default:
      return state
  }
}

const persistConfig = {
  key: 'searchData',
  storage: AsyncStorage,
  whitelist: [
    'recentSearch'] // will be persisted
}
export default persistReducer(persistConfig, searchData)
