'use strict';

const crypto = require('crypto');

module.exports = function buildName(plugins)
{
    if (Array.isArray(plugins))
    {
        plugins = plugins.join(',');
    }

    const hash = crypto.createHash('sha256');

    hash.update(plugins);

    return hash.digest('hex');
};
