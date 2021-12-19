const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: path.join(__dirname, 'src', 'index.tsx'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
	devtool: process.env.NODE_ENV === 'production' ? undefined : 'inline-source-map',
  devServer: {
    compress: true,
    port: 8080,
		hot: true,
		watchFiles: ['src/**'],
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
							'@babel/preset-env', 
							'@babel/preset-typescript', 
							['@babel/preset-react', {
								"runtime": "automatic"
							}]
						],
						plugins: [
							["babel-plugin-styled-components", {
								pure: true,
								"minify": false,
								"transpileTemplateLiterals": false
							}],
							["@babel/plugin-transform-runtime"]
						],
          }
        }
      },
			{
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
			{    
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: "file-loader"
			},
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'contentScript', 'ConfigPage', 'config-page.html'),
			// inject only the needed script, not all scripts in this file
			templateParameters: {
				scriptInjection: '<script defer="defer" src="configPage.js"></script>'
			},
			inject: false,
			filename: 'config-page.html'
    }),
  ],
};