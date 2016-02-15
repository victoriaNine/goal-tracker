import { expect } from 'chai'
import moment from 'moment'

import reducer from '../../src/reducers/today'

describe('Today’s date reducer', () => {
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = moment().format('YYYY-MM-DD')

    expect(reducer(initialState, {}))
      .to.equal(expectedState)
  })
})
