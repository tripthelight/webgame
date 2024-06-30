import path from "path";
import {fileURLToPath} from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import sass from "sass";
import webpack from "webpack";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __filename = fileURLToPath(import.meta.url);

export default {
  // entry: "./src/js/index.js",
  entry: {
    main: "./src/js/index.js",
    angle: "./src/js/test/angle/angle.js",
  },
  output: {
    // filename: "js/[name].bundle.js",
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // implementation: sass, // Dart Sass 사용
              // SCSS 문법이 올바르게 인식되도록 sassOptions 설정
              sassOptions: {
                outputStyle: "compressed",
                // Dart Sass 사용 시 syntax 옵션 설정
                syntax: "scss",
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // filename: "css/common.css",
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      chunks: ["main"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/test/angle/angle.html",
      chunks: ["angle"],
      filename: "test/angle/angle.html",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      maxSize: 50000, // 50KB로 설정하여, 특정 크기(라인 수)에 도달하면 분할
    },
  },
  mode: "production",
};
