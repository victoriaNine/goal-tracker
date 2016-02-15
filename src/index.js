import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React from 'react'
import { render } from 'react-dom'

// DEV NOTE: only required until Material UI 0.16+, as it won't use
// `onTouchTap` unduly anymore.
injectTapEventPlugin()

import HomeScreen from './containers/HomeScreen'

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <HomeScreen />
  </MuiThemeProvider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
}
