import { combineReducers } from 'redux'

import currentUser from './currentUser'
import goals from './goals'
import history from './history'
import todaysProgress from './todaysProgress'

const goalTrackerReducer = combineReducers({
  currentUser, goals, history, todaysProgress
})

export default goalTrackerReducer
