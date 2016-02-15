import { expect } from 'chai'
import moment from 'moment'

import reducer from '../../src/reducers'

describe('Store-level reducer', () => {
  it('should properly accrue its initial state', () => {
    const initialState = undefined
    const expectedState = {
      currentUser: { loginState: 'logged-out' },
      goals: [],
      history: [],
      today: moment().format('YYYY-MM-DD'),
      todaysProgress: {}
    }

    expect(reducer(initialState, {}))
      .to.deep.equal(expectedState)
  })
})
