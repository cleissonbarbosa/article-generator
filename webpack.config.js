const defaults = require('@wordpress/scripts/config/webpack.config');
const { getWebpackEntryPoints } = require('@wordpress/scripts/utils/config');
const config = { ...defaults };

// Add server only for development mode and not for production.
if ('production' !== process.env.NODE_ENV) {
    config.devServer = {
        devMiddleware: {
            writeToDisk: true,
        },
        allowedHosts: 'all',
        host: 'localhost',
        port: 8887,
        proxy: {
            '/build': {
                pathRewrite: {
                    '^/build': '',
                },
            },
        },
    };
}

module.exports = {
    ...config,
    entry: {
        ...getWebpackEntryPoints(), // For blocks.

        index: './src/index.tsx', // For admin scripts.
    },
};
