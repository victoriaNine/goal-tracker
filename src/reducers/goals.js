import { ADD_GOAL, REMOVE_GOAL, UPDATE_GOAL } from '../action-creators'

export default function goals (state = [], action) {
  switch (action.type) {
    case ADD_GOAL: {
      // Votre code ici
    }

    case REMOVE_GOAL:
      // Votre code ici

    case UPDATE_GOAL: {
      // Votre code ici
    }

    default:
      return state
  }
}
