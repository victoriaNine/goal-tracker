// Configuration Webpack de dev
// ============================

var autoprefixer = require('autoprefixer')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var OfflinePlugin = require('offline-plugin')
var Path = require('path')
var shared = require('./webpack.config.shared')
var webpack = require('webpack')

// Le dossier de sortie "théorique" (en dev, Webpack va en fait
// tout traiter en mémoire, pour une meilleure réactivité lors
// du *watch*)
var outputFolder = Path.resolve(__dirname, 'public')

module.exports = {
  // Points d’entrée
  // ---------------
  //
  // Les "sommets" de l’arborescence de dépendances de l’appli.
  // En d’autre termes, les points d’entrée de l’application.
  //
  // On a ici une seule entry (même si c’est un tableau), donc un seul
  // *bundle* en sortie.  Mais `entry` pourrait être un objet dont les
  // clés seraient les noms de bundles, et les valeurs les descriptifs
  // de contenus.
  entry: {
    app: [
      // On a besoin du polyfill de Babel pour la gestion des fonctions `async`,
      // vu qu'on prend en charge des navigateurs variés…
      'babel-polyfill',
      // En dev, on utilise le [HMR](https://webpack.github.io/docs/hot-module-replacement.html),
      // ce qui nécessite un petit morceau de JS «client» dans le bundle
      // exécuté au sein du navigateur.
      'webpack-hot-middleware/client',
      // Et par ailleurs, on a le point d’entrée de notre application
      // proprement dite.
      Path.resolve(__dirname, 'src/index.js')
    ]
  },
  // Fichiers en sortie
  // ------------------
  output: {
    // Le chemin de base pour les fichiers (bundles, etc.) à produire
    // lors d’un *build* (en dev, tout sera en mémoire, mais pour un
    // *build* on pondra bien les fichiers).
    path: outputFolder,
    // L’URL publique associée à ce chemin sur le disque, ce qui permet
    // d’ajuster les URLs produites en interne par Webpack.  Ici, la
    // racine du domaine.
    publicPath: '/',
    // Le nom du bundle (ou si on a plusieurs bundles,
    // le schéma de nommage).
    filename: '[name].js'
  },
  // Plugins
  // -------
  //
  // Les plugins indiquent des ajustements au traitement de fichiers
  // par Webpack, le plus souvent *a posteriori* mais parfois au fil
  // des transformations.
  plugins: [
    // Copie / met à dispo en mémoire des fichiers statiques vers un
    // chemin en sortie.  On aurait pu les coller direct dans `public/`,
    // mais alors Webpack ne les aurait pas «détectés», et d’autres
    // plugins ne les auraient pas pris en compte (tels que la gestion
    // de l’*offline*, par exemple).
    new CopyWebpackPlugin([{
      from: 'static',
      to: outputFolder
    }]),
    // La deuxième partie du HMR, le côté serveur.
    new webpack.HotModuleReplacementPlugin(),
    // On évite que des erreurs Webpack (fichiers manquants, etc.)
    // plantent complètement le serveur: on se contente de les afficher
    // sur la console et on attend que ça change pour ré-essayer.
    new webpack.NoEmitOnErrorsPlugin(),
    // Extraction automatique des modules npm dans un bundle à part, `vendor.js`.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    // Super plugin de traitement *a posteriori* qui génère et maintient
    // pour nous les fichiers nécessaires à un fonctionnement *offline-first*:
    // source de ServiceWorker (`sw.js`) et solution de secours basée
    // Application Cache (dossier `appcache`).
    new OfflinePlugin(),
    // Configuration PostCSS : on utilisera ici un traitement [Autoprefixer](https://github.com/postcss/autoprefixer#readme)
    // par défaut, parce qu’on n’est plus en 2010…
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer()]
      }
    })
  ],
  module: {
    // Chargeurs de syntaxe
    // --------------------
    //
    // C’est le cœur de Webpack: les chargeurs de syntaxe qui nous
    // permettent, depuis notre JS, de déclarer nos dépendances à des
    // *assets* quelconques (CSS, images, fontes…) via les mécanismes
    // habituels d’`import`/`require`.
    rules: [
      {
        // Toute dépendance aboutissant à un fichier `.js` sera
        // d’abord «moulinée» par Babel.  En revanche, on fout la paix au
        // contenu de `node_modules`, qui n’a pas vocation à être
        // transpilé.
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', options: shared.getAdjustedBabelOptions() }
      },
      {
        // Toute dépendance CSS pure (`.css`) passera par la trinité
        // classique: PostCSS pour l’auto-préfixage et autres
        // *post-processings*, CSS pour la transformation en objets
        // descriptifs et Style pour l’injection live dans la page.
        // Notez que dans une chaîne de *loaders* exprimée comme ça
        // (`String` avec des `!` en séparateurs), les *loaders* sont
        // en fait exploités de droite à gauche.
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        // Nos propres styles sont en [Stylus](http://stylus-lang.com/),
        // donc on utilise la même chaîne de traitement que pour les
        // CSS pures, mais avec la transpilation Stylus -> CSS d’abord.
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']
      },
      {
        // On a recours à plusieurs images (en fait, que des PNG pour
        // notre app, mais soyons inclusifs…), on utilisera donc le
        // URL Loader, une spécialisation du File Loader.  Ici, si
        // le fichier pèse moins de 10000 octets, il produira une URL
        // *inline* ("Data URI"), économisant ainsi une requête réseau
        // côté client.  Dans le cas contraire, il produira bien une
        // URL normale vers un fichier.
        test: /\.(jpe?g|png|gif)$/,
        use: { loader: 'url-loader', options: { limit: 10000 } }
      }
    ]
  },
  // Source Maps
  // -----------
  //
  // Webpack nous propose une bonne demi-douzaine de types de
  // [source maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
  // pour nos fichiers transpilés et le bundle final, mais seules
  // certaines garantissent le bon fonctionnement des points
  // d’arrêt dans Chrome.  On utilise ici celle qui, parmi les «bonnes»,
  // est créée le plus vite par Webpack.
  devtool: '#inline-source-map'
}
