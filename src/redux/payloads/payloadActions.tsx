import axios from 'axios'
import {
  FETCH_PAYLOADS_REQUEST,
  FETCH_PAYLOADS_SUCCESS,
  FETCH_PAYLOADS_FAILURE
} from './payloadTypes'

export const fetchPayloads = () => {
  return (dispatch) => {
    dispatch(fetchPayloadsRequest())
    axios
      .get('https://api.spacexdata.com/v4/payloads')
      .then(response => {
        // response.data is the users
        const payloads = response.data
        dispatch(fetchPayloadsSuccess(payloads))
      })
      .catch(error => {
        // error.message is the error message
        dispatch(fetchPayloadsFailure(error.message))
      })
  }
}

export const fetchPayloadsRequest = () => {
  return {
    type: FETCH_PAYLOADS_REQUEST
  }
}

export const fetchPayloadsSuccess = payloads => {
  return {
    type: FETCH_PAYLOADS_SUCCESS,
    payloads: payloads
  }
}

export const fetchPayloadsFailure = error => {
  return {
    type: FETCH_PAYLOADS_FAILURE,
    payloads: error
  }
}