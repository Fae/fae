'use strict';

const path      = require('path');
const fs        = require('fs');
const webpack   = require('webpack');
const pkg       = require('../package.json');

const EntryGeneratorPlugin = require('./EntryGeneratorPlugin');

const srcBase = path.join(__dirname, '..', 'src');
const pluginbase = path.join(__dirname, '..', 'plugins');

const config = { pkg };

if (process.env.NODE_ENV === 'production') config.DEBUG = true;

module.exports = {
    // entry: path.join(__dirname, '..', 'src', 'index.js'),
    output: {
        path: path.join(__dirname, '..', 'dist'),
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
            {
                test: /\.(glsl|frag|vert)$/,
                exclude: /(node_modules|vendor)/,
                loader: 'webpack-glsl',
            },
        ],
    },
    resolve: {
        alias: {
            '@fay/core': srcBase,
            '@fay/scene': path.join(pluginbase, 'scene'),
            '@fay/sprite': path.join(pluginbase, 'sprite'),
            '@fay/textures': path.join(pluginbase, 'textures'),
        },
    },
    plugins: [
        // generate entry file
        new EntryGeneratorPlugin(),

        // don't emit output when there are errors
        new webpack.NoErrorsPlugin(),

        // Add a banner to output chunks
        new webpack.BannerPlugin(loadBannerText(), { raw: true, entry: true }),
    ],
};

function loadBannerText()
{
    let str = fs.readFileSync(path.join(__dirname, 'banner.txt'), 'utf8');

    str = str.replace('{{version}}', pkg.version);
    str = str.replace('{{compileDate}}', (new Date()).toISOString());
    str = str.replace('{{commitHash}}', fs.readFileSync('./.commit', 'utf8').trim());
    str = str.replace('{{homepage}}', pkg.homepage);
    str = str.replace('{{license}}', pkg.license);

    return str;
}
