    
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

//生产环境配置
module.exports = merge(common, {
    mode: 'none',
    optimization: {
        usedExports: true,
        minimize: true,
        sideEffects: true,
        minimizer: [
            // new TerserWebpackPlugin(), //js压缩处理,为什么会出错呢
            new OptimizeCssAssetsWebpackPlugin() //样式文件压缩
        ],
        splitChunks: {
            // 提取所有公共模块
            chunks: "all",
        },
    },
    module: {
        //css处理因为通过MiniCssExtractPlugin提取处理，那么原先的style-loader可以替换为MiniCssExtractPlugin.loader
        rules: [

            {
                test: /\.css$/,
                // exclude: [/node_modules/],
                use: [
                    // MiniCssExtractPlugin.loader, //为啥没用呢
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less?$/,
                exclude: [/node_modules/],
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin(['dist']),
        //单独提取css文件,设置contenthash配置持久化缓存处理
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash:8].bundle.css'
        })
    ]
})
