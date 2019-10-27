const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge.smart(common, {
  mode:      "development",
  devtool:   "eval-source-map",
  devServer: {
    historyApiFallback: true,
    watchOptions:       { aggregateTimeout: 300, poll: 1000 },
    headers:            {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    },
    contentBase: "./dist",
    hot:         true
  }
});
