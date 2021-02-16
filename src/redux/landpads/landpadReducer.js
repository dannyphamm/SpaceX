import {
    FETCH_LANDPADS_REQUEST,
    FETCH_LANDPADS_SUCCESS,
    FETCH_LANDPADS_FAILURE
  } from './landpadTypes'
  
  const initialState = {
    loading: false,
    landpads: [],
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_LANDPADS_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_LANDPADS_SUCCESS:
        return {
          loading: false,
          landpads: action.payload,
          error: ''
        }
      case FETCH_LANDPADS_FAILURE:
        return {
          loading: false,
          landpads: [],
          error: action.payload
        }
      default: return state
    }
  }
  
  export default reducer