// Objectifs (spec reducer)
// ========================

import { expect } from 'chai'

import { addGoal, removeGoal, updateGoal } from '../action-creators'
import reducer from './goals'

// Le *reducer* est censé…
describe('Goals reducer', () => {
  // …fournir son état par défaut
  // ----------------------------
  it('should return its initial state', () => {
    const initialState = undefined
    const expectedState = []

    // On teste toujours que l’état par défaut est bien fourni.  Le plus simple consiste
    // à envoyer un état `undefined` et une action vide, et à vérifier le résultat (ici
    // un tableau vide, donc `[]`).
    expect(reducer(initialState, {}))
      .to.deep.equal(expectedState)
  })

  // …gérer l’ajout d’objectif
  // -------------------------
  it('should handle goal addition', () => {
    const name = 'Test reducers'
    const target = 42
    const units = 'tests'
    const initialState = undefined
    // Primo, vérifier l'ajout initial (premier élément)
    const goals = reducer(initialState, addGoal(name, target, units))

    // Est-il bien là ?
    expect(goals).to.have.length(1)
    // A-t-il une bonne tête ?
    expect(goals[0]).to.have.property('name', name)
    expect(goals[0]).to.have.property('target', target)
    expect(goals[0]).to.have.property('units', units)
    expect(goals[0]).to.have.property('id').which.is.a('number')

    // Un ajout supplémentaire préserve-t-il les objectifs existants ?
    const nextGoals = reducer(goals, addGoal(name, target, units))

    expect(nextGoals).to.have.length(2)
    expect(nextGoals[0]).to.deep.equal(goals[0])

    // Les IDs produits sont-ils alors bien uniques ?
    expect(nextGoals[1]).to.have.property('id').which.is.a('number')
    expect(nextGoals[1].id).not.to.equal(goals[0].id)
  })

  // …gérer le retrait d’objectif
  // ----------------------------
  it('should handle goal removal', () => {
    // On part d’un état initial d’au moins 3, pour bien vérifier le
    // comportement de retrait.
    const initialState = [{ id: 0 }, { id: 1 }, { id: 2 }]
    // L’état attendu n’aura plus son élément central.
    const expectedState = [{ id: 0 }, { id: 2 }]

    // Le retrait d’un objectif présent marche-t-il bien ?
    expect(reducer(initialState, removeGoal(1)))
      .to.deep.equal(expectedState)

    // Le retrait d’un objectif manquant préserve-t-il bien l'état ?
    expect(reducer(initialState, removeGoal(42)))
      .to.deep.equal(initialState)
  })

  // …gérer la mise à jour d’un objectif présent
  // -------------------------------------------
  it('should handle goal update (when in goals)', () => {
    const id = 1
    const name = 'Test reducer 3'
    const target = 42
    const units = 'wombats'
    // On part d’un état initial d’au moins 2, pour bien vérifier qu’on ne
    // touche pas au reste.
    const initialState = [
      { id: 0, name: 'Test reducer 1', target: 10, units: 'tests' },
      { id: 1, name: 'Test reducer 2', target: 5, units: 'tests' }
    ]
    // État attendu distinct de l'original, évidemment.
    const expectedState = [initialState[0], { id, name, target, units }]

    // Simple comparaison de tableaux.
    expect(reducer(initialState, updateGoal(id, name, target, units)))
      .to.deep.equal(expectedState)
  })

  // …gérer la mise à jour d’un objectif manquant
  // --------------------------------------------
  it('should handle goal update (when not in goals)', () => {
    const id = 10
    const name = 'Test reducer 3'
    const target = 42
    const units = 'wombats'
    const initialState = [
      { id: 0, name: 'Test reducer 1', target: 10, units: 'tests' },
      { id: 1, name: 'Test reducer 2', target: 5, units: 'tests' }
    ]

    // La mise à jour d'un élément manquant est à traiter comme un ajout en fin de
    // liste, par souci de robustesse.
    const expectedState = [...initialState, { id, name, target, units }]

    expect(reducer(initialState, updateGoal(id, name, target, units)))
      .to.deep.equal(expectedState)
  })
})
