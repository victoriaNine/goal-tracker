import { ADD_GOAL, REMOVE_GOAL, UPDATE_GOAL } from '../action-creators'

export default function goals (state = [], action) {
  switch (action.type) {
    case ADD_GOAL: {
      const { name, target, units } = action
      // L’approche un poil moins « pure fonctionnelle » serait :
      // ```js
      // const id = Math.max(...state.map((goal) => goal.id), -1) + 1
      // ````
      const id = state.reduce((max, { id }) => max > id ? max : id, -1) + 1
      return [...state, { id, name, target, units }]
    }

    case REMOVE_GOAL:
      return state.filter(({ id }) => id !== action.id)

    case UPDATE_GOAL: {
      const { id, name, target, units } = action
      const newGoal = { id, name, target, units }
      return state.map((goal) => goal.id === id ? newGoal : goal)
    }

    default:
      return state
  }
}
