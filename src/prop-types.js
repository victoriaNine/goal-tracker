// Types complexes de propriétés React
// ===================================

import {
  and,
  between,
  integer,
  keysOf,
  nonNegativeInteger
} from 'airbnb-prop-types'
import { PropTypes } from 'react'

// Les composants React peuvent déclarer
// [le type et la structure des propriétés](http://facebook.github.io/react/docs/reusable-components.html)
// qui leur sont passées,
// pour bénéficier d’une aide à la validation affichée
// généralement sous forme d’erreurs dans la console du
// navigateur.
//
// Outre les types prédéfinis, il est possible de déclarer
// des types complexes, avec des objets, des tableaux, etc.
// Lorsqu'ils sont répétés à travers le code, autant les
// centraliser, comme ici.

// On ré-exporte le `nonNegativeInteger` d’Airbnb, comme ça le reste
// du code de l’appli n’a pas à se soucier de l’origine des validateurs
// avancés (Airbnb ou nous) : il importe depuis ce module à tous les coups.
export { nonNegativeInteger }

// Validateur d’entier positif non nul (ex. valeurs d’objectifs).
// Airbnb fournit `nonNegativeInteger`, mais pas la version sans le zéro…
export const positiveInteger = and([integer(), between({ gt: 0 })])

// Description d’un objectif, utilisé dans de nombreux composants.
export const GoalPropType = PropTypes.shape({
  id: nonNegativeInteger.isRequired,
  name: PropTypes.string.isRequired,
  target: positiveInteger.isRequired,
  units: PropTypes.string.isRequired
})

// Validateur interne, utilisé pour les clés de `stats[n].progresses`
// dans `HistoryDayStatsType` plus bas, qui s’assure qu’une donnée est
// une `String` représentant un entier positif ou nul (dans notre cas, un ID
// d’objectif).  Utilisé comme validateur interne de `keysOf(…)` plus bas.
function nonNegativeIntegerString (props, propName, componentName) {
  const value = props[propName]
  const numberValue = Number(value)

  if (typeof value !== 'string' || !Number.isInteger(numberValue) || numberValue < 0) {
    return new Error(`${propName} in ${componentName} must be a string representing a non-negative integer`)
  }

  return null
}

// Base "champ requis" du validateur pour les champs `progresses` des journées
// d’historique.  Sera exposé sous la version `isRequired` d’un enrobage qui lève
// cette exigence en vérifiant `null` et `undefined` (voir ci-après).
function requiredHistoryDayProgressesPropType (props, propName, componentName) {
  const prefix = `${propName} in ${componentName} must`
  const value = props[propName]

  // 1. Le champ doit être un tableau
  if (!Array.isArray(value)) {
    return new Error(`${prefix} be an array.`)
  }

  // 2. Il doit contenir une paire de véritables nombres entiers
  if (value.length !== 2 || !value.every(Number.isInteger)) {
    return new Error(`${prefix} be a pair of integers.`)
  }

  const [progress, target] = value
  // 3. La valeur de progression ne peut être négative
  if (progress < 0) {
    return new Error(`${prefix} start with a non-negative progress value.`)
  }

  // 4. La valeur cible dénormalisée de l'objectif ne peut être
  // négative ou nulle.
  if (target <= 0) {
    return new Error(`${prefix} end with a positive target value.`)
  }

  // Bon, bah tout va bien alors…
  return null
}

// Validateur exporté, en mode "non requis" pour coller aux conventions des
// `React.PropTypes`.  Lève en fait l’exigence de présence du code noyau en
// court-circuitant les cas `null` et `undefined` (d’où le `==` laxiste).
export function HistoryDayProgressesPropType (props, propName, componentName) {
  const value = props[propName]

  if (value == null) {
    return null
  }

  return requiredHistoryDayProgressesPropType(props, propName, componentName)
}

// Exposition du validateur noyau, qui exige le champ, sous la propriété chaînée
// `isRequired` habituelle.
HistoryDayProgressesPropType.isRequired = requiredHistoryDayProgressesPropType

// Description d’un jour de stats dans l’historique.
export const HistoryDayStatsPropType = PropTypes.shape({
  date: PropTypes.string.isRequired,
  progresses: and([
    // Exigence sur les clés : IDs d’objectifs, donc chaînes représentant des
    // entiers non négatifs.  Le validateur interne est à nous (vois plus haut).
    keysOf(nonNegativeIntegerString),
    // Exigence sur les valeurs : paires d’entiers avec contraintes supplémentaires
    PropTypes.objectOf(HistoryDayProgressesPropType)
  ]).isRequired
})
