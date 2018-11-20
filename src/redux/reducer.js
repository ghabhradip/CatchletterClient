import { combineReducers } from 'redux';

function userAuth(state = {}, action) {
    switch (action.type) {
        case 'USER_SIGNUP':
            return { ...state, ['userData']: [action.userData] }
        case 'USER_LOGIN':
            return { ...state, ['userData']: [action.userData] }
        default: return state
    }
}

function userImage(state = {}, action) {
    switch (action.type) {
        case 'USER_IMAGE':
            return { ...state, ['userImage']: action.userImage }
        default: return state
    }
}

function showHeader(state = {}, action) {
    switch (action.type) {
        case 'USER_HEADER':
            return { ...state, 'userHeader': action.headerData }
        default: return state
    }
}

const rootReducer = combineReducers({
    userAuth,
    userImage,
    showHeader
});

export default rootReducer;