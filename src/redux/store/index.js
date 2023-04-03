import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as network, createNetworkMiddleware } from 'react-native-offline'
import thunk from 'redux-thunk'
import reducers from '../reducers/reducers'
import settingsCall from '../reducers/settingsCall'
import appConfig from '../reducers/appConfig'
import bannersData from '../reducers/bannersData'
import getCategories from '../reducers/getCategories'
import productsData from '../reducers/productsData'
import languagesData from '../reducers/languagesData'
import currencyData from '../reducers/currencyData'
import userData from '../reducers/userData'
import cartData from '../reducers/cartData'
import wishlistData from '../reducers/wishlistData'
import shippingAddress from '../reducers/shippingAddress'
import searchData from '../reducers/searchData'
import { persistStore } from 'redux-persist'
const middlewares = [thunk]
const networkMiddleware = createNetworkMiddleware({
  queueReleaseThrottle: 200
})
const Cr = combineReducers({
  appConfig,
  reducers,
  network,
  settingsCall,
  bannersData,
  getCategories,
  languagesData,
  productsData,
  currencyData,
  userData,
  cartData,
  shippingAddress,
  wishlistData,
  searchData
})

const store = createStore(Cr,
  applyMiddleware(networkMiddleware, ...middlewares))
const persistor = persistStore(store)
export { store, persistor }
