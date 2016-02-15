import { LOGIN, LOGOUT } from '../action-creators'

export default function currentUser (state = null, action) {
  switch (action.type) {
    case LOGIN:
      // Votre code ici

    case LOGOUT:
      // Votre code ici

    default:
      return state
  }
}
