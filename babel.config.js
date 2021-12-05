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

const ignore = ['./src/backgroundScript/.eslintrc.js'];

module.exports = { 
	presets,
	ignore,
 };