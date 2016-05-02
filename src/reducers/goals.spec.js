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

  it('should handle goal addition', () => {
    const name = 'Test reducers'
    const target = 42
    const units = 'tests'
    const initialState = undefined
    const goals = reducer(initialState, addGoal(name, target, units))

    // Is it in?
    expect(goals).to.have.length(1)
    // Does it have the proper structure?
    expect(goals[0]).to.have.property('name', name)
    expect(goals[0]).to.have.property('target', target)
    expect(goals[0]).to.have.property('units', units)
    expect(goals[0]).to.have.property('id').which.is.a('number')

    // Does further addition maintain existing items?
    const nextGoals = reducer(goals, addGoal(name, target, units))

    expect(nextGoals).to.have.length(2)
    expect(nextGoals[0]).to.deep.equal(goals[0])

    // Does it guarantee unique IDs?
    expect(nextGoals[1]).to.have.property('id').which.is.a('number')
    expect(nextGoals[1].id).not.to.equal(goals[0].id)
  })

  it('should handle goal removal', () => {
    const initialState = [{ id: 0 }, { id: 1 }, { id: 2 }]
    const expectedState = [{ id: 0 }, { id: 2 }]

    // Does removing a contained entry work?
    expect(reducer(initialState, removeGoal(1)))
      .to.deep.equal(expectedState)

    // Does removing a missing entry maintain the list?
    expect(reducer(initialState, removeGoal(42)))
      .to.deep.equal(initialState)
  })

  it('should handle goal update (when in goals)', () => {
    const id = 1
    const name = 'Test reducer 3'
    const target = 42
    const units = 'wombats'
    const initialState = [
      { id: 0, name: 'Test reducer 1', target: 10, units: 'tests' },
      { id: 1, name: 'Test reducer 2', target: 5, units: 'tests' }
    ]
    const expectedState = [initialState[0], { id, name, target, units }]

    expect(reducer(initialState, updateGoal(id, name, target, units)))
      .to.deep.equal(expectedState)
  })

  it('should handle goal update (when not in goals)', () => {
    // TODO: votre code d’exercice ici
  })
})
