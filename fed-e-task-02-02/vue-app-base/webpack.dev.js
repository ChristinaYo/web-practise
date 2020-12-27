
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool:'cheap-eval-source-map',
    devServer: {
        hot: true, //支持模块热替换
        contentBase: './dist', 
        port: 9000
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin() //这里默认能够模块热替换的是样式文件，js需要单独配置
    ]

})