'use strict'
const webpack = require('webpack')
const { resolve } = require('path')
// const ExtractTextPlugin = require()
const HtmlWebpackPlugin = require('html-webpack-plugin')

let config = {
	entry: {
		app: [resolve(__dirname, '../src/main.js')]
	},
	output:{
		path: resolve(__dirname, '../dist'),
		filename: "js/[name].js",
		chunkFilename: "js/[name].[hash:8].js",
		publicPath: "/"
	},
	resolve: {
		extensions: ['.js', '.vue', '.json']
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						css: [
							{ loader: 'style-loader', options: { sourceMap: true } },
							{ loader: 'css-loader', options: { sourceMap: true } },
							{ loader: 'postcss-loader', options: { sourceMap: true } },
						],
						less: [
							{ loader: 'style-loader', options: { sourceMap: true } },
							{ loader: 'css-loader', options: { sourceMap: true } },
							{ loader: 'less-loader', options: { sourceMap: true } },
							{ loader: 'postcss-loader', options: { sourceMap: true } },
						]
					},
		      preserveWhitespace: false,
	      }
      },
			{
				test:/\.js$/,
				exclude:/(node_modules|bower_components)/,
				use:{
					loader:'babel-loader',
					options:{
						presets:['env'],
						plugins:['transform-runtime']
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					{ loader: 'style-loader', options: { sourceMap: true } },
					{ loader: 'css-loader', options: { sourceMap: true } },
					{ loader: 'postcss-loader', options: { sourceMap: true } },
				]
			},
			{
				test: /\.less$/,
				use: [
					{ loader: 'style-loader', options: { sourceMap: true } },
					{ loader: 'css-loader', options: { sourceMap: true } },
					{ loader: 'less-loader', options: { sourceMap: true } },
					{ loader: 'postcss-loader', options: { sourceMap: true } },
				]
			},
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|svgz)$/,
				use:{
					loader: 'file-loader',
					options: {
						name: 'assets/images/[name].[ext]?[hash]'
					}
				}
			}
		
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: resolve(__dirname,'../src/index.html'),
			chunks:['app'],
			hash: true
		})
	]
}

module.exports = config