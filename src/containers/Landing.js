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
                <h1><img src="./dist/assets/img/logo.png"/></h1>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <ol className="instruction">
                    <li>Create a room. This is where the questions will show up</li>
                    <li>Join a room using a phone or a tablet</li>
                  </ol>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-6 col-sm-push-6">
                  <div className="Landing-button-wrap">
                    <Link to="/gamepad" className="join-room-graphic" />
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-sm-pull-6">
                  <div className="Landing-button-wrap">
                    <Link to="/display" className="create-room-graphic" />
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}
