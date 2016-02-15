import chai, { expect } from 'chai'
import createChaiEnzyme from 'chai-enzyme'
import dirtyChai from 'dirty-chai'
import enzymeToJSON from 'enzyme-to-json'
import jestExpect from 'jest-matchers'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up'
import ContentAdd from 'material-ui/svg-icons/content/add'

import Gauge from './Gauge'
import GoalTrackerWidget from './GoalTrackerWidget'

chai.use(createChaiEnzyme()).use(sinonChai).use(dirtyChai)

describe('<GoalTrackerWidget />', () => {
  describe('when not completed', () => {
    it('should render appropriately')

    it('should trigger its onProgress on click')

    it('should otherwise match the expected snapshot')
  })

  describe('when completed (or exceeded)', () => {
    it('should render appropriately')

    it('should otherwise match the expected snapshot')
  })
})
