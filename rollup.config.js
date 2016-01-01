import { readFileSync } from 'fs';

import multiEntry, { entry } from 'rollup-plugin-multi-entry';
import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';
// import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

let pkg = JSON.parse(readFileSync('package.json', 'utf8'));
pkg.compileDate = new Date();
pkg.commitHash = (function () {
    try {
        return readFileSync('.commithash', 'utf8').trim();
    } catch (err) {
        return 'unknown';
    }
})();

let banner = readFileSync('banner.txt', 'utf8').replace(/\{\{([^\}]+)\}\}/g, function (match, p1) {
    return pkg[p1];
});

export default {
    entry,
    plugins: [
        multiEntry('src/**/*.js'),
        babel({
            exclude: './node_modules/**'
        }),
        npm({
            jsnext: true,
            main: true
        }),
        // commonjs()
        replace({
            include: './src/Consts.js',
            delimiters: ['{{', '}}'],
            sourceMap: true,
            values: pkg
        })
    ],
    external: ['fs'],
    banner,
    sourceMap: true,
    moduleName: pkg.name
};
