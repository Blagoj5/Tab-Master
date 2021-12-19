const { copyFile, existsSync, mkdirSync } = require("fs");

const filesToCopy = [
	'manifest.json', 
	'icon16.png', 
	'icon48.png', 
	'icon128.png'
];

const setup = () => {

	if (!existsSync('build')) {
		mkdirSync('build');
	}

	Promise.all(filesToCopy.map((fileName) => new Promise((res, rej) => {
		copyFile(`assets/${fileName}`, `build/${fileName}`, (err) => {
			if (err) {
				rej(err);
			}

			res(true);
		});
	})))
	.then(() => process.exit(0))
	.catch((err) => console.error(err));
};

setup();