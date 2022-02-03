import * as actionTypes from '../types';

const initialState = {
    loading: false,
    classData: {},
    error: null
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_CLASSROOM:
            return {
                ...state,
                loading: false,
                classData: action.payload
            };
        default:
            return state;
    }
}

export default userReducer;