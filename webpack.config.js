const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    configPage: path.join(__dirname, 'src', 'contentScript', 'ConfigPage', 'index.tsx'),
		discordSearchModal: path.join(__dirname, 'src', 'contentScript', 'DiscordSearchModal', 'index.tsx'),
	},
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/contentScript'),
  },
	devtool: 'inline-source-map',
  devServer: {
    compress: true,
    port: 8080,
		hot: true,
		watchFiles: ['src/contentScript/**'],
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
							['@babel/preset-react', {"runtime": "automatic"}]
						]
          }
        }
      },
			{
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
	// only html page needed is for config page
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