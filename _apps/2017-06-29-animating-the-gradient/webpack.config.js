var path = require('path'),
  _ = require('underscore'),
  config = require('./config.json');

var nodeEnv = process.env.NODE_ENV || 'development';

var conf = _.extend(
  { nodeEnv: nodeEnv },
  config['common'],
  config[nodeEnv]);

module.exports = {
  entry: './es6/main.js',
  output: {
    path: __dirname + '/' + conf.buildPath,
    filename: '2017-06-29-animating-the-gradient.js'
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'es6'),
        loader: 'babel-loader'
      }]
  }
};
