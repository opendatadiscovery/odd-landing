/* Base config:
  ========================================================================== */
  const path = require('path')
  const fs = require('fs')
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const ImageMinPlugin = require('imagemin-webpack-plugin').default
  const imageminMozjpeg = require('imagemin-mozjpeg')
  const webpack = require('webpack')
  const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  require('babel-polyfill');
  
  // Main const
  const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
  }
  
  // Pages const for HtmlWebpackPlugin
  // see more: https://github.com/vedees/webpack-template/blob/master/README.md#html-dir-folder
  const PAGES_DIR = PATHS.src
  const PAGES = fs
    .readdirSync(PAGES_DIR)
    .filter(fileName => fileName.endsWith('.html'))
  
  module.exports = {
    externals: {
      paths: PATHS
    },
    entry: {
      app: ['babel-polyfill', PATHS.src]
    },
    output: {
      filename: `${PATHS.assets}js/[name].[contenthash].js`,
      path: PATHS.dist,
      /*
        publicPath: '/' - relative path for dist folder (js,css etc)
        publicPath: './' (dot before /) - absolute path for dist folder (js,css etc)
      */
      publicPath: ''
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /node_modules/,
            chunks: 'all',
            enforce: true,
          }
        }
      }
    },
    module: {
      rules: [
        {
          // JavaScript
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        },
        // {
        //   // Fonts
        //   test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        //   loader: 'file-loader',
        //   options: {
        //     name: '[name].[ext]'
        //   }
        // },
        {
          test: /\.(gif|png|jpg|jpeg|svg)?$/,
          loader: 'file-loader',
          options: {
            name: 'assets/img/[name].[ext]',
            outputPath: '../../',
          },
          
        },
        {
          // scss
          test: /\.scss$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: { path: `./postcss.config.js` }
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }
          ]
        },
        {
          // css
          test: /\.css$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: { path: `./postcss.config.js` }
              }
            }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        '~': PATHS.src, // Example: import Dog from "~/assets/img/dog.jpg"
        '@': `${PATHS.src}/js`, // Example: import Sort from "@/utils/sort.js"
        images: path.resolve(__dirname, 'src/assets/img/')
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${PATHS.assets}css/[name].[contenthash].css`
      }),
      new CopyWebpackPlugin({
        patterns: [
          // Images:
          {
            from: `${PATHS.src}/${PATHS.assets}img`,
            to: `${PATHS.assets}img`
          },
          // // Fonts:
          // {
          //   from: `${PATHS.src}/${PATHS.assets}fonts`,
          //   to: `${PATHS.assets}fonts`
          // },
          // Static (copy to '/'):
          {
            from: `${PATHS.src}/static`,
            to: ''
          }
        ]
      }),
      new CleanWebpackPlugin(),
      /*
        Automatic creation any html pages (Don't forget to RERUN dev server!)
        See more:
        https://github.com/vedees/webpack-template/blob/master/README.md#create-another-html-files
        Best way to create pages:
        https://github.com/vedees/webpack-template/blob/master/README.md#third-method-best
      */
      ...PAGES.map(
        page =>
          new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page}`
          })
      )
    ],
    optimization: {
      minimizer: [
        new UglifyJSPlugin({ sourceMap: true }),
        new ImageMinPlugin({
          test: /\.(png|jpe?g|gif|svg)$/,
          pngquant: {
            quality: '65-80',
            speed: 4
          },
          gifsicle: {
            optimizationLevel: 7,
            interlaced: false
          },
          optipng: {
            optimizationLevel: 7,
            interlaced: false
          },
          plugins: [
            imageminMozjpeg({
              progressive: true,
              quality: 100
            })
          ],
        }),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: { sourceMap: true },
        }),
      ],
    },
  }
  