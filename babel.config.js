const presets = [
	'@babel/preset-typescript', 
	[
		'@babel/preset-env', 
		{
			targets: {
				esmodules: true,
			},
		}
	]
];
const ignore = ['./src/.eslintrc.js'];

module.exports = { 
	presets,
	ignore,
 };