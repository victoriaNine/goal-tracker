import { expect } from 'chai'

import { logInFailure, logInStart, logInSuccess, logOut } from '../action-creators'
import reducer from './currentUser'

describe('Current User reducer', () => {
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = { loginState: 'logged-out' }

    expect(reducer(initialState, {}))
      .to.deep.equal(expectedState)
  })

  it('should handle login steps', () => {
    const initialState = { loginState: 'logged-out' }
    const email = 'john@example.com'

    expect(reducer(initialState, logInStart()))
      .to.deep.equal({ loginState: 'pending' })

    expect(reducer(initialState, logInSuccess(email)))
      .to.deep.equal({ loginState: 'success', email })

    expect(reducer(initialState, logInFailure()))
      .to.deep.equal({ loginState: 'failure' })
  })

  it('should handle logout', () => {
    const initialState = { loginState: 'success', email: 'john@example.com' }
    const expectedState = { loginState: 'logged-out' }

    expect(reducer(initialState, logOut()))
      .to.deep.equal(expectedState)
  })
})
