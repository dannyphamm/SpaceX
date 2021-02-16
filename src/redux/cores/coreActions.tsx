import axios from 'axios'
import {
  FETCH_CORES_REQUEST,
  FETCH_CORES_SUCCESS,
  FETCH_CORES_FAILURE
} from './coreTypes'

export const fetchCores = () => {
  return (dispatch) => {
    dispatch(fetchCoresRequest())
    axios
      .get('https://api.spacexdata.com/v4/cores')
      .then(response => {
        // response.data is the users
        const cores = response.data
        dispatch(fetchCoresSuccess(cores))
      })
      .catch(error => {
        // error.message is the error message
        dispatch(fetchCoresFailure(error.message))
      })
  }
}

export const fetchCoresRequest = () => {
  return {
    type: FETCH_CORES_REQUEST
  }
}

export const fetchCoresSuccess = cores => {
  return {
    type: FETCH_CORES_SUCCESS,
    payload: cores
  }
}

export const fetchCoresFailure = error => {
  return {
    type: FETCH_CORES_FAILURE,
    payload: error
  }
}