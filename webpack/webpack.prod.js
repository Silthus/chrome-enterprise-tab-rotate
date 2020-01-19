import * as merge from 'webpack-merge';
import * as common from './webpack.common';

module.exports = merge(common, {
    mode: 'production'
});