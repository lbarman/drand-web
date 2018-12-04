module.exports = {
    entry: './src/drand.ts',
    output: {
      filename: 'dist/drand.js',
      path: __dirname,
      library: 'drand',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      "alias": {
        "request": "xhr"
      }
    },
  };