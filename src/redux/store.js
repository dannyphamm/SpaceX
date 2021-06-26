import {createStore, applyMiddleware} from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'
import logger from 'redux-logger'

function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch(e) {
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state');
        if(serializedState == null) return undefined;
        return JSON.parse(serializedState);
    } catch(e) {
        return undefined;
    }
}

const persistedState = loadFromLocalStorage();
const store = createStore(rootReducer, persistedState, composeWithDevTools(applyMiddleware(thunk, logger)));

store.subscribe(() => saveToLocalStorage(store.getState()));
export default store;