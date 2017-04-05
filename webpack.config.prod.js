var autoprefixer = require('autoprefixer')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var fs = require('fs')
var OfflinePlugin = require('offline-plugin')
var Path = require('path')
var rimraf = require('rimraf')
var shared = require('./webpack.config.shared')
var webpack = require('webpack')

var outputFolder = Path.resolve(__dirname, 'public')

if (fs.existsSync(outputFolder)) {
  rimraf.sync(outputFolder + '/**')
} else {
  fs.mkdirSync(outputFolder)
}

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      Path.resolve(__dirname, 'src/index.js')
    ]
  },
  output: {
    path: outputFolder,
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new CopyWebpackPlugin([{
      from: 'static',
      to: outputFolder
    }]),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    new OfflinePlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        postcss: [autoprefixer()]
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', options: shared.getAdjustedBabelOptions() }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'stylus-loader']
        })
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: { loader: 'url-loader', options: { limit: 10000 } }
      }
    ]
  }
}
