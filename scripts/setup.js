const { copySync, existsSync, mkdirSync } = require("fs-extra");

const setup = () => {

	if (!existsSync('build')) {
		mkdirSync('build');
	}

	copySync('assets', 'build', { overwrite: true, recursive: true });
};

setup();