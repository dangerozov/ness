var webpack = require('webpack');

module.exports = {
	entry: './webgl.ts',
	output: {
		filename: 'build/webgl.js'
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['', 'webpack.js', '.web.js', '.ts', '.js']
	},
	module: {
		loaders: [
			{ test: /\.ts$/, loader: 'ts-loader' }
		]
	}
}