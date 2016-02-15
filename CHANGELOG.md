# Évolution de la codebase Goal Tracker

## Prochainement…

- *Server-Side Rendering* (« SSR »)
- Passage à React-Router 4 (une fois sorti)

## 2.1.0 - 13/02/2017

- Passage à Webpack 2 (2.2.1)
- Layout de `TrackerScreen` à base de flexbox (enfin jetée, la `<table>` honteuse !)
- Tweaks des étapes des *reducers* pour taper moins de *boilerplate* et généraliser le *pattern* « `initialState` / `expectedState` ».
- Ajout d’une case à cocher « Rester ouvert » pour le dialogue d’ajout d’objectif.
- Jest *snapshot testing*

## 2.0.0 - 13/01/2017

### Améliorations

- Webpack
  + passage à deux configurations manuelles (dev et prod) au lieu d’une config « automagique » générée par hjs-webpack.  Permet une meilleure compréhension, et évolue plus facilement.
  + Parallélisation avec HappyPack
  + Mise en cache des transpilations Babel
- Serveur de dev personnalisé
  + Webpack intégré (*dev middleware*, *hot middleware* et *dashboard*)
  + API de login avec un délai garanti de 500ms minimum (histoire de voir l’UI attendre un court instant)
  + *Deep linking* (envoi du `index.html` pour toute requête sur URL inconnue)
- Nouvelles étapes intégrées
  + Login asynchrone (après l’avoir fait en synchrone), donc actions Redux asynchrones
  + Manifeste applicatif (axe PWA) et série d’icônes adaptés

### Divers

- Mise à jour des dépendances externes vers leurs dernières versions
- Retrait du hook de pre-commit automatique
- `favicon.ico` dérivé du nouvel icône (celui utilisé pour la PWA)
- Plus de fonction `loggedIn` dans `store` : on passe directement par l’examen de `currentUser.loginState`. Ça réduit les dépendances à `store`, ce qui facilitera à terme le *server-side rendering*.
- Code annoté directement dans la branche `master`, juste après la dernière étape (`finish`).  Le dossier `doc` de la branche est tenu à jour, les apprenant·e·s n’ont donc pas besoin de le regénérer après récupération.

## 1.3.1 - 20/12/2016

### Améliorations

- Babel : Passage au preset `env` pour alléger le volume de transpilation en fonction de notre cible navigateurs.
- Babel : Plus besoin du *stage 2*, le *stage 3* nous suffit.
- Standard : au lieu de décrire des globaux sortis de nulle part, on définit nos 3 environnements d'exécution : le navigateur, Node et Jest (meilleures pratiques)
- `AddSettingDialog` : plus de `bind` au sein du `render`
 (anti-pattern de performance) : on revient sur des fonctions fléchées et des appels explicites.  Moins « magique » à la lecture, donc double avantage.
- Réducteurs : Simplification / rationalisation de la composition des *slice reducers* et de nos réducteurs globaux à l’aide de `reduce-reducers`.

### Divers

- Mise à jour des dépendances externes vers leurs dernières versions
- Retrait de `test/mocha.opts` qui avait été oublié là lors du passage à Jest

## 1.3.0 - 30/11/2016

### Améliorations

- Tests : passage de Mocha + NYC à Jest, tout en gardant Enzyme et Chai en interne.  Cela permet notamment :
  + Une UI plus agréable
  + Une exécution plus rapide des tests, car parallélisée
  + Un lancement plus ciblé des tests, notamment en mode *watch*
  + Un meilleur affichage des parties non couvertes dans les rapports de *coverage*
- `propTypes` plus étoffées
- Constructeurs des composants ES6 avec un passage explicite de tous les arguments (meilleures pratiques)
- Standardisation du recours à `DEFAULT_STATE` (après `AddSettingDialog`, `SettingsScreen`)
- `clock` : Unification des intervalles (`setInterval`…) utilisés
- Tests : Utilisation du plugin Sinon pour Chai
- Webpack : changement du type de sourcemap générée, pour retrouver une capacité de débogage / point d’arrêt opérationnelle dans Chrome.

### Divers

- Mise à jour massive des dépendances externes vers leurs dernières versions

## 1.2.6 - 21/11/2016

Renommage massif des fichiers de composants pour utiliser la même casse que la classe exportée (meilleures pratiques), ainsi que des fichiers de réducteurs pour utiliser celle de la fonction exportée

