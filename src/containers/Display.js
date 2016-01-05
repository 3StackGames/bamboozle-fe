import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import autobind from 'autobind-decorator'
import engine from '../engine'
import * as gameStateActs from '../modules/gameState'
import { displayPhases as phases, MuteButton } from '../components'
import { currentPhase, bindGameStateDecorator } from '../utils'
import * as musicActs from '../modules/music'

@connect(state => ({
  auth: state.auth,
  gameState: state.gameState,
  music: state.music
}))
@bindGameStateDecorator(engine)
export default class Display extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.gameStateActs = bindActionCreators(gameStateActs, props.dispatch)
    this.musicActs = bindActionCreators(musicActs, props.dispatch)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.music.changeVolume) {
      this.refs.backgroundMusic.volume = .2;
    } else {
      this.refs.backgroundMusic.volume = 1;
    }
  }

  render() {
    const { gameState, auth, music } = this.props
    const CurrentPhase = currentPhase(gameState, phases)

    return (
      <div className="display-page">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <MuteButton music={music} musicActs={this.musicActs} />
              <h1 className="header"><Link to='/' className='header-logo'><img src="./assets/img/logo.png"/></Link></h1>
              <div id="display">
                {
                  !gameState.outOfQuestions
                    ? <CurrentPhase engine={engine} gameState={gameState} musicActs={this.musicActs} />
                    : ''
                }
              </div>
            </div>
          </div>
        </div>
        <audio src="./assets/sounds/Background-2_edit.mp3" ref="backgroundMusic" autoPlay loop muted={music.muted} volume={music.changeVolume ? 0.2 : 1.0} ></audio>
      </div>
    )
  }

  @autobind
  bindState() {
    this.gameStateActs.stateUpdate(engine.getState())
  }
}
