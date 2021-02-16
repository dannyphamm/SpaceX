import {
    FETCH_ROCKETS_REQUEST,
    FETCH_ROCKETS_SUCCESS,
    FETCH_ROCKETS_FAILURE
  } from './rocketTypes'
  
  const initialState = {
    loading: false,
    rockets: [],
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ROCKETS_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_ROCKETS_SUCCESS:
        return {
          loading: false,
          rockets: action.payload,
          error: ''
        }
      case FETCH_ROCKETS_FAILURE:
        return {
          loading: false,
          rockets: [],
          error: action.payload
        }
      default: return state
    }
  }
  
  export default reducer