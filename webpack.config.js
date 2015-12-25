var webpack = require('webpack');

module.exports = {
	entry: './equip-ui.ts',
	output: {
		filename: 'build/equip-ui.js'
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