const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  devtool: 'source-map'
}
