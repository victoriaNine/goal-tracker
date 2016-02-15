import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'

import closeDay from './closeDay'
import currentUser from './currentUser'
import goals from './goals'
import history from './history'
import today from './today'
import todaysProgress from './todaysProgress'

const coreReducer = combineReducers({
  currentUser, goals, history, today, todaysProgress
})

const goalTrackerReducer = reduceReducers(coreReducer, closeDay)

export default goalTrackerReducer
