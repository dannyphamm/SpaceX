import {
    FETCH_LAUNCHPADS_REQUEST,
    FETCH_LAUNCHPADS_SUCCESS,
    FETCH_LAUNCHPADS_FAILURE
  } from './launchpadTypes'
  
  const initialState = {
    loading: false,
    launchpads: [],
    lastUpdated: '',
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_LAUNCHPADS_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_LAUNCHPADS_SUCCESS:
        return {
          loading: false,
          launchpads: action.payload,
          lastUpdated: action.lastUpdated,
          error: ''
        }
      case FETCH_LAUNCHPADS_FAILURE:
        return {
          loading: false,
          launchpads: [],
          error: action.payload
        }
      default: return state
    }
  }
  
  export default reducer