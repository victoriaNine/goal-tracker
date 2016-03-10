// Date courante (reducer)
// =======================

import moment from 'moment'

// On ne change rien, à part fournir la valeur par défaut.  Ce réducteur
// est nécessaire parce que le `combineReducers(…)` de Redux exige une réducteur
// par champ constaté dans l’état.
export default function today (state = moment().format('YYYY-MM-DD'), action) {
  return state
}
