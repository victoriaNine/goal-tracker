import React, { Component } from 'react'

import LoginScreen from './LoginScreen'
import TrackerScreen from './TrackerScreen'

import store from '../store'

export class HomeScreen extends Component {
  render () {
    const { currentUser: { loginState }, goals, todaysProgress } = store

    return loginState === 'success'
      ? <TrackerScreen goals={goals} todaysProgress={todaysProgress} />
      : <LoginScreen />
  }
}

export default HomeScreen
