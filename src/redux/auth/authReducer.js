import {
    FETCH_AUTH_REQUEST,
    FETCH_AUTH_SUCCESS,
    FETCH_AUTH_FAILURE
  } from './authTypes'
  
  const initialState = {
    loading: false,
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_AUTH_REQUEST:
        return {
          ...state,
          loading: true,
          error: action.payload
        }
      case FETCH_AUTH_SUCCESS:
        return {
          loading: false,
          error: ''
        }
      case FETCH_AUTH_FAILURE:
        return {
          loading: false,
          error: action.payload
        }
      default: return state
    }
  }
  
  export default reducer