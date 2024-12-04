const path = require('path');

module.exports = {
  entry: './src/vocabGardenAppIndex.js', // Entry point of React code
  output: {
    path: path.resolve(__dirname, 'public/react_javascripts'),
    filename: 'bundle.js', // Output bundle
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transpile both .js and .jsx files
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these extensions
  },
};
