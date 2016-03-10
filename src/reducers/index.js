// Reducer combiné global
// ======================

// Selon la [meilleure pratique Redux](http://redux.js.org/docs/basics/Reducers.html#splitting-reducers),
// nous avons réalisé
// indépendamment les *reducers* des diverses parties de l’état.
// On va utiliser [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html)
// pour les recombiner en un seul,
// qui délèguera automatiquement aux nôtres, champ par champ.
//
// Toutefois, une action (`CLOSE_DAY`) impacte plusieurs champs
// (en l’occurrence, `todaysProgress` et `history`), de sorte que
// nous allons la traiter dans un reducer *top-level* dédié (`closeDay`).

import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'

import closeDay from './closeDay'
import currentUser from './currentUser'
import goals from './goals'
import history from './history'
import today from './today'
import todaysProgress from './todaysProgress'

// On crée le reducer consolidé…
const coreReducer = combineReducers({
  // … basé sur nos reducers individuels pour chaque partie…
  currentUser, goals, history, today, todaysProgress
})

// Ensuite, on définit le reducer final exporté par ce module,
// qui sera donc celui exploité par le *store* Redux, afin de traiter
// les actions multi-champs.
const goalTrackerReducer = reduceReducers(coreReducer, closeDay)

export default goalTrackerReducer
