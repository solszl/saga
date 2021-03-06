const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const threadLoader = require("thread-loader");
const config = require("./config");
const { resolve, isProd } = require("./tools");
const { ModuleFederationPlugin } = webpack.container;
const pkg = require("../package.json");

threadLoader.warmup(
  {
    workers: 4,
  },
  ["babel-loader", "@babel/preset-env"]
);

const baseConfig = {
  target: "web",
  mode: isProd ? "production" : "development",
  devtool: isProd ? false : "source-map",
  output: {
    filename: "[name].js",
    path: resolve(`dist`),
    library: pkg.name,
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".js", ".json"],

    alias: {
      "@pkg": resolve("packages"),
    },
    fallback: { zlib: false },
  },
  stats: {
    children: true,
    errorDetails: true,
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: "worker-loader",
          options: {
            inline: "fallback",
          },
        },
        include: [resolve("packages")],
      },
      {
        test: /\.js?$/,
        // loader: 'babel-loader',
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 4,
              exclude: /\.worker\.js$/,
            },
          },
          "babel-loader",
        ],
        include: [resolve("packages"), resolve("examples"), resolve("node_modules/wslink")],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        // API_PATH: JSON.stringify(config[process.env.BUILD_ENV].API_PATH),
      },
    }),
    new ModuleFederationPlugin({
      name: "SDK",
      filename: "sdkEntry.js",
      exposes: {
        "./Entry": resolve("packages/entry/src/index.js"),
      },
    }),
  ],
};

module.exports = baseConfig;
