import { expect } from 'chai'

import { clearHistory } from '../action-creators'
import reducer from './history'

describe('History reducer', () => {
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = []

    expect(reducer(initialState, {}))
      .to.deep.equal(expectedState)
  })

  it('should handle clearing', () => {
    const initialState = [{}, {}, {}]
    const expectedState = []

    expect(reducer(initialState, clearHistory()))
      .to.deep.equal(expectedState)
  })
})
