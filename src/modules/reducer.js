import { combineReducers } from 'redux'

import auth from './auth'
import gameState from './gameState'
import currentPlayer from './currentPlayer'

export default combineReducers({
  auth,
  gameState,
  currentPlayer
})
