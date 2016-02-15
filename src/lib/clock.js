import moment from 'moment'

import { closeDay } from '../action-creators'
import store from '../store'

const clock = setInterval(checkClock, 1000)

checkForTodaysFirstUse()

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    clearInterval(clock)
  })
}

const HISTORY_TRIGGER_TIME = process.env.NODE_ENV === 'production'
  ? '00:00:00'
  : moment().add(10, 'seconds').format('HH:mm:ss')

function checkClock () {
  const now = moment().format('HH:mm:ss')

  if (now === HISTORY_TRIGGER_TIME) {
    store.dispatch(closeDay())
  }
}

function checkForTodaysFirstUse () {
  const storesLastDay = store.getState().today
  if (storesLastDay && moment(storesLastDay).isBefore(moment(), 'day')) {
    store.dispatch(closeDay())
  }
}
