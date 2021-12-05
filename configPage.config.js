const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.config');

// TODO: make webpack.config.js used as common, and add it here, add the same thing for discord search,
// TODO: and remove CopyPlugin from npm dependencies
module.exports = {
	...commonConfig,
  entry: path.join(__dirname, 'src', 'contentScript', 'ConfigPage', 'index.tsx'),
  devServer: {
    compress: true,
    port: 8081,
		hot: true,
		watchFiles: ['src/contentScript/ConfigPage/**'],
  },
  output: {
    filename: 'configPage.js',
    path: path.resolve(__dirname, 'build/contentScript'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'contentScript', 'ConfigPage', 'config-page.html'),
			inject: true,
			filename: 'config-page.html'
    }),
  ],
};
