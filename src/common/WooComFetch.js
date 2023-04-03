import axios from 'axios'
import theme from './Theme.style'
import { store } from '../redux/store/index'

export const getHeaders = () => {
  let headers = {
    'Content-Type': 'application/json',
    clientid: theme.clientid,
    clientsecret: theme.clientsecret
  }
  if (Object.keys(store.getState().userData.user).length > 0) {
    const Authorization = 'Bearer ' + store.getState().userData.user.token
    headers = Object.assign({ Authorization: Authorization }, headers)
  }
  return { headers: headers }
}

export const postHttp = async (url, body) => {
  const returnObject = {}
  try {
    const res = await axios.post(url, body, getHeaders())
    returnObject.status = 'success'
    returnObject.data = res.data
    console.log('\n', JSON.stringify(res, null, 2))
    return returnObject
  } catch (err) {
    returnObject.status = 'error'
    returnObject.data = err.response
    return returnObject
  }
}

export const putHttp = async (url, body) => {
  const returnObject = {}
  try {
    const res = await axios.put(url, body, getHeaders())
    returnObject.status = 'success'
    console.log('\n', JSON.stringify(res, null, 2))
    returnObject.data = res.data
    return returnObject
  } catch (err) {
    console.log('\n', JSON.stringify(res, null, 2))
    returnObject.status = 'error'
    returnObject.data = err.response
    return returnObject
  }
}

export const deleteHttp = async (url, body) => {
  const returnObject = {}
  try {
    const res = await axios.delete(url, getHeaders())
    returnObject.status = 'success'
    returnObject.data = res.data
    return returnObject
  } catch (err) {
    returnObject.status = 'error'
    returnObject.data = err.response
    return returnObject
  }
}

// Get Request
export const getHttp = async (url, body) => {
  const returnObject = {}
  try {
    const res = await axios.get(url, getHeaders())
    returnObject.status = 'success'
    returnObject.data = res.data
    console.log('\n', JSON.stringify(res, null, 2))
    return returnObject
  } catch (err) {
    returnObject.status = 'error'
    console.log('\n', JSON.stringify(res, null, 2))
    returnObject.data = err.response
    return returnObject
  }
}

// Get Request
export const getUrl = () => {
  if (theme.url.startsWith('https')) {
    return theme.url + '/api/client/'
  } else {
    return theme.url.replace('http', 'https') + '/api/client/'
  }
}

// Get Request
export const getUrlWithOutApiClient = () => {
  if (theme.url.startsWith('https')) {
    return theme.url
  } else {
    return theme.url.replace('http', 'https')
  }
}

// Get Request
export const getUrlForImage = () => {
  if (theme.url.startsWith('https')) {
    return theme.url
  } else {
    return theme.url.replace('http', 'https')
  }
}

// Get Thumbnail Request
export const getThumbnailImage = () => {
  return getUrlForImage() + '/gallary/thumbnail'
}
// Get medium Request
export const getMediumImage = () => {
  return getUrlForImage() + '/gallary/medium'
}
// Get large Request
export const getLargeImage = () => {
  return getUrlForImage() + '/gallary/large'
}
