import {
  ADD_ADDRESS
} from '../actions/actions'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
const initialState = {
  addressData: {}
}

function shippingAddressData (state = initialState, action) {
  switch (action.type) {
    case ADD_ADDRESS:
      state.addressData = {
        ...state.addressData,
        delivery_first_name: action.firstName,
        delivery_last_name: action.lastName,
        delivery_country: action.selectedCountry.country_id,
        delivery_country_name: action.selectedCountry.country_name,
        delivery_street_aadress: action.addressOne,
        delivery_postcode: action.zip,
        delivery_state: action.selectedState.id,
        delivery_state_name: action.selectedState.name,
        delivery_city: action.city,
        delivery_phone: action.phone,
        billing_first_name: action.firstName,
        billing_last_name: action.lastName,
        billing_country: action.selectedCountry.country_id,
        billing_country_name: action.selectedCountry.country_name,
        billing_street_aadress: action.addressOne,
        billing_postcode: action.zip,
        billing_state: action.selectedState.id,
        billing_state_name: action.selectedState.name,
        billing_city: action.city,
        billing_phone: action.phone,
        latlong: action.latLong
      }
      return {
        ...state
      }

    default:
      return state
  }
}

const persistConfig = {
  key: 'shippingAddressData',
  storage: AsyncStorage,
  blacklist: [
    'addressData'] // will be persisted
}
export default persistReducer(persistConfig, shippingAddressData)
