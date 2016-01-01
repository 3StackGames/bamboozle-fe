import request from 'superagent-bluebird-promise'
import jwt from 'jsonwebtoken'

const CREATE_REQUEST = 'subtle-scheme/auth/CREATE_REQUEST'
const CREATE_SUCCESS = 'subtle-scheme/auth/CREATE_SUCCESS'
// const CREATE_FAIL = 'subtle-scheme/auth/CREATE_FAIL'
// const LOGIN_REQUEST = 'subtle-scheme/auth/LOGIN_REQUEST'
const LOGIN_SUCCESS = 'subtle-scheme/auth/LOGIN_SUCCESS'
// const LOGIN_FAIL = 'subtle-scheme/auth/LOGIN_FAIL'
const LOCAL_LOGIN = 'subtle-scheme/auth/LOCAL_LOGIN'
const LOGOUT = 'subtle-scheme/auth/LOGOUT'
const AUTH_REQUEST = 'subtle-scheme/auth/AUTH_REQUEST'
const AUTH_FAIL = 'subtle-scheme/auth/AUTH_FAIL'


const initialState = {
  token: null,
  username: null,
  isLoading: false,
  error: null
}

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action
  switch (type) {
    // case CREATE_REQUEST:
    //   return {
    //     ...state,
    //     isLoading: true
    //   }
    case CREATE_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false
      }
    // case CREATE_FAIL:
    //   return {
    //     ...state,
    //     error: payload,
    //     isLoading: false
    //   }
    // case LOGIN_REQUEST:
    //   return {
    //     ...state,
    //     isLoading: true
    //   }
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
        username: payload.username,
        error: null,
        isLoading: false
      }
    // case LOGIN_FAIL:
    //   return {
    //     ...state,
    //     error: payload,
    //     isLoading: false
    //   }
    case LOCAL_LOGIN:
      return {
        ...state,
        token: payload.token,
        username: payload.username
      }
    case AUTH_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case AUTH_FAIL:
      return {
        ...state,
        error: payload,
        isLoading: false
      }
    case LOGOUT:
      return {
        ...state,
        token: null,
        username: null
      }
    default:
      return state
  }
}

function loginSuccess(token, username) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      token,
      username
    }
  }
}

// function loginFail(err) {
//   return {
//     type: LOGIN_FAIL,
//     payload: err
//   }
// }

function authRequest() {
  return {
    type: AUTH_REQUEST
  }
}

function authFail(err) {
  return {
    type: AUTH_FAIL,
    payload: err.message
  }
}

function processToken(token, dispatch) {
  const decoded = jwt.decode(token)
  const { username } = decoded
  localStorage.setItem('gamepad.token', token)
  dispatch(loginSuccess(token, username))
}

export const createAccount = (username, password) => dispatch => {
  dispatch(authRequest())

  request
    .post('http://localhost:3000/api/v1/users/create')
    .type('application/json')
    .send({
      username,
      password
    })
    .then(res => {
      // Hack for API errors
      if (!res.body.success) {
        dispatch(authFail(res.body))
      } else {
        request
          .post('http://localhost:3000/api/v1/authenticate/login')
          .type('application/json')
          .send({
            username,
            password
          })
          .then(res => {
            const { token } = res.body
            processToken(token, dispatch)
          })
      }
    })
    // .catch(err => {
    //   dispatch(authFail(err))
    // })
}

export const login = (username, password) => dispatch => {
  dispatch(authRequest())

  request
    .post('http://localhost:3000/api/v1/authenticate/login')
    .type('application/json')
    .send({
      username,
      password
    })
    .then(res => {
      // Hack for API errors
      if (!res.body.success) {
        dispatch(authFail(res.body))
      } else {
        const { token } = res.body
        processToken(token, dispatch)
      }
    })
    // .catch(err => {
    //   dispatch(authFail(err))
    // })
}

export const localLogin = (token) => {
  const decoded = jwt.decode(token)
  const { username } = decoded
  return {
    type: LOCAL_LOGIN,
    payload: {
      token,
      username
    }
  }
}

export const logout = () => {
  localStorage.removeItem('gamepad.token')
  return {
    type: LOGOUT
  }
}
