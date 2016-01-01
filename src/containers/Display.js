import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import autobind from 'autobind-decorator'
import engine from '../engine'
import * as gameStateActs from '../modules/gameState'
import { displayPhases as phases } from '../components'
import { currentPhase, bindGameStateDecorator } from '../utils'


@connect(state => ({
  auth: state.auth,
  gameState: state.gameState
}))
@bindGameStateDecorator(engine)
export default class Display extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.gameStateActs = bindActionCreators(gameStateActs, props.dispatch)
  }

  render() {
    const { gameState, auth } = this.props
    const CurrentPhase = currentPhase(gameState, phases)

    return (
      <div className="display-page">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <h1><Link to='/' className='header-logo'>Bamboozle</Link></h1>
              <div id="display">
                <CurrentPhase engine={engine} gameState={gameState} />
              </div>
            </div>
          </div>
        </div>
        <audio src="./assets/sounds/Background-2_edit.mp3" autoPlay></audio>
      </div>
    )
  }

  @autobind
  bindState() {
    this.gameStateActs.stateUpdate(engine.getState())
  }
}
