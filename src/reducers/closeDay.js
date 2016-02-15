import moment from 'moment'

import { CLOSE_DAY } from '../action-creators'

export default function closeDay (state, action) {
  switch (action.type) {
    case CLOSE_DAY:
      return {
        ...state,
        history: tallyPreviousDay(state),
        today: moment().format('YYYY-MM-DD'),
        todaysProgress: {}
      }

    default:
      return state
  }
}

function tallyPreviousDay ({ goals, history, today, todaysProgress }) {
  const historyEntry = {
    date: today,
    progresses: // ???
  }

  return [historyEntry, ...history]
}
