export function user_SignUp(userData) {
    return {
        type: 'USER_SIGNUP',
        userData: userData
    }
}

export function user_Login(userData) {
    return {
        type: 'USER_LOGIN',
        userData: userData
    }
}

export function user_Image(userImage) {
    return {
        type: 'USER_IMAGE',
        userImage: userImage
    }
}

export function showHeader(data) {
    return {
        type: 'USER_HEADER',
        headerData: data
    }
}