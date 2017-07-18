const webpack = require('webpack');
const path = require('path');

const debug = (process.argv.slice(3)).some(argv => argv === '--debug');
const watch = (process.argv.slice(3)).some(argv => argv === '--watch');

"use strict";

// TODO: add multiple entry points, so that each animation can have it's own tests
// TODO: add a karma.all.conf.js to run all tests
  // files: ['test/index.js'],
  // preprocessors: {
  //   'test/index.js': ['webpack', 'sourcemap']
  // },

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: !debug,
    autowatch: watch,

    frameworks: ['tap'],
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,

    files: [
      'test/utils/*.test.js'
    ],
    preprocessors: {
      'test/utils/*.test.js': ['webpack', 'sourcemap']
    },

    reporters: ['tap-pretty', 'html'],
    tapReporter: {
      prettifier: 'tap-spec',
      sepparator: true
    },
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
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
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
  })
};