const { copySync, existsSync, mkdirSync } = require("fs-extra");

const setup = () => {

	if (!existsSync('build')) {
		mkdirSync('build');
	}

	copySync('assets', 'build', { overwrite: true, recursive: true });
	copySync(
		'node_modules/webextension-polyfill/dist/browser-polyfill.js', 
		'build/browser-polyfill.js', 
		{ overwrite: true }
	);
};

setup();