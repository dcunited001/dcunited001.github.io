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

// move graphics code outside of project to '../texel-graphics' project
// - use a config.js a la ~/dev/appistack/ng/app/config.js for env
// - import/merge config in webpack.config.js
// - use config.js values per-environment to configure a build directory
// - build bundle.js to the blog/js/3d/ folder
// - this keeps the blog separate and prevents me from require the one-off
//   jekyll-webpack-trendy-shiny-package plugin
// - now i can actually learn about ES6/React without slowing myself down or
//   mucking up the blog or having to learn how to exclude js/3d files from jekyll

// need to update node
// - build in ~/src, move to ~/local/bin
//   - upgrade xcode command-line tools
