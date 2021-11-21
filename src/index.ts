import { copyFile } from "fs";

const setup = () => {
	copyFile('manifest.json', 'dist/manifest.json', (err) => {
		if (err) {
			console.log('err: ', err);
			process.exit(1);
		}

		process.exit(0);
	});
};

setup();

export default setup;