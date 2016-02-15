import { connect } from 'react-redux'
import React, { Component } from 'react'

import LoginScreen from './LoginScreen'
import TrackerScreen from './TrackerScreen'

export class HomeScreen extends Component {
  render () {
    return this.props.loginState === 'success'
      ? <TrackerScreen />
      : <LoginScreen />
  }
}

const mapStateToProps = ({ currentUser: { loginState } }) => ({ loginState })

export default connect(mapStateToProps)(HomeScreen)
