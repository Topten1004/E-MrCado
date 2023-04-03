import {
  GET_BANNERS
} from '../actions/actions'
const initialState = {
  banners: []
}

const bannersCall = (state = initialState, action) => {
  switch (action.type) {
    case GET_BANNERS:
      state.banners = action.payload
      return { ...state }
    default:
      return state
  }
}

export default bannersCall
