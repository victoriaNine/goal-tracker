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

function checkClock () {
  const now = moment().format('HH:mm:ss')
  console.log('checking', now)

  // Votre code ici
}

function checkForTodaysFirstUse () {
  // Votre code ici
}
