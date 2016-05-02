import { expect } from 'chai'

import { logIn, logOut } from '../action-creators'
import reducer from './currentUser'

describe('Current User reducer', () => {
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = { loginState: 'logged-out' }

    expect(reducer(initialState, {}))
      .to.deep.equal(expectedState)
  })

  it('should handle login', () => {
    const email = 'john@example.com'
    const initialState = { loginState: 'logged-out' }
    const expectedState = { loginState: 'success', email }

    expect(reducer(initialState, logIn(email, 'no fate')))
      .to.deep.equal(expectedState)
  })

  it('should handle logout', () => {
    const initialState = { loginState: 'success', email: 'john@example.com' }
    const expectedState = { loginState: 'logged-out' }

    expect(reducer(initialState, logOut()))
      .to.deep.equal(expectedState)
  })
})
