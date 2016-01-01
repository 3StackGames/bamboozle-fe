'use strict'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../modules/reducer'

const logger = createLogger()
const configureStore = applyMiddleware(
  thunk,
  logger
)(createStore)

export default configureStore(rootReducer)
