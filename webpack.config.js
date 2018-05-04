const path = require('path');

console.log('\n');

module.exports = {
	devtool: 'source-map',
	mode: 'production',
	entry: ['./lib/index.js'],

	output: {
		publicPath: '/',
		path: path.resolve('./build'),
		filename: 'index.js',
		libraryTarget: 'umd'
	},

	externals: [/(react)/],

	resolve: {
		extensions: ['.js']
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: ['node_modules']
			}
		]
	},

	stats: {
		colors: true,
		hash: false,
		timings: false,
		assets: true,
		chunks: false,
		chunkModules: false,
		modules: false,
		children: true
	}
};
