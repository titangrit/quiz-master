const path = require("path");
const webpack = require("webpack");

const TerserPlugin = require('terser-webpack-plugin');

const PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
    entry: "./src/client/index.js",
    mode: "development",
    output: {
        filename: !!PROD ? 'bundle.min.js' : 'bundle.js',
        path: path.resolve("public/dist"),
        publicPath: "/",
    },
    optimization: {
        minimize: !!PROD,
        minimizer: [
            new TerserPlugin({ parallel: true })
        ]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ]
            },
            {
                test: /\.(css)$/,
                exclude: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
        ],
    },
}