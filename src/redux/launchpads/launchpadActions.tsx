import axios from 'axios'
import {
  FETCH_LAUNCHPADS_REQUEST,
  FETCH_LAUNCHPADS_SUCCESS,
  FETCH_LAUNCHPADS_FAILURE
} from './launchpadTypes'

export const fetchLaunchpads = () => {
  return (dispatch) => {
    dispatch(fetchLaunchpadsRequest())
    axios
      .get('https://api.spacexdata.com/v4/launchpads')
      .then(response => {
        // response.data is the users
        const launchpads = response.data
        dispatch(fetchLaunchpadsSuccess(launchpads))
      })
      .catch(error => {
        // error.message is the error message
        dispatch(fetchLaunchpadsFailure(error.message))
      })
  }
}

export const fetchLaunchpadsRequest = () => {
  return {
    type: FETCH_LAUNCHPADS_REQUEST
  }
}

export const fetchLaunchpadsSuccess = launchpads => {
  return {
    type: FETCH_LAUNCHPADS_SUCCESS,
    payload: launchpads
  }
}

export const fetchLaunchpadsFailure = error => {
  return {
    type: FETCH_LAUNCHPADS_FAILURE,
    payload: error
  }
}