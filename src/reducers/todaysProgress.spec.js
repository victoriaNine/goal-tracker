import { expect } from 'chai'

import { progressOnGoal } from '../action-creators'
import reducer from './todaysProgress'

describe('Today’s Progress reducer', () => {
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = {}

    expect(reducer(initialState, {}))
      .to.deep.equal(expectedState)
  })

  it('should handle goal progression', () => {
    let initialState = {}

    let expectedState = { 1: 2 }
    expect(reducer(initialState, progressOnGoal(1, 2)))
      .to.deep.equal(expectedState)

    expectedState = { 1: 1 }
    expect(reducer(initialState, progressOnGoal(1)))
      .to.deep.equal(expectedState)

    initialState = { 1: 1 }
    expectedState = { 1: 2 }
    expect(reducer(initialState, progressOnGoal(1)))
      .to.deep.equal(expectedState)

    initialState = { 1: 2 }
    expectedState = { 1: 2, 2: 1 }
    expect(reducer(initialState, progressOnGoal(2)))
      .to.deep.equal(expectedState)
  })
})
