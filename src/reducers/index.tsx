import { combineReducers } from 'redux'
import launchpads from './launchpads'
import upcoming from './upcoming'
import past from './past'
export default combineReducers({
    launchpads,
    upcoming,
    past
})