require("dotenv").config();
const path = require("path");
const webpack = require("webpack");

const TerserPlugin = require("terser-webpack-plugin");

const PROD = JSON.parse(process.env.PROD_ENV || "0");

module.exports = {
  mode: "development",
  devtool: PROD ? false : "inline-source-map",
  // entry: "./src/client/index.js",
  entry: {
    index: {
      import: "./src/client/homePage/HomePage.tsx",
      // dependOn: ['common', 'react'],
    },
    // new_quiz: {
    //     import: './client/newQuiz/renderNewQuiz.js',
    //     // dependOn: ['common', 'react'],
    // },
    // edit_quiz: {
    //   import: "./client/editQuiz/renderEditQuiz.js",
    //   // dependOn: ['common', 'react'],
    // },
    // view_quiz: {
    //   import: "./client/viewQuiz/renderViewQuiz.js",
    //   // dependOn: ['common', 'react'],
    // },
    // play_quiz: {
    //   import: "./client/playQuiz/renderPlayQuiz.js",
    //   // dependOn: ['common', 'react'],
    // },
    // common: './src/client/common',
    // react: 'react',
  },
  output: {
    filename: PROD ? "[name].bundle.min.js" : "[name].bundle.js",
    path: path.resolve("public/dist"),
    publicPath: "/",
  },
  optimization: {
    minimize: PROD ? true : false,
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
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        // loader: "ts-loader",
        use: [
          "ts-loader"
        ]
      },
      {
        test: /\.(css)$/,
        // exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  }
};