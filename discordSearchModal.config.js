const path = require('path');
const commonConfig = require('./webpack.config');

// TODO: make webpack.config.js used as common, and add it here, add the same thing for discord search,
// TODO: and remove CopyPlugin from npm dependencies
module.exports = {
	...commonConfig,
  entry: path.join(__dirname, 'src', 'contentScript', 'ConfigPage', 'index.tsx'),
	devServer: {
    compress: true,
    port: 8080,
		hot: true,
		watchFiles: ['src/contentScript/DiscordSearchModal/**'],
  },
  output: {
    filename: 'discordSearchModal.js',
    path: path.resolve(__dirname, 'build/contentScript'),
  },
};
