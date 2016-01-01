const SET_PLAYER = 'subtle-scheme/currentPlayer/SET_PLAYER'
const REMOVE_PLAYER = 'subtle-scheme/currentPlayer/REMOVE_PLAYER'
const JOIN_PLAYER = 'subtle-scheme/currentPlayer/JOIN_PLAYER'

const initialState = {
  displayName: '',
  joined: false
}
const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_PLAYER:
      return payload
    case REMOVE_PLAYER:
      return {...initialState}
    case JOIN_PLAYER:
      return {
        ...state,
        joined: true
      }
    default:
      return state
  }
}

export const setPlayer = (player) => {
  return {
    type: SET_PLAYER,
    payload: player
  }
}

export const removePlayer = () => {
  return {
    type: REMOVE_PLAYER
  }
}

export const join = () => {
  return {
    type: JOIN_PLAYER
  }
}

export default reducer