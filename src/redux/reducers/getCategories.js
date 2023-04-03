import {
  GET_CATEGORIES
} from '../actions/actions'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
const initialState = {
  categories: [],
  sortCategory: []
}

function categoriesCall (state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      state.categories = action.payload
      for (const value of action.payload) {
        if (value.parent == null) { state.sortCategory.push(value) }
      }
      return { ...state }
    default:
      return state
  }
}

const persistConfig = {
  key: 'categoriesCall',
  storage: AsyncStorage,
  blacklist: ['categories', 'sortCategory'] // will be persisted
}
export default persistReducer(persistConfig, categoriesCall)
