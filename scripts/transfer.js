const { copySync, renameSync, unlinkSync, rmSync } = require("fs-extra");

const transfer = () => {
	copySync('build', 'build-chrome', { overwrite: true, recursive: true });
	renameSync('build-chrome/manifest-chrome.json', 'build-chrome/manifest.json')
	unlinkSync('build-chrome/manifest-firefox.json')

	copySync('build', 'build-firefox', { overwrite: true, recursive: true });
	renameSync('build-firefox/manifest-firefox.json', 'build-firefox/manifest.json')
	unlinkSync('build-firefox/manifest-chrome.json')

	rmSync('build', { recursive: true, force: true });
};

transfer();