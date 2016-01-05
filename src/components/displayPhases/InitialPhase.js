import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import { DisplayLobby } from '../../components'
import Modal from 'react-modal'

export default class InitialPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayRejoinModal: false
    }
  }

  componentWillMount() {
    const gameCode = localStorage.getItem('display.gameCode')
    const timestamp = parseInt(localStorage.getItem('display.timestamp'), 10)
    const difference = (+new Date - timestamp) / (1000 * 60 * 60)

    if(gameCode !== null && gameCode.length == 4 && difference <= 3)
    {
      this.setState({
        displayRejoinModal: true
      })
      // if(confirm('Found Game Code: ' + gameCode + '\nWould you like to continue?'))
      // {
      //   this.props.engine.displayJoin(gameCode)
      //   return
      // } else {
      //   localStorage.removeItem('display.gameCode')
      //   localStorage.removeItem('display.timestamp')
      // }
    } else {
      this.props.engine.displayJoin()
    }
  }

  render() {
    const { gameState, engine } = this.props
    const { players = [], gameCode } = gameState

    if(this.state.displayRejoinModal) {
      const gameCode = localStorage.getItem('display.gameCode')
      const timestamp = parseInt(localStorage.getItem('display.timestamp'), 10)
      const difference = (+new Date - timestamp) / (1000 * 60 * 60)

      const reJoin = () => {
        engine.displayJoin(gameCode)
        this.setState({
          displayRejoinModal: false
        })
      }

      const dontReJoin = () => {
        engine.displayJoin()
        this.setState({
          displayRejoinModal: false
        })
      }

      return (
        <Modal
          style={{
            content: {
              border: null,
              background: null,
              overflow: null,
              borderRadius: null,
              outline: 0
            }
          }}
          isOpen={true}
          className="Modal__Bootstrap modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Would you like to continue?</h3>
              <h4>Found Game Code: <strong>{gameCode}</strong></h4>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary btn-modal" onClick={reJoin}>Yes</button>
              <button className="btn btn-danger btn-modal" onClick={dontReJoin}>No</button>
            </div>
          </div>
        </Modal>
      )
    }

    return (
      <div>
        <div className="small-header">
          <h3 className="text-inverted">Waiting for players ({players.length}/8)...</h3>
        </div>
        <div className="joinNotice">
          <div className="title">
            The game code is : <div className="gamecode">{gameCode}</div>
          </div>

          <div className="content">
            <p>Join on your phone or tablet at <span className="everybody">{'http://Bamboozle.io'}</span></p>
            <p>Press <span className="everybody">EVERYBODY IS IN</span> to start the game.</p>
          </div>
          <DisplayLobby players={players} />
        </div>
        <div>
          <img src="/dist/assets/img/bamboozle-demo-popup.png" alt="bamboozle demo" className="img-responsive"/>
        </div>
      </div>
    )
  }
}
