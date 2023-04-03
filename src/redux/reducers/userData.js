import {
  REMOVE_SESSION_ID,
  REMOVE_USER,
  REGISTER_USER,
  SET_SESSION_ID
} from '../actions/actions'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
const initialState = {
  sessionId: '',
  user: {}
}

function userData (state = initialState, action) {
  switch (action.type) {
    case SET_SESSION_ID:
      state.sessionId = action.payload
      return { ...state }

    case REMOVE_SESSION_ID:
      state.sessionId = ''

      return { ...state }

    case REGISTER_USER:
      state.user = action.payload
      return { ...state }
    case REMOVE_USER:
      state.user = {}
      return { ...state }
    default:
      return state
  }
}

const persistConfig = {
  key: 'userData',
  storage: AsyncStorage,
  blacklist: [
    'sessionId']
}
export default persistReducer(persistConfig, userData)
