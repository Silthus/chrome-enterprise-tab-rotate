import * as merge from 'webpack-merge';
import * as common from './webpack.common';
import * as ExtensionReloader from 'webpack-extension-reloader';

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        ...common.plugins,
        new ExtensionReloader()
    ]
});