import {
    FETCH_STARSHIP_REQUEST,
    FETCH_STARSHIP_SUCCESS,
    FETCH_STARSHIP_FAILURE
  } from './starshipTypes'
  
  const initialState = {
    loading: false,
    starship: {
      combined: [],
      upcoming: [],
      previous: [],
    },
    lastUpdated: '',
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_STARSHIP_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_STARSHIP_SUCCESS:
        return {
          loading: false,
          starship: {
            combined: action.combined,
            upcoming: action.upcoming,
            previous: action.previous,
          },
          lastUpdated: action.lastUpdated,
          error: ''
        }
      case FETCH_STARSHIP_FAILURE:
        return {
          loading: false,
          starship: [],
          error: action.payload
        }
      default: return state
    }
  }
  
  export default reducer