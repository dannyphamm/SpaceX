import axios from 'axios'
import {
  FETCH_ROCKETS_REQUEST,
  FETCH_ROCKETS_SUCCESS,
  FETCH_ROCKETS_FAILURE
} from './rocketTypes'

export const fetchRockets = () => {
  return (dispatch) => {
    dispatch(fetchRocketsRequest())
    axios
      .get('https://api.spacexdata.com/v4/rockets')
      .then(response => {
        // response.data is the users
        const rockets = response.data
        dispatch(fetchRocketsSuccess(rockets))
      })
      .catch(error => {
        // error.message is the error message
        dispatch(fetchRocketsFailure(error.message))
      })
  }
}

export const fetchRocketsRequest = () => {
  return {
    type: FETCH_ROCKETS_REQUEST
  }
}

export const fetchRocketsSuccess = rockets => {
  return {
    type: FETCH_ROCKETS_SUCCESS,
    payload: rockets
  }
}

export const fetchRocketsFailure = error => {
  return {
    type: FETCH_ROCKETS_FAILURE,
    payload: error
  }
}