// Suivi du jour pour un objectif (spec)
// =====================================

import chai, { expect } from 'chai'
// [Enzyme](http://airbnb.io/enzyme/) est la super techno d’Airbnb pour tester
// à toute bombe des composants React.  Elle dispose même d’un plugin Chai pour
// avoir des assertions plus "métier".
import createChaiEnzyme from 'chai-enzyme'
// On s’assure également qu’on peut (et doit, en fait) utiliser toutes les assertions
// comme des fonctions, même `.undefined`, `.true`, etc. et celles ajoutées par les
// plugins (ex. `.calledOnce`). Ainsi, au lieu d’un échec silencieux en cas de faute
// de frappe, on a une erreur franche.
import dirtyChai from 'dirty-chai'
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
import sinonChai from 'sinon-chai'

import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up'
import ContentAdd from 'material-ui/svg-icons/content/add'

import Gauge from './Gauge'
import GoalTrackerWidget from './GoalTrackerWidget'

// Mise en place des plugins Chai d’Enzyme et de Sinon, ainsi que de la garantie
// d’assertions sous forme de fonctions.
chai.use(createChaiEnzyme()).use(sinonChai).use(dirtyChai)

// Classiquement, quand on décrit un composant React, on utilise sa balise JSX
// comme sujet de la description.  Celui-ci est censé…
describe('<GoalTrackerWidget />', () => {
  const goal = { id: 0, name: 'My goal', target: 42, units: 'wombats' }

  describe('when not completed', () => {
    // …produire le balisage attendu pour un objectif non atteint
    // ----------------------------------------------------------
    it('should render appropriately', () => {
      // On va tester quatre valeurs pour le taux de complétion: les “bornes” 0, 1 et 41,
      // d’une part, et une valeur quelconque, ici le 21 en plein milieu, d’autre part.
      for (const progress of [0, 1, 21, 41]) {
        // Enrobage de test
        const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={progress} />)

        // Vérification du contenu, ici grâce aux assertions métier fournies par le plugin
        // Chai d’Enzyme (`.text(…)`, `.contain(…)`).
        expect(wrapper.find('h2')).to.have.text(goal.name)
        expect(wrapper).to.contain(<Gauge value={progress} max={goal.target} />)
        expect(wrapper).to.contain.text(`${progress} ${goal.units} sur ${goal.target}`)
        expect(wrapper).to.contain(<ContentAdd />)
      }
    })

    // …déclencher correctement son `onProgress` au clic
    // -------------------------------------------------
    it('should trigger its onProgress on click', () => {
      const progress = 21
      // Pour vérifier que le *callback* transmis est bien appelé, rien de tel qu’un
      // *spy* fourni par [SinonJS](http://sinonjs.org/).
      const onProgress = sinon.spy()
      const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={progress} onProgress={onProgress} />)

      // On simule le clic.  Merci Enzyme!
      wrapper.find('FloatingActionButton').simulate('click')
      // Ici, pouvoir appeler `calledOnce` comme une fonction se fait grâce à
      // l’application antérieure du plugin Dirty Chai.
      expect(onProgress).to.have.been.calledOnce()
    })

    // …valider le snapshot
    // --------------------
    // (avoir une structure détaillée identique à la dernière qui a été validée
    // par les développeurs au moyen d’un snapshot.)
    it('should otherwise match the expected snapshot', () => {
      const mock = sinon.useFakeTimers()
      try {
        const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={21} />)

        jestExpect(enzymeToJSON(wrapper)).toMatchSnapshot()
      } finally {
        mock.restore()
      }
    })
  })

  describe('when completed (or exceeded)', () => {
    // …produire le balisage attendu pour un objectif atteint (voire dépassé)
    // ----------------------------------------------------------------------
    it('should render appropriately', () => {
      // On va tester trois valeurs de dépassement de l’objectif: la borne zéro
      // (objectif atteint, pile-poil) et des plus grandes (objectif dépassé).
      for (const progress of [goal.target, goal.target + 1, goal.target + 10]) {
        const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={progress} />)

        // Si on a atteint ou dépassé l'objectif, on n'est pas censé avoir l’icône d'ajout
        // qui trahirait un bouton de progression, mais on est censé avoir l’icône de pouce
        // vers le haut, qui traduit l’objectif (au moins) atteint.
        expect(wrapper).not.to.contain(<ContentAdd />)
        expect(wrapper).to.contain(<ActionThumbUp />)
      }
    })

    // …valider le snapshot
    // --------------------
    // (avoir une structure détaillée identique à la dernière qui a été validée
    // par les développeurs au moyen d’un snapshot.)
    it('should otherwise match the expected snapshot', () => {
      const mock = sinon.useFakeTimers()
      try {
        const wrapper = shallow(<GoalTrackerWidget goal={goal} progress={42} />)

        jestExpect(enzymeToJSON(wrapper)).toMatchSnapshot()
      } finally {
        mock.restore()
      }
    })
  })
})
