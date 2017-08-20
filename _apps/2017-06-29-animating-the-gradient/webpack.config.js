var path = require('path'),
  _ = require('underscore'),
  config = require('./config.json'),
  WebpackBuildNotifier = require('webpack-build-notifier');

var nodeEnv = process.env.NODE_ENV || 'development';

var conf = _.extend(
  {nodeEnv: nodeEnv},
  config['common'],
  config[nodeEnv]);

module.exports = {
  entry: './es6/main.js',
  devtool: 'sourcemap',
  output: {
    path: __dirname + '/' + conf._buildPath,
    filename: '2017-06-29-animating-the-gradient.js'
  },
  module: {
    loaders: [
      { test: path.join(__dirname, 'es6'), loader: 'babel-loader' },
      { test: /\.glsl$/, loader: 'webpack-glsl' }
    ]
  },
  plugins: [
    new WebpackBuildNotifier({
      title: conf['_app'].name,
      sound: 'Hero',
      successSound: 'Tink',
      suppressSuccess: true
    })
  ]
};
