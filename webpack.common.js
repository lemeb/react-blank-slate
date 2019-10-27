const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: [
      path.resolve(__dirname, "app/main.js"),
      path.resolve(__dirname, "app/stylesheets/main.scss")
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "./[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "app"),
        loader: "style-loader!css-loader"
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          // Replaces ExtractTextPlugin, which is deprecated
          "style-loader",
          "css-loader",
          { loader: "sass-loader", query: { sourceMap: false } }
        ]
      },
      {
        test: /\.bundle\.js$/,
        use: "bundle-loader"
      },
      {
        test: /\.js[x]?$/,
        include: [path.resolve(__dirname, "app")],
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  optimization: {
    minimize: true, // Replaces uglifyJsPlugin
    splitChunks: {
      cacheGroups: {
        slate: {
          test: /[\\/]node_modules[\\/]slate.*[\\/]/,
          name: "slate",
          chunks: "all"
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all"
        }
      }
    }
  },
  plugins: [
    // new MiniCssExtractPlugin({ filename: "./dist.css" }),
    new CopyWebpackPlugin([{ from: "app/index.html", to: "../index.html" }]),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
};
