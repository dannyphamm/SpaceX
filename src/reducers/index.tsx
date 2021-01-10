import { combineReducers } from 'redux'
import launchpads from './launchpads'
import upcoming from './upcoming'
import rockets from './rockets'
import cores from './cores'
import past from './past'
export default combineReducers({
    launchpads,
    upcoming,
    past,
    rockets,
    cores,
})