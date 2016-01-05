import { combineReducers } from 'redux'

import auth from './auth'
import gameState from './gameState'
import currentPlayer from './currentPlayer'
import music from './music'

export default combineReducers({
  auth,
  gameState,
  currentPlayer,
  music
})
