import * as actionTypes from '../types';

const initialState = {
    loading: false,
    currentUser: {},
    error: null
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                currentUser: action.payload
            };
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                currentUser: action.payload
            };
        case actionTypes.SET_USER:
            return {
                ...state,
                loading: false,
                currentUser: action.payload
            }
        case actionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                currentUser: null
            };
        default:
            return state;
    }
}

export default userReducer;