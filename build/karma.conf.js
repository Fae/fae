'use strict';

module.exports = function conf(config)
{
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'sinon-chai'],
        autoWatch: true,
        logLevel: config.LOG_INFO,
        logColors: true,
        reporters: ['mocha'],
        browsers: ['Chrome'],
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 30000,

        sauceLabs: {
            testName: 'Fae',
            startConnect: true,
        },

        browserStack: {
            project: 'Fae',
            name: 'Unit Tests',
            startTunnel: true,
            timeout: 600,
        },

        files: [
            // our code
            'dist/fae.js',

            // fixtures
            {
                pattern: 'test/fixtures/**/*.js',
                included: true,
            },

            // tests
            {
                pattern: `test/unit/**/*.test.js`,
                served: true,
                included: true,
                watched: true,
            },
        ],

        plugins: [
            'karma-mocha',
            'karma-sinon-chai',
            'karma-mocha-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-sauce-launcher',
        ],

        customLaunchers: {
            /* eslint-disable camelcase */
            SL_Chrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
                version: '35',
            },
            SL_Firefox: {
                base: 'SauceLabs',
                browserName: 'firefox',
                version: '30',
            },
            SL_Safari_7: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.9',
                version: '7.1',
            },
            SL_Safari_8: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.10',
                version: '8',
            },
            SL_Safari_9: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.11',
                version: '9',
            },
            SL_IE_11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 10',
                version: '11',
            },
            SL_Edge: {
                base: 'SauceLabs',
                browserName: 'edge',
                platform: 'Windows 10',
                version: '13',
            },
            SL_iOS: {
                base: 'SauceLabs',
                browserName: 'iphone',
                platform: 'OS X 10.10',
                version: '8.1',
            },
            /* eslint-enable camelcase */
        },
    });

    if (process.env.TRAVIS)
    {
        const buildLabel = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;

        config.logLevel = config.LOG_DEBUG;

        config.reporters.push('saucelabs');
        config.browsers = ['SL_Chrome', 'SL_Firefox', 'SL_IE_11', 'SL_Edge'];

        // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
        config.browserNoActivityTimeout = 120000;

        // config.browserStack.build = buildLabel;
        // config.browserStack.startTunnel = false;
        // config.browserStack.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;

        config.sauceLabs.build = buildLabel;
        config.sauceLabs.startConnect = false;
        config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
        config.sauceLabs.recordScreenshots = true;

        // Allocating a browser can take pretty long (eg. if we are out of capacity and need to wait
        // for another build to finish) and so the `captureTimeout` typically kills
        // an in-queue-pending request, which makes no sense.
        config.captureTimeout = 0;
    }
};
