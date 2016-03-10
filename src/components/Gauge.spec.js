// Jauge (spec)
// ============

import chai, { expect } from 'chai'
// [Enzyme](http://airbnb.io/enzyme/) est la super techno d’Airbnb pour tester
// à toute bombe des composants React.  Elle dispose même d’un plugin Chai pour
// avoir des assertions plus "métier".
import createChaiEnzyme from 'chai-enzyme'
// On trouve également un sérialiseur dédié à Enzyme pour faire du
// [snapshot testing](https://facebook.github.io/jest/docs/snapshot-testing.html#content)
// propre avec Jest.  Toutefois, pour utiliser ce dernier, il faut passer par les *matchers*
// de Jest, et non ceux de Chai.  D’où cet import dédié, `jestExpect`.
import enzymeToJSON from 'enzyme-to-json'
import jestExpect from 'jest-matchers'

import React from 'react'
// Le mode “shallow” d’Enzyme est adapté à tout test qui ne nécessite pas le
// DOM réel mais peut se contenter du DOM virtuel, ce qui inclue même les simulations
// d’événement.
import { shallow } from 'enzyme'
import sinon from 'sinon'

import Gauge from './Gauge'

// Mise en place du plugin Chai d’Enzyme
chai.use(createChaiEnzyme())

// Classiquement, quand on décrit un composant React, on utilise sa balise JSX
// comme sujet de la description.  Celui-ci est censé…
describe('<Gauge />', () => {
  // …produire le composant attendu
  // ------------------------------
  it('should render appropriately', () => {
    // Hop!  Production de l’enrobage de test à base de DOM virtuel pour notre composant.
    const wrapper = shallow(<Gauge value={50} />)

    // Utilisation d’une assertion métier du plugin: `prop`, qui teste la présence, voire
    // la valeur, d’une *prop* au sens React.
    expect(wrapper).to.have.prop('mode', 'determinate')
    expect(wrapper).to.have.prop('max', 100)
    expect(wrapper).to.have.prop('value', 50)
    // Comme les assertions de valeur de *prop* sont de simples égalités strictes
    // (`===`), elles ne suffisent pas pour des objets.  On récupère alors la valeur
    // directement auprès de l'enrobage de test (`.prop(…)`) et on utilise une comparaison
    // profonde standard de Chai.
    expect(wrapper.prop('style')).to.deep.equal({ height: 8 })
  })

  // …gérer sa *prop* optionnelle `max`
  // ----------------------------------
  it('should honor custom max', () => {
    const wrapper = shallow(<Gauge value={50} max={75} />)

    expect(wrapper).to.have.prop('max', 75)
  })

  // …valider le snapshot
  // --------------------
  // (avoir une structure détaillée identique à la dernière qui a été validée
  // par les développeurs au moyen d’un snapshot.)
  it('should otherwise match the expected snapshot', () => {
    const mock = sinon.useFakeTimers()
    try {
      const wrapper = shallow(<Gauge value={50} />)

      jestExpect(enzymeToJSON(wrapper)).toMatchSnapshot()
    } finally {
      mock.restore()
    }
  })
})
