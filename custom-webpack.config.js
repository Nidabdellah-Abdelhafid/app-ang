const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      stream: 'readable-stream',
      'readable-stream': path.resolve(__dirname, 'node_modules/readable-stream'),
      'safe-buffer': path.resolve(__dirname, 'node_modules/safe-buffer')
    },
    fallback: {
      "vm": require.resolve("vm-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("readable-stream"),
      "assert": require.resolve("assert/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "buffer": require.resolve("buffer/"),
      "util": require.resolve("util/"),
      "process": require.resolve("process/browser"),
      "zlib": require.resolve("browserify-zlib"),
      "path": require.resolve("path-browserify"),
      "constants": false,
      "fs": false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      setImmediate: ['timers-browserify', 'setImmediate']
    }),
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.version': JSON.stringify('v16.0.0')
    })
  ]
};