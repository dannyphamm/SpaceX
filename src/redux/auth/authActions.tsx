import { deleteUser, getAuth, signInAnonymously} from 'firebase/auth';
import {
  FETCH_AUTH_REQUEST,
  FETCH_AUTH_SUCCESS,
  FETCH_AUTH_FAILURE
} from './authTypes'

export const enterAuth = () => {
  const auth = getAuth()

  return async (dispatch) => {
    dispatch(fetchAuthRequest("CREATE"))
    signInAnonymously(auth).then((user) => {
      dispatch(fetchAuthSuccess("CREATED"))
    }).catch(error => {
      dispatch(fetchAuthFailure(error.message))
    })
  }
}
export const exitAuth = () => {
  const auth = getAuth()

  return async (dispatch) => {
    dispatch(fetchAuthRequest("DELETE"))
    const authUser = auth.currentUser;
    if (authUser) {
      deleteUser(authUser).then(() => {
        dispatch(fetchAuthSuccess("EXITED"))
      }).catch(error => {
        dispatch(fetchAuthFailure(error.message))
      })
    }
  }
}
export const fetchAuthRequest = (msg) => {
  return {
    type: FETCH_AUTH_REQUEST,
    payload: msg
  }
}

export const fetchAuthSuccess = (error) => {
  return {
    type: FETCH_AUTH_SUCCESS,
    payload: error
  }
}

export const fetchAuthFailure = error => {
  return {
    type: FETCH_AUTH_FAILURE,
    payload: error
  }
}