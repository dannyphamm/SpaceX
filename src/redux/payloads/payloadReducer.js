import {
    FETCH_PAYLOADS_REQUEST,
    FETCH_PAYLOADS_SUCCESS,
    FETCH_PAYLOADS_FAILURE
  } from './payloadTypes'
  
  const initialState = {
    loading: false,
    payloads: [],
    lastUpdated: '',
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_PAYLOADS_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_PAYLOADS_SUCCESS:
        return {
          loading: false,
          payloads: action.payloads,
          lastUpdated: action.lastUpdate,
          error: ''
        }
      case FETCH_PAYLOADS_FAILURE:
        return {
          loading: false,
          payloads: [],
          error: action.payloads
        }
      default: return state
    }
  }
  
  export default reducer