// Écran principal (conteneur)
// ===========================

import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router'
import React, { Component } from 'react'

// Remarquez l’injection CSS à la volée, depuis une feuille de style
// Stylus, via un simple import.  C’est grâce à la combinaison de plusieurs
// loaders Webpack : `stylus-loader`, pour transformer Stylus en CSS classique,
// `css-loader`, qui transforme la CSS en module JS avec exports des règles, et
// `style-loader`, qui va injecter ces règles à la volée dans le DOM, sur les
// éléments concernés, garantissant leur application quel que soit le contexte.
//
// En mode production, on configure le `ExtractTextPlugin` pour sortir toutes
// les CSS issues de feuilles autonomes en un seul fichier CSS optimisé, pour permettre
// l’application de styles dès le chargement, sans attendre que JS s’exécute.
import '../styles/TrackerScreen.styl'

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import HistoryIcon from 'material-ui/svg-icons/action/history'
import RaisedButton from 'material-ui/RaisedButton'
import SettingsIcon from 'material-ui/svg-icons/action/settings'

import { formatDate, getDayCounts } from '../lib/helpers'
import Gauge from '../components/Gauge'
import GoalTrackerWidget from '../components/GoalTrackerWidget'
import { progressOnGoal } from '../action-creators'

// Le composant conteneur
// ----------------------

export class TrackerScreen extends Component {
  // Petite méthode métier calculant notre pourcentage global d’accomplissement
  // des objectifs quotidiens.
  overallProgress () {
    const { todaysProgress, goals } = this.props
    const [totalProgress, totalTarget] = getDayCounts(todaysProgress, goals)

    // Évitons le cas où les objectifs auraient tous une cible à zéro, qui causerait
    // un progrès de `+Infinity`…
    return totalTarget === 0 ? 0 : Math.floor(totalProgress * 100 / totalTarget)
  }

  render () {
    // Décidément, la déstructuration est notre amie…
    const { dispatch, goals, today, todaysProgress } = this.props
    return (
      // Enrobage par un
      // [`<DocumentTitle>`](https://github.com/gaearon/react-document-title)
      // pour modifier automatiquement le titre de la fenêtre lorsqu’on affiche
      // ce composant conteneur.
      <DocumentTitle title='Mes objectifs du jour'>
        <Card className='goalTracker'>
          <CardTitle
            title={formatDate(today, 'LL')}
            subtitle={<Gauge value={this.overallProgress()} />}
          />
          <CardText>
            {
              goals.map((goal) => (
                <GoalTrackerWidget
                  key={goal.id}
                  goal={goal}
                  progress={todaysProgress[goal.id] || 0}
                  onProgress={() => dispatch(progressOnGoal(goal.id))}
                />
              ))
            }
          </CardText>
          <CardActions>
            <RaisedButton label='Historique' secondary
              icon={<HistoryIcon />} containerElement={<Link to='/history' />}
            />
            <RaisedButton label='Paramètres'
              icon={<SettingsIcon />} containerElement={<Link to='/settings' />}
            />
          </CardActions>
        </Card>
      </DocumentTitle>
    )
  }
}

// On s’intéresse uniquement aux champs `goals`, `today` et `todaysProgress` de l’état
// global, qu’on veut retrouver dans nos propriétés sous les mêmes noms.  Par ricochet,
// seuls les changements apportés à ces champs entraîneront un éventuel *re-render*
// de notre conteneur.
const mapStateToPops = ({ goals, today, todaysProgress }) => ({ goals, today, todaysProgress })

// C’est [`connect(…)`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options),
// fourni par Redux, qui fait les connexions nécessaires pour nous
// fournir les propriétés, implémenter notre `shouldComponentUpdate(…)` et nous fournir
// aussi une propriété `dispatch(…)`, pré-associée au *store* Redux transmis via le
// contexte React.
export default connect(mapStateToPops)(TrackerScreen)
