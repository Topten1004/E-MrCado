import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {
  counter: 0,
  isloading: true
}

function appConfig (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}

const persistConfig = {
  key: 'root123',
  storage: AsyncStorage,
  whitelist: ['counter'] // will be persisted
}
export default persistReducer(persistConfig, appConfig)
