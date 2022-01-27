  
import { combineReducers } from 'redux'
 import upcomingReducer from './upcoming/upcomingReducer'
import launchpadReducer from './launchpads/launchpadReducer'
import pastReducer from './past/pastReducer'
import payloadReducer from './payloads/payloadReducer'
import rocketReducer from './rockets/rocketReducer'
import coreReducer from './cores/coreReducer'
import landpadReducer from './landpads/landpadReducer'
import starshipReducer from './starship/starshipReducer'
const rootReducer = combineReducers({
  upcoming: upcomingReducer,
  launchpads: launchpadReducer,
  past: pastReducer,
  payloads: payloadReducer,
  rockets: rocketReducer,
  cores: coreReducer,
  landpads: landpadReducer,
  starship: starshipReducer,
})

export default rootReducer