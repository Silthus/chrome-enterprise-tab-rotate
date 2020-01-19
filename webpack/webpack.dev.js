import merge from 'webpack-merge';
import common from './webpack.common';
import ExtensionReloader from 'webpack-extension-reloader';

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        ...common.plugins,
        new ExtensionReloader()
    ]
});