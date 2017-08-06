const webpack = require('webpack');
const path = require('path');

"use strict";

// TODO: add multiple entry points, so that each animation can have it's own tests
// TODO: add a karma.all.conf.js to run all tests
// files: ['test/index.js'],
// preprocessors: {
//   'test/index.js': ['webpack', 'sourcemap']
// },

module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['tap'],

    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 1000000,

    files: [
      './test/lib/*.test.js'
    ],
    preprocessors: {
      './test/lib/*.test.js': ['webpack', 'sourcemap']
    },

    reporters: ['html', 'tap'],

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