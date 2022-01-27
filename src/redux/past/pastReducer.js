import {
    FETCH_PAST_REQUEST,
    FETCH_PAST_SUCCESS,
    FETCH_PAST_FAILURE
  } from './pastTypes'
  
  const initialState = {
    loading: false,
    past: [],
    lastUpdated: '',
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_PAST_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_PAST_SUCCESS:
        return {
          loading: false,
          past: action.payload,
          lastUpdated: action.lastUpdate,
          error: ''
        }
      case FETCH_PAST_FAILURE:
        return {
          loading: false,
          past: [],
          error: action.payload
        }
      default: return state
    }
  }
  
  export default reducer