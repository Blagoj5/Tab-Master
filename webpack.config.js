const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: path.join(__dirname, "pages", "index.tsx"),
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
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/pages'),
  },
	plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "pages", "discord-search.html"),
    }),
  ],
};