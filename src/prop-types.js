import {
  and,
  between,
  integer,
  keysOf,
  nonNegativeInteger
} from 'airbnb-prop-types'
import { PropTypes } from 'react'

export { nonNegativeInteger }

export const positiveInteger = and([integer(), between({ gt: 0 })])

export const GoalPropType = PropTypes.shape({
  id: nonNegativeInteger.isRequired,
  name: PropTypes.string.isRequired,
  target: positiveInteger.isRequired,
  units: PropTypes.string.isRequired
})

function nonNegativeIntegerString (props, propName, componentName) {
  const value = props[propName]
  const numberValue = Number(value)

  if (typeof value !== 'string' || !Number.isInteger(numberValue) || numberValue < 0) {
    return new Error(`${propName} in ${componentName} must be a string representing a non-negative integer`)
  }

  return null
}

function requiredHistoryDayProgressesPropType (props, propName, componentName) {
  const prefix = `${propName} in ${componentName} must`
  const value = props[propName]

  if (!Array.isArray(value)) {
    return new Error(`${prefix} be an array.`)
  }

  if (value.length !== 2 || !value.every(Number.isInteger)) {
    return new Error(`${prefix} be a pair of integers.`)
  }

  const [progress, target] = value
  if (progress < 0) {
    return new Error(`${prefix} start with a non-negative progress value.`)
  }

  if (target <= 0) {
    return new Error(`${prefix} end with a positive target value.`)
  }

  return null
}

export function HistoryDayProgressesPropType (props, propName, componentName) {
  const value = props[propName]

  if (value == null) {
    return null
  }

  return requiredHistoryDayProgressesPropType(props, propName, componentName)
}

HistoryDayProgressesPropType.isRequired = requiredHistoryDayProgressesPropType

export const HistoryDayStatsPropType = PropTypes.shape({
  date: PropTypes.string.isRequired,
  progresses: and([
    keysOf(nonNegativeIntegerString),
    PropTypes.objectOf(HistoryDayProgressesPropType)
  ]).isRequired
})
