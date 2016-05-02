import { CLEAR_HISTORY } from '../action-creators'

export default function history (state = [], action) {
  switch (action.type) {
    case CLEAR_HISTORY:
      return []

    default:
      return state
  }
}
