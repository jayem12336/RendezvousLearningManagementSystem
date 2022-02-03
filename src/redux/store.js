import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './reducers/userReducer';
import classReducer from './reducers/classReducer'

const initianState = {};
const middleware = [thunk];

const reducers = combineReducers({
    user: userReducer,
    classUser: classReducer
})

const composeEnhancer = typeof window == "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancer(applyMiddleware(...middleware));
const store = createStore(reducers, initianState, enhancer);

export default store;