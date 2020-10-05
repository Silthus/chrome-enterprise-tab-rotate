const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtensionReloader = require('webpack-extension-reloader');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        ...common.plugins,
        new ExtensionReloader()
    ]
});