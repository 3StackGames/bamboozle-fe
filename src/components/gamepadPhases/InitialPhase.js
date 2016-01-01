import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import objectPath from 'object-path'
import { fetchLocalToken } from '../../utils'

export default class InitialPhase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nickname: '',
      gameCode: '',
      username: '',
      password: '',
      errors: {
        nickname: true,
        gameCode: true
      }
    }
  }

  componentDidMount() {
    const { engine } = this.props
    engine.socket.on(engine.events.GAMEPAD_JOIN_REJECTED, (data) => {
      console.log(this.state)
      console.log(data)
      this.setState({
        errors: {
          ...this.state.errors,
          nickname: data.reason
        }
      })
    })

    const token = fetchLocalToken()
    if (token) {
      this.props.authActs.localLogin(token)
    }
  }

  render() {
    const { auth } = this.props
    const user = JSON.parse(localStorage.getItem('gamepad.user'))
    const timestamp = parseInt(localStorage.getItem('gamepad.timestamp'), 10)
    const difference = (+new Date - timestamp) / (1000 * 60 * 60)
    let foundRoom

    if(typeof user === "object" && difference <= 3)
    {
      foundRoom = (
        <div className="form-group">
          <label>Found Room:</label>
          <button onClick={this.handleJoinRoom} type="button" className="btn">Join Back {user.gameCode} as {user.displayName}</button>
        </div>
      )
    }

    if (objectPath.get(this.props, ['currentPlayer', 'joined'])) {
      return (
        <div>
          <div className="small-header">You are in!</div>
          {this.everyoneIsInButton}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <div className="small-header">Join Room</div>
        <form>
          {foundRoom}
          <div className="form-group">
            <label htmlFor="nickname">Nickname <span className="notice-red">{this.state.errors.nickname}</span></label>
            <input
              type="text"
              onChange={this.handleNicknameInput}
              className="form-control"
              id="nickname"
              placeholder="ex: John" />
          </div>
          <div className="form-group">
            <label htmlFor="gameCode">Game Code</label>
            <input
              type="text"
              onChange={this.handleGameCodeInput}
              className="form-control"
              id="gameCode"
              placeholder="gameCode"
              maxLength="4"
              size="4" />
          </div>
          <div className="form-group">
            <button
              disabled={!this.isInputValid}
              onClick={this.handlePlayerJoin}
              className="btn">
              Enter
            </button>
          </div>
        </form>
        <div className="login-wrap">
          {
            auth.username
              ? this.loggedInView
              : this.loggedOutView
          }
        </div>
      </div>
    )
  }

  get loggedInView() {
    const { auth } = this.props
    return (
      <div>
        <h3 style={{ textAlign: 'center' }}>Hi there, {auth.username}</h3>
        <button style={{ width: 100 }} className="btn-login" onClick={this.handleLogout}>Log Out</button>
      </div>
    )
  }

  get loggedOutView() {
    const { auth } = this.props
    return (
      <div>
        <h3>Login</h3>
        <p className="text-detail">We'll make sure you don't get repeat questions :)</p>
        <form>
          <h6 id="warning" className="notice-red">{auth.error}</h6>
          <div className="form-group">
            <label htmlFor="loginUsername">Username</label>
            <input
              type="text"
              className="form-control"
              id="loginUsername"
              onChange={this.handleUsernameInput} />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              className="form-control"
              id="loginPassword"
              onChange={this.handlePasswordInput} />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" onChange={this.handleCreateToggle}/> Create new account
            </label>
          </div>
        </form>
        <button className="btn-login" onClick={this.handleLogin}>Submit</button>
      </div>
    )
  }

  @autobind
  handleUsernameInput(e) {
    const input = e.target.value
    this.setState({
      username: input
    })
  }

  @autobind
  handlePasswordInput(e) {
    const input = e.target.value
    this.setState({
      password: input
    })
  }

  @autobind
  handleCreateToggle(e) {
    const isChecked = e.target.checked
    this.setState({
      isCreatingAccount: isChecked
    })
  }

  @autobind
  handleLogin(e) {
    const { isCreatingAccount, username, password } = this.state
    if (isCreatingAccount) {
      this.props.authActs.createAccount(username, password)
    } else {
      this.props.authActs.login(username, password)
    }
  }

  @autobind
  handleLogout(e) {
    this.props.authActs.logout()
  }

  get everyoneIsInButton() {
    if (this.props.gameState.players[0].displayName === this.props.currentPlayer.displayName) {
      return <button onClick={this.everyoneIsIn} className="btn">EVERYONE IS IN</button>;
    }
  }

  @autobind
  everyoneIsIn(e) {
    e.target.disabled = true
    this.props.engine.beginGame()
  }

  @autobind
  handleNicknameInput(e) {
    const { isDirty, errors } = this.state
    const input = e.target.value

    let error = null
    if (input.length === 0) {
      error = 'Enter a nickname!'
    }
    else if (input.length > 16) {
      error = 'Choose a shorter nickname!'
    }

    this.setState({
      nickname: input,
      errors: {
        ...errors,
        nickname: error
      }
    })
  }

  @autobind
  handleGameCodeInput(e) {
    const { isDirty, errors } = this.state
    const input = e.target.value

    let error = null
    if (input.length === 0) {
      error = 'Enter a game code!'
    }
    else if (input.length !== 4) {
      // Set error to `true` if you don't want to print an error message
      // but still want to recognize that an error has occurred
      error = true
    }

    this.setState({
      gameCode: input,
      errors: {
        ...errors,
        gameCode: error
      }
    })
  }

  get isInputValid() {
    return !this.state.errors.nickname && !this.state.errors.gameCode
  }

  @autobind
  handlePlayerJoin(e) {
    const { nickname, gameCode } = this.state
    const { playerActs, engine, auth } = this.props
    e.preventDefault()
    e.target.disabled = true

    playerActs.setPlayer({
      displayName: nickname,
      joined: false
    })

    localStorage.removeItem('gamepad.user');
    localStorage.removeItem('gamepad.timestamp');

    engine.gamepadJoin({
      gameCode: gameCode.toUpperCase(),
      accountName: auth.username,
      displayName: nickname
    })
  }

  @autobind
  handleJoinRoom(e) {
    e.preventDefault()
    e.target.disabled = true

    const { playerActs, engine, auth } = this.props
    const { displayName, gameCode } = JSON.parse(localStorage.getItem('gamepad.user'))

    playerActs.setPlayer({ displayName, joined: false })
    engine.gamepadJoin({
      displayName,
      gameCode: gameCode.toUpperCase(),
      accountName: auth.username
    })
  }
}
