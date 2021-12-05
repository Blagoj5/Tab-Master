const { copyFile } = require("fs");

const setup = () => {
	copyFile('manifest.json', 'build/manifest.json', (err) => {
		if (err) {
			console.log('err: ', err);
			process.exit(1);
		}

		process.exit(0);
	});
};

setup();