## 1.2.5 - 31/10/2016

### Améliorations

- Tâche `npm run start:d` qui enrobe `start` avec Webpack Dashboard, plus informatif
- Centralisation de l’interface Redux/PouchDB dans le seul fichier `store`

### Divers

- Retrait des *props* `linkButton` qui restaient par oubli
- Retrait du réglage `https` pour le serveur de dev Webpack (jamais utilisé/nécessaire)

## 1.2.4 - 26/09/2016

### Améliorations

- Plus de dépendance à Lo-Dash : on préfère des ré-implémentations « functional JS » des 2 endroits qui s’en servaient, à base de `filter` et `find`
- `clock` : Simplification des comparaisons horaires
- *Namespacing* des constantes de types d’actions Redux, en conformité avec les meilleures pratiques

### Divers

- Material UI 0.15 ne reconnaît / nécessite plus la *prop* `linkButton` : on la vire

## 1.2.3 - 29/06/2016

### Améliorations

- `goals` (réducteur) : implémentation plus « functional JS » (basée `reduce`)

### Divers

- Mise à jour des dépendances externes vers leurs dernières versions.

## 1.2.2 - 12/05/2016

### Améliorations

- Tâche `npm run build` désormais garantie en `NODE_ENV=production`
- Fusion des tests des *action creators* avec leurs réducteurs respectifs, dans l’esprit des meilleures pratiques recommandées par l’auteur de Redux.
- `favicon.ico` (icône Redux :wink:)

### Divers

- Mise à jour massive des dépendances externes vers leurs dernières versions. Cela a notamment entraîné :
  - Une ré-écriture complète des imports Material UI, qui avait changé de façon incompatible toute son arbo de fichiers composants :tired_face:
  - Certaines règles de StandardJS étaient apparues aussi, d’où divers reformatages (notamment la terminaison des balises JSX auto-fermantes)
  - L’ajustement de la fourniture des gestions d’historique pour le routage (React-Router 3 propose des singletons pour chaque type de gestion)

## 1.2.1 - 14/04/2016

### Améliorations

- Refactoring des réducteurs d’historisation et de la clé `today` pour les rendre plus similaires (en termes de structure fichiers) aux *slice reducers*

### Divers

- Changement de licence vers du No-License

## 1.2.0 - 19/03/2016

### Correctifs

- `AddSettingDialog` : ajout de `id: undefined` dans `DEFAULT_STATE` pour éviter qu’un ajout suite à une mise à jour abandonnée ne finalise—à tort, évidemment—cette mise à jour.

### Améliorations

- Tâche `npm run doc` utilisant Groc
- Tâche `npm run test:cov` pour la couverture de tests avec NYC / Istanbul
- Tâche `npm run deploy` pour le déploiement sur Surge.sh
- Codage couleur de `Gauge`
- Extraction des logiques `getCompletionRadio` et `getDayCounts`  afin de les réutiliser dans les rappels périodiques
- `clock` : rappels périodiques
- Tests exhaustifs des *action creators*
- Tests exhaustifs (fournis) des *helpers*
- Plus de déstructurations pertinentes des arguments de méthodes
- Plus de recours pertinents aux valeurs par défaut sur les arguments de méthodes
- Pas d’import « en masse » de modules lourds : on préfère des imports ciblés pour faciliter à terme le *tree shaking* (ex. codes couleurs de Material UI)
- Retrait du champ superflu `userName` dans l’état `currentUser`

### Divers

- Retrait des ressources de configuration Sublime Text 3

## 1.1.0 - 19/02/2016

### Correctifs

- `AddSettingDialog` : Restauration d’un état par défaut acceptable

### Améliorations

- Tags de début d’étape évitant aux apprenant la saisie du *boilerplate* et des imports de modules tiers (notamment depuis Material UI)
- `clock` : Passage du déclenchement dev de l’historisation de 10’ à 20”
- `clock` : Restructuration du code de gestions des permissions de notifications web
- `SettingsScreen` : Restructuration de l’état local
- `goals` (reducteur et spec) : implémentation plus « functional JS »
- `GoalTrackerWidget` (spec) : passage d’une valeur de progrès à plusieurs valeurs-clés pour les tests
- `propTypes` plus étoffés
- Configuration TernJS du projet

### Divers

- Ajout de ressources de configuration Sublime Text 3

## 1.0.0 - 11/02/2016

Premier jet de la « version 2016 ».
