import {
    FETCH_CORES_REQUEST,
    FETCH_CORES_SUCCESS,
    FETCH_CORES_FAILURE
  } from './coreTypes'
  
  const initialState = {
    loading: false,
    cores: [],
    lastUpdated: '',
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CORES_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_CORES_SUCCESS:
        return {
          loading: false,
          cores: action.payload,
          lastUpdated: action.lastUpdated,
          error: ''
        }
      case FETCH_CORES_FAILURE:
        return {
          loading: false,
          cores: [],
          error: action.payload
        }
      default: return state
    }
  }
  
  export default reducer