/* eslint-env node */
'use strict';

const path      = require('path');
const fs        = require('fs');
const webpack   = require('webpack');
const NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');

const config = {};
if (process.env.NODE_ENV === 'production') config.DEBUG = true;

module.exports = {
    devtool: 'source-map',
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        library: 'Fay',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|vendor)/,
                loader: [
                    'babel?cacheDirectory=true&presets[]=es2015',
                    `preprocess?${JSON.stringify(config)}`,
                ],
            },
        ],
    },
    plugins: [
        // don't emit output when there are errors
        new NoErrorsPlugin(),

        // Add a banner to output chunks
        new webpack.BannerPlugin(fs.readFileSync('./banner.txt', 'utf8'), { raw: true, entry: true }),
    ],
};
