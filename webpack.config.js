const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	devtool: 'inline-source-map',
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
};