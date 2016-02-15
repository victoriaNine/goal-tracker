import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { install as installOfflineHandling } from 'offline-plugin/runtime'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Provider } from 'react-redux'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory as history } from 'react-router'

// DEV NOTE: only required until Material UI 0.16+, as it won't use
// `onTouchTap` unduly anymore.
injectTapEventPlugin()
installOfflineHandling()

import App from './components/App'
import HistoryScreen from './containers/HistoryScreen'
import HomeScreen from './containers/HomeScreen'
import SettingsScreen from './containers/SettingsScreen'
import store from './store'

import './lib/clock'

function requireAuth (nextState, replace) {
  if (store.getState().currentUser.loginState !== 'success') {
    replace('/')
  }
}

render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Router history={history}>
        <Route path='/' component={App}>
          <IndexRoute component={HomeScreen} />
          <Route path='settings' component={SettingsScreen} onEnter={requireAuth} />
          <Route path='history' component={HistoryScreen} onEnter={requireAuth} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
}
