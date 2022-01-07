const path = require('path');
const fse = require('fs-extra');
const { execSync } = require('child_process');

const config = [
	{
		source: {
			path: path.resolve(__dirname, '../packages/modal/build'),
		},
		dest: {
			path: path.resolve(__dirname, '../build/modal'),
			extraFiles: ['index.html']
		},
	},
	{
		source: {
			path: path.resolve(__dirname, '../packages/background/build'),
		},
		dest: {
			path: path.resolve(__dirname, '../build/background'),
		},
	},
	{
		source: {
			path: path.resolve(__dirname, '../packages/popup/build'),
		},
		dest: {
			path: path.resolve(__dirname, '../build/popup'),
		},
	},
]

const build = () => {
	// build the packages
	execSync('yarn build:packages');
	execSync('node scripts/setup.js');

	return Promise.all(config.map(({dest, source}) => new Promise((res, rej) => {
		const dirExists = fse.existsSync(dest.path);
		// make sure that path exists
		if (dirExists) {
			fse.rmSync(dest.path, {
				recursive: true
			});
		} 

		fse.mkdirSync(dest.path, {
			recursive: true
		});

		fse.copySync(source.path, dest.path, { recursive: true });

		if (dest.extraFiles) {
			dest.extraFiles.forEach((file) => fse.removeSync(path.resolve(dest.path, file)))
		}
	})));
}

build();
