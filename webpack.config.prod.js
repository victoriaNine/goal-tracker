// Configuration Webpack de production
// ===================================

var autoprefixer = require('autoprefixer')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var fs = require('fs')
var OfflinePlugin = require('offline-plugin')
var Path = require('path')
var rimraf = require('rimraf')
var shared = require('./webpack.config.shared')
var webpack = require('webpack')

// Dossier de sortie
// -----------------
//
// Le dossier de sortie est ici `public`, au même niveau que ce
// fichier de configuration (dans le même répertoire).
var outputFolder = Path.resolve(__dirname, 'public')

if (fs.existsSync(outputFolder)) {
  // S’il existe, on vire d’abord tout son contenu, pour repartir
  // de frais et ne pas y laisser des trucs obsolète
  rimraf.sync(outputFolder + '/**')
} else {
  // Sinon, on le crée à la volée
  fs.mkdirSync(outputFolder)
}

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
      // Le point d’entrée de notre application proprement dite.
      Path.resolve(__dirname, 'src/index.js')
    ]
  },
  // Fichiers en sortie
  // ------------------
  output: {
    // Le chemin de base pour les fichiers (bundles, etc.) à produire
    // lors d’un *build*.
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
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    // Copie / met à dispo en mémoire des fichiers statiques vers un
    // chemin en sortie.  On aurait pu les coller direct dans `public/`,
    // mais alors Webpack ne les aurait pas «détectés», et d’autres
    // plugins ne les auraient pas pris en compte (tels que la gestion
    // de l’*offline*, par exemple).
    new CopyWebpackPlugin([{
      from: 'static',
      to: outputFolder
    }]),
    // Optimisation Webpack: minification des sources JS grâce
    // à l’excellent [UglifyJS](http://lisperator.net/uglifyjs/).
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      sourceMap: true
    }),
    // Production de bundles à part pour certains types de fichiers.
    // Ici, on indique un bundle cible unique (`allChunks: true`) qu’on
    // appellera `app.css`.  Il restera à indiquer aux chargeurs de
    // syntaxe CSS qu’on veut les faire aboutir vers ce *bundle*, ce que
    // nous verrons plus bas.
    new ExtractTextPlugin({
      filename: 'app.css',
      allChunks: true
    }),
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
      minimize: true,
      debug: false,
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader']
        })
      },
      {
        // Nos propres styles sont en [Stylus](http://stylus-lang.com/),
        // donc on utilise la même chaîne de traitement que pour les
        // CSS pures, mais avec la transpilation Stylus -> CSS d’abord.
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'stylus-loader']
        })
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
  }
}
