import axios from 'axios'
import {
  FETCH_UPCOMING_REQUEST,
  FETCH_UPCOMING_SUCCESS,
  FETCH_UPCOMING_FAILURE
} from './upcomingTypes'

export const fetchUpcoming = () => {
  return (dispatch) => {
    dispatch(fetchUpcomingRequest())
    axios
      .get('https://api.spacexdata.com/v4/launches/upcoming')
      .then(response => {
        // response.data is the users
        const upcoming = response.data
        dispatch(fetchUpcomingSuccess(upcoming))
      })
      .catch(error => {
        // error.message is the error message
        dispatch(fetchUpcomingFailure(error.message))
      })
  }
}

export const fetchUpcomingRequest = () => {
  return {
    type: FETCH_UPCOMING_REQUEST
  }
}

export const fetchUpcomingSuccess = upcoming => {
  return {
    type: FETCH_UPCOMING_SUCCESS,
    payload: upcoming
  }
}

export const fetchUpcomingFailure = error => {
  return {
    type: FETCH_UPCOMING_FAILURE,
    payload: error
  }
}