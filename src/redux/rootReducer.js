  
import { combineReducers } from 'redux'
import upcomingReducer from './upcoming/upcomingReducer'
import launchpadReducer from './launchpad/launchpadReducer'
import pastReducer from './past/pastReducer'
const rootReducer = combineReducers({
  upcoming: upcomingReducer,
  launchpads: launchpadReducer,
  past: pastReducer
})

export default rootReducer