import axios from 'axios'
import {
  FETCH_LANDPADS_REQUEST,
  FETCH_LANDPADS_SUCCESS,
  FETCH_LANDPADS_FAILURE
} from './landpadTypes'

export const fetchLandpads = () => {
  return (dispatch) => {
    dispatch(fetchLandpadsRequest())
    axios
      .get('https://api.spacexdata.com/v4/landpads')
      .then(response => {
        // response.data is the users
        const landpads = response.data
        dispatch(fetchLandpadsSuccess(landpads))
      })
      .catch(error => {
        // error.message is the error message
        dispatch(fetchLandpadsFailure(error.message))
      })
  }
}

export const fetchLandpadsRequest = () => {
  return {
    type: FETCH_LANDPADS_REQUEST
  }
}

export const fetchLandpadsSuccess = landpads => {
  return {
    type: FETCH_LANDPADS_SUCCESS,
    payload: landpads
  }
}

export const fetchLandpadsFailure = error => {
  return {
    type: FETCH_LANDPADS_FAILURE,
    payload: error
  }
}