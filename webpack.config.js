/* eslint-disable import/unambiguous */
const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const createRules = require("./build/rules.js");
const { extensions, createAliases } = require("./build/resolve.js");

const NODE_ENV = process.env.NODE_ENV;

const config = {
    entry: {
        index: ["babel-polyfill", "./src/index.js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].js",
    },
    module: {
        rules: createRules(),
    },
    resolve: {
        extensions: extensions,
        alias: createAliases(),
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
        }),
    ],
};

if (NODE_ENV === "development") {
    config.entry.index = []
        .concat(["react-hot-loader/patch", "webpack-dev-server/client?http://localhost:3000"])
        .concat(config.entry.index);

    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );
    config.devServer = {
        proxy: {
            "/api": {
                target: "http://logsearchapi.dev.kontur:30002",
                pathRewrite: { "^/api": "" },
            },
        },
        allowedHosts: ["localhost"],
        port: 3000,
        historyApiFallback: true,
        hot: true,
    };
}

if (NODE_ENV === "production") {
    config.output.filename = "[name].[hash].js";
    config.devtool = "cheap-module-source-map";
    config.plugins.push(
        new MinifyPlugin(true, { test: /\.jsx?$/i }),
        new CopyWebpackPlugin([
            {
                from: "./build/testing.web.config",
                to: "web.config",
            },
        ])
    );
}

module.exports = config;
