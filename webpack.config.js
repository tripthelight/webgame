import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as sass from 'sass';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpackDevServer from 'webpack-dev-server';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const MODE = process.env.MODE === 'development';

const webpackConfig = {
  mode: process.env.MODE, // development | production
  devtool: MODE ? 'source-map' : false,
  entry: {
    main: './src/client/js/main/main.js',
    selectGame: './src/client/js/selectGame/selectGame.js',
    taptap: './src/client/js/game/taptap/taptap.js',
    indianPocker: './src/client/js/game/indianPocker/indianPocker.js',
    blackAndWhite: './src/client/js/game/blackAndWhite/blackAndWhite.js',
    findTheSamePicture: './src/client/js/game/findTheSamePicture/findTheSamePicture.js',
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
        test: /\.m?js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            // 매우중요*** hash된 이미지 경로와 이미지명을 함께 번들링해줌
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: true,
              esModule: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: 'postcss.config.js', // postcss.config.js 파일을 사용
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src/client/',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        // type: "asset/resource",
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src/client/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CssMinimizerPlugin(),
    new MiniCssExtractPlugin({
      linkType: 'text/css',
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
    new HtmlWebpackPlugin({
      template: './src/client/views/game/taptap.html',
      chunks: ['taptap'],
      filename: 'views/game/taptap.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/client/views/game/indianPocker.html',
      chunks: ['indianPocker'],
      filename: 'views/game/indianPocker.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/client/views/game/blackAndWhite.html',
      chunks: ['blackAndWhite'],
      filename: 'views/game/blackAndWhite.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/client/views/game/findTheSamePicture.html',
      chunks: ['findTheSamePicture'],
      filename: 'views/game/findTheSamePicture.html',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // drop_console: true,
          },
          // JavaScript 파일에서 주석 제거
          extractComments: false,
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxSize: 50000, // 50KB로 설정하여, 특정 크기(라인 수)에 도달하면 분할
    },
  },
};

const compiler = webpack(webpackConfig);
const server = new webpackDevServer(
  {
    static: {
      directory: path.join('dist'), // 정적 파일 제공 디렉터리
    },
    compress: true,
    port: 3000,
    hot: true,
    client: {
      progress: true,
    },
    // server: {
    //   type: "https", // HTTPS 설정
    //   options: {
    //     // 기본 인증서를 사용할 경우 주석 처리된 부분을 삭제하세요.
    //     key: fs.readFileSync("certs/client/cert.key"), // 자체 서명된 인증서 키
    //     cert: fs.readFileSync("certs/client/cert.crt"), // 자체 서명된 인증서
    //   },
    // },
    historyApiFallback: {
      rewrites: [
        { from: /^\/selectGame$/, to: '/views/selectGame.html' },
        { from: /^\/game\/taptap$/, to: '/views/game/taptap.html' },
        { from: /^\/game\/indianPocker$/, to: '/views/game/indianPocker.html' },
        { from: /^\/game\/blackAndWhite$/, to: '/views/game/blackAndWhite.html' },
        { from: /^\/game\/findTheSamePicture$/, to: '/views/game/findTheSamePicture.html' },
      ],
    },
  },
  compiler,
);

(async () => {
  await server.start();
  console.log('dev server is running');
})();

export default webpackConfig;
