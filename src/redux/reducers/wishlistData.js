import {
  GET_WISHLIST_ARRAY,
  GET_WISHLIST_REMOVE_ID
} from '../actions/actions'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
const initialState = {
  wishlistArray: [],
  removeProductId: ''
}

function wishlistArrayCall (state = initialState, action) {
  switch (action.type) {
    case GET_WISHLIST_ARRAY:
      state.wishlistArray = action.payload
      return { ...state }
    case GET_WISHLIST_REMOVE_ID:
      state.removeProductId = action.removeProductId
      return { ...state }
    default:
      return state
  }
}

const persistConfig = {
  key: 'wishlistArrayCall',
  storage: AsyncStorage,
  blacklist: ['wishlistArray', 'removeProductId'] // will be persisted
}
export default persistReducer(persistConfig, wishlistArrayCall)
