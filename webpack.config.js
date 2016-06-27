/* eslint-env node */
'use strict';

const path      = require('path');
const fs        = require('fs');
const webpack   = require('webpack');
const NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');
const pkg       = require('./package.json');

const config = {};

if (process.env.NODE_ENV === 'production') config.DEBUG = true;

module.exports = {
    entry: './src/index.js',
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
                loaders: [
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
        new webpack.BannerPlugin(loadBannerText(), { raw: true, entry: true }),
    ],
};

function loadBannerText()
{
    let str = fs.readFileSync('./banner.txt', 'utf8');

    str = str.replace('{{version}}', pkg.version);
    str = str.replace('{{compileDate}}', (new Date()).toISOString());
    str = str.replace('{{commitHash}}', fs.readFileSync('./.commit', 'utf8').trim());
    str = str.replace('{{homepage}}', pkg.homepage);
    str = str.replace('{{license}}', pkg.license);

    return str;
}
