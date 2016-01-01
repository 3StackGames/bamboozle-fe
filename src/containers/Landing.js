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
      <div className="index-page">
        <h1>Bamboozle</h1>
        <div><Link to="/display" className="btn">Create Room</Link></div>
        <div><Link to="/gamepad" className="btn">Join Room</Link></div>
      </div>
    )
  }
}
