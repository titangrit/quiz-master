const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/client/index.js",
    mode: "development",
    output: {
        filename: "bundle.js",
        path: path.resolve("public/dist"),
        publicPath: "/",
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