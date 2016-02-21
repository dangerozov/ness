var webpack = require('webpack');

module.exports = {
	entry: './equip.ts',
	output: {
		filename: 'build/equip.js'
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