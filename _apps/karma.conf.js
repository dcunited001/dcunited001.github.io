const webpack = require('webpack');
const path = require('path');

// TODO: add multiple entry points, so that each animation can have it's own tests

module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'chai'],

    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 1000000,

    files: [
      './spec/lib/*.spec.js'
    ],
    preprocessors: {
      './spec/lib/*.spec.js': ['webpack', 'sourcemap']
    },

    reporters: ['html', 'mocha'],

    htmlReporter: {
      outputFile: './test/test-results.html',
      pageTitle: 'Tests',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: true
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/,
            exclude: [/node_modules/, /vendor\/bower/],
            loader: 'babel-loader'}
          // {test: /\.json$/, loader: 'json-loader'}
        ]
      },
      node: {
        fs: 'empty'
      },
      resolve: {
        extensions: ['.js', '.json']
      }
    },

    webpackServer: {
      noInfo: true
    }

    // plugins: [ ] // defaults to 'karma-*'
  });
};