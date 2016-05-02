import { PROGRESS } from '../action-creators'

export default function todaysProgress (state = {}, action) {
  switch (action.type) {
    case PROGRESS:
      const previous = state[action.goalId] || 0
      const increment = Number(action.increment) || 0
      return // ???

    default:
      return state
  }
}
