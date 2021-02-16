import axios from 'axios'
import {
  FETCH_PAST_REQUEST,
  FETCH_PAST_SUCCESS,
  FETCH_PAST_FAILURE
} from './pastTypes'

function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
  return new Date(b.date_unix).getTime() - new Date(a.date_unix).getTime();
}

export const fetchPast = () => {
  return (dispatch) => {
    dispatch(fetchPastRequest())
    axios
      .get('https://api.spacexdata.com/v4/launches/past')
      .then(response => {
        // response.data is the users
        const past = response.data.sort(comp)
        dispatch(fetchPastSuccess(past))
      })
      .catch(error => {
        // error.message is the error message
        dispatch(fetchPastFailure(error.message))
      })
  }
}

export const fetchPastRequest = () => {
  return {
    type: FETCH_PAST_REQUEST
  }
}

export const fetchPastSuccess = past => {
  return {
    type: FETCH_PAST_SUCCESS,
    payload: past
  }
}

export const fetchPastFailure = error => {
  return {
    type: FETCH_PAST_FAILURE,
    payload: error
  }
}