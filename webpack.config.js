var webpack = require('webpack');

module.exports = {
	entry: './nes-1942.ts',
	output: {
		filename: 'build/nes-1942.js'
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