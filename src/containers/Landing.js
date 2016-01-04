import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import { Link } from 'react-router'
import cx from 'classname'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActs from '../modules/auth'
import autobind from 'autobind-decorator'

export default class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      isCreatingAccount: false
    }
  }

  render() {
    const { props } = this

    return (
      <div className="Landing">
        <div className="Landing-content-wrap">
            <div className="Landing-content">
              <div className="Landing-header-wrap">
                <h1><img src="./assets/img/logo.png"/></h1>
              </div>
              <div className="Landing-button-wrap">
                <Link to="/display" className="btn Landing-button">Create Room</Link>
              </div>
              <div className="Landing-button-wrap">
                <Link to="/gamepad" className="btn Landing-button">Join Room</Link>
              </div>
            </div>
        </div>
      </div>
    )
  }
}
