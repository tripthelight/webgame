import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import sass from 'sass';
import webpack from 'webpack';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __filename = fileURLToPath(import.meta.url);

export default {
  mode: 'production',
  entry: {
    main: './src/client/index.js',
    selectGame: './src/client/js/selectGame/selectGame.js',
  },
  output: {
    // filename: "js/[name].bundle.js",
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // implementation: sass, // Dart Sass 사용
              // SCSS 문법이 올바르게 인식되도록 sassOptions 설정
              sassOptions: {
                outputStyle: 'compressed',
                // Dart Sass 사용 시 syntax 옵션 설정
                syntax: 'scss',
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // filename: "css/common.css",
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      chunks: ['main'],
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/client/views/selectGame.html',
      chunks: ['selectGame'],
      filename: 'views/selectGame.html',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxSize: 50000, // 50KB로 설정하여, 특정 크기(라인 수)에 도달하면 분할
    },
  },
  devServer: {
    static: {
      directory: path.join('dist'), // 정적 파일 제공 디렉터리
    },
    historyApiFallback: {
      rewrites: [{ from: /^\/views\/selectGame$/, to: '/views/selectGame.html' }],
    },
    port: 3000,
    hot: true,
    // server: {
    //   type: "https", // HTTPS 설정
    //   options: {
    //     // 기본 인증서를 사용할 경우 주석 처리된 부분을 삭제하세요.
    //     key: fs.readFileSync("certs/client/cert.key"), // 자체 서명된 인증서 키
    //     cert: fs.readFileSync("certs/client/cert.crt"), // 자체 서명된 인증서
    //   },
    // },
  },
};
