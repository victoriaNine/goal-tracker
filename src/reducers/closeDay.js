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
    progresses: goals.reduce((acc, { id, target }) => {
      const progress = todaysProgress[id] || 0
      if (progress > 0) {
        acc[id] = [progress, target]
      }
      return acc
    }, {})
  }

  return [historyEntry, ...history]
}
