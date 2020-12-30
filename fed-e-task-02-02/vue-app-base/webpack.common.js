const path = require("path");
var webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const ESLintPlugin = require('eslint-webpack-plugin');
module.exports = {
    // mode: 'development',
    entry: "./src/main.js",
    output: {
        filename: "[name]-[contenthash:8].bundle.js",
        path: path.join(__dirname, "dist"),
        publicPath: "dist/",
    },
    resolve: {
        extensions: [".vue", ".js"],
    },
    optimization: {
        splitChunks: {
            // 提取所有公共模块
            chunks: "all",
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            // ['@babel/preset-env', { modules: 'commonjs' }]
                            ['@babel/preset-env', { modules: 'auto' }]
                          ]
                        // presets: ["@babel/preset-env", { modules: 'auto' }],
                    },
                },
            },
            // 需要执行代码检测的时候添加
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     enforce: 'pre'
            // },
            {
                test: /\.vue?$/,
                exclude: /node_modules/,
                use: ["vue-loader"],
            },
            {
                test: /\.css?$/,
                exclude: [/node_modules/],
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less?$/,
                exclude: [/node_modules/],
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                exclude: [/node_modules/],
                use: {
                    loader: "url-loader", //使用url和limit结合的时候需要也装上file-loader，超过设定大小就不用data url方式了
                    options: {
                        limit: 10240,
                    },
                },
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(), //vue需要用这个插件
        new HtmlWebpackPlugin({
            template: "./public/index.html",

            filename: 'index.html',
            title: "The vue demo",
        }),
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify("https://localhost/dist/"),
        }),
        // new ESLintPlugin()
    ],
};
