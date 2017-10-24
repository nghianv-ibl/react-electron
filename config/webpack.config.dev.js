'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: [
		require.resolve('react-dev-utils/webpackHotDevClient'),
		require.resolve('./polyfills'),
		paths.appIndexJs,
	],
	output: {
		path: paths.appBuild,
		pathinfo: true,
		filename: 'static/js/bundle.js',
		chunkFilename: 'static/js/[name].chunk.js',
		publicPath: publicPath,
		// Point sourcemap entries to original disk location (format as URL on Windows)
		devtoolModuleFilenameTemplate: info =>
			path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
	},
	resolve: {
		// This allows you to set a fallback for where Webpack should look for modules.
		// We placed these paths second because we want `node_modules` to "win"
		// if there are any conflicts. This matches Node resolution mechanism.
		// https://github.com/facebookincubator/create-react-app/issues/253
		modules: ['node_modules', paths.appNodeModules].concat(
			// It is guaranteed to exist because we tweak it in `env.js`
			process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
		),
		extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
		alias: {
			'react-native': 'react-native-web',
		},
		plugins: [
			new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
		],
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				test: /\.(js|jsx)$/,
				enforce: 'pre',
				use: [{
					options: {
						formatter: eslintFormatter,
						eslintPath: require.resolve('eslint'),

					},
					loader: require.resolve('eslint-loader'),
				},],
				include: paths.appSrc,
			},
			{
				oneOf: [
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						loader: require.resolve('url-loader'),
						options: {
							limit: 10000,
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
					{
						test: /\.(js|jsx)$/,
						include: paths.appSrc,
						loader: require.resolve('babel-loader'),
						options: {
							cacheDirectory: true,
						},
					},
					{
						test: /\.css$/,
						use: [
							require.resolve('style-loader'),
							{
								loader: require.resolve('css-loader'),
								options: {
									importLoaders: 1,
								},
							},
							{
								loader: require.resolve('postcss-loader'),
								options: {
									ident: 'postcss',
									plugins: () => [
										require('postcss-flexbugs-fixes'),
										autoprefixer({
											browsers: [
												'>1%',
												'last 4 versions',
												'Firefox ESR',
												'not ie < 9',
											],
											flexbox: 'no-2009',
										}),
									],
								},
							},
						],
					},
					{
						exclude: [/\.js$/, /\.html$/, /\.json$/],
						loader: require.resolve('file-loader'),
						options: {
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			},
		],
	},
	plugins: [
		new InterpolateHtmlPlugin(env.raw),
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.DefinePlugin(env.stringified),
		new webpack.HotModuleReplacementPlugin(),
		new CaseSensitivePathsPlugin(),
		new WatchMissingNodeModulesPlugin(paths.appNodeModules),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	],
	node: {
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
	performance: {
		hints: false,
	},
	target: 'electron-renderer'
};