import { LOGIN, LOGOUT } from '../action-creators'

export default function currentUser (state = { loginState: 'logged-out' }, action) {
  switch (action.type) {
    case LOGIN:
      return { loginState: 'success', email: action.email }

    case LOGOUT:
      return { loginState: 'logged-out' }

    default:
      return state
  }
}
