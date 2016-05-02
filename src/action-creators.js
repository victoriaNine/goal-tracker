// Goal settings management

export const ADD_GOAL = '@@GOALTRACKER/GOALS_ADD'
export const REMOVE_GOAL = '@@GOALTRACKER/GOALS_DEL'
export const UPDATE_GOAL = '@@GOALTRACKER/GOALS_UPDATE'

export function addGoal (name, target, units) {
  return { type: ADD_GOAL, name, target, units }
}

export function removeGoal (id) {
  return { type: REMOVE_GOAL, id }
}

export function updateGoal (id, name, target, units) {
  return { type: UPDATE_GOAL, id, name, target, units }
}

// Using the app everyday

export const CLEAR_HISTORY = '@@GOALTRACKER/HISTORY_CLEAR'
export const LOGIN = '@@GOALTRACKER/AUTH_LOGIN'
export const LOGOUT = '@@GOALTRACKER/AUTH_LOGOUT'
export const PROGRESS = '@@GOALTRACKER/PROGRESS'

export function clearHistory () {
  return { type: CLEAR_HISTORY }
}

export function logIn (email, password) {
  return { type: LOGIN, email, password }
}

export function logOut () {
  return { type: LOGOUT }
}

export function progressOnGoal (goalId, increment = 1) {
  return { type: PROGRESS, goalId, increment }
}
