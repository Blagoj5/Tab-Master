const ncp = require('ncp').ncp;
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const config = [
	{
		source: {
			path: path.resolve(__dirname, '../packages/modal/build'),
			files: ['index.js']
		},
		dest: {
			path: path.resolve(__dirname, '../build/content'),
			files: ['modal.js']
		},
	},
	{
		source: {
			path: path.resolve(__dirname, '../packages/background/build'),
			files: ['index.js']
		},
		dest: {
			path: path.resolve(__dirname, '../build/background'),
			files: ['index.js']
		},
	},
	{
		source: {
			path: path.resolve(__dirname, '../packages/popup/build'),
			files: ['index.js', 'index.html']
		},
		dest: {
			path: path.resolve(__dirname, '../build/popup'),
			files: ['popup.js', 'popup.html']
		},
	},
]

const build = () => {
	// build the packages
	execSync('yarn build:packages');
	execSync('node scripts/setup.js');

	return Promise.all(config.map(({dest, source}) => new Promise((res, rej) => {
		// all files that need copy
		const files = source.files.map((fileName) => path.join(source.path, fileName));
		const destFiles = dest.files.map((fileName) => path.join(dest.path, fileName));

		const dirExists = fs.existsSync(dest.path);
		// make sure that path exists
		if (dirExists) {
			fs.rmSync(dest.path, {
				recursive: true
			});
		} 

		fs.mkdirSync(dest.path, {
			recursive: true
		});

		files.forEach((file, index) => {

			const destination = destFiles[index];
			ncp(file, destination, (err) => {
				if (err) rej(err);

				// change the injection name
				if (path.extname(file) === '.html') {
					const jsFile = destFiles.find((f) => path.extname(f) === '.js');
					if (jsFile ) {
						const fileName = path.basename(jsFile);
						const htmlContent = fs.readFileSync(file, {
							encoding: 'utf8'
						});
						const correctlyInjectedHtmlContent = htmlContent.replace('index.js', fileName);
						fs.writeFileSync(destination, correctlyInjectedHtmlContent)
					}
				};

				res(true)
			})
		})
	})));
}

build();
