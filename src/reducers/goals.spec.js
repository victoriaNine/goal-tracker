import { expect } from 'chai'

import { addGoal, removeGoal, updateGoal } from '../action-creators'
import reducer from './goals'

describe('Goals reducer', () => {
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = []

    expect(reducer(initialState, {}))
      .to.deep.equal(expectedState)
  })

  it('should handle goal addition')

  it('should handle goal removal')

  it('should handle goal update (when in goals)')

  it('should handle goal update (when not in goals)')

  // Votre code de test en fonctions fléchées de rappel sur ces `it`…
})
