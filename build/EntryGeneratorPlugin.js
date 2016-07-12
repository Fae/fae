'use strict';

const path      = require('path');
const fs        = require('fs');
const async     = require('async');
const buildName = require('./build-name');

const SingleEntryDependency = require('webpack/lib/dependencies/SingleEntryDependency');

/**
 * @class
 */
class EntryGeneratorWebpackPlugin
{
    /**
     * @param {string[]} plugins - The plugins to include in the build.
     */
    constructor(plugins)
    {
        plugins = plugins || (process.env.FAY_PLUGINS ? process.env.FAY_PLUGINS.split(',') : []);

        this.outputFile = `entry-${buildName(plugins)}.js`;
        this.plugins = plugins;
    }

    /**
     * Called by webpack to apply the plugin.
     *
     * @param {object} compiler - The webpack compiler object.
     */
    apply(compiler)
    {
        const onRunhandler = (a, b) => this.onRun(a, b);

        compiler.plugin('run', onRunhandler);
        compiler.plugin('watch-run', onRunhandler);

        compiler.plugin('compilation', (c, p) => this.onCompilation(c, p));
        compiler.plugin('make', (c, f) => this.onMake(c, f));
    }

    /**
     * Called by webpack when compilation object is created.
     *
     * @param {object} compilation - The webpack compilation object.
     * @param {object} params - Params to the compilation creation?
     */
    onCompilation(compilation, params)
    {
        const normalModuleFactory = params.normalModuleFactory;

        compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
    }

    /**
     * Called by webpack when compilation begins the make process.
     *
     * @param {object} compilation - The webpack compilation object.
     * @param {function} done - Callback to call when complete.
     */
    onMake(compilation, done)
    {
        const dep = new SingleEntryDependency(this.outputFile);

        dep.loc = 'main';

        compilation.addEntry(compilation.compiler.context, dep, 'main', done);
    }

    /**
     * Called by webpack when starting to run the compiler.
     *
     * @param {object} compiler - The webpack compiler object.
     * @param {function} done - Callback to call when complete.
     */
    onRun(compiler, done)
    {
        const basePath = compiler.context || process.cwd();

        this.outputFile = path.resolve(basePath, this.outputFile);

        fs.access(this.outputFile, fs.R_OK | fs.W_OK, (err) =>
        {
            if (err && err.code !== 'ENOENT') return done(err);

            // At this point it either exists, and we can write to it, or
            // it doesn't exist at all. Either way, we can continue.

            // set entry string with export for core.
            let str = 'export * from \'@fay/core\';\n\n';

            this.loadPluginData((err, pluginData) =>
            {
                if (err) return done(err);

                // add exports for each plugin
                for (let i = 0; i < pluginData.length; ++i)
                {
                    const data = pluginData[i];
                    const pkg = data.pkg;
                    const namespace = pkg.fay && pkg.fay.namespace ? pkg.fay.namespace : pkg.name.replace('@fay/', '');

                    str += `import * as ${namespace} from '${data.pkg.name}';\n`;
                    str += `export { ${namespace} };\n\n`;
                }

                // write exports and update entry
                fs.writeFile(this.outputFile, str, done);

                return null;
            });

            return null;
        });
    }

    /**
     * Loads the package data about plugins.
     *
     * @param {function} cb - Callback to call when complete.
     */
    loadPluginData(cb)
    {
        // load all the descriptors for all the plugins
        async.map(this.plugins, (name, next) =>
        {
            const pluginPath = path.join(__dirname, '..', 'plugins', name);

            fs.readFile(path.join(pluginPath, 'package.json'), (err, data) =>
            {
                // TODO: Pull plugin from NPM instead of just failing.
                if (err) return next(err);

                try
                {
                    return next(null, {
                        name,
                        pkg: JSON.parse(data),
                        path: pluginPath,
                        local: true,
                    });
                }
                catch (e)
                {
                    return next(e);
                }
            });
        }, cb);
    }
}

module.exports = EntryGeneratorWebpackPlugin;
