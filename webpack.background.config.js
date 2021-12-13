const path = require('path');

module.exports = {
	mode: 'production',
  entry: path.join(__dirname, 'src', 'backgroundScript', 'index.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build/backgroundScript'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
          loader: "babel-loader",
					options: {
            presets: [
							'@babel/preset-typescript', 
							[
								'@babel/preset-env', 
								{
									targets: {
										esmodules: true,
									},
								}
							]
						],
						ignore: ['./src/backgroundScript/.eslintrc.js'],
          }
        }
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
	optimization: {
		// TODO: check if this minification is okay
    minimize: process.env.NODE_ENV === 'production' ? true : false,
  }
};