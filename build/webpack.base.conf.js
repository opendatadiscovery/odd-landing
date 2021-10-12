  const path = require('path')
  const fs = require('fs')
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const ImageMinPlugin = require('imagemin-webpack-plugin').default
  const imageminMozjpeg = require('imagemin-mozjpeg')
  const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  require('babel-polyfill');
  
  // Main const
  const PATHS = {
    src: path.join(__dirname, '../src'),
    docs: path.join(__dirname, '../docs'),
    assets: 'assets/'
  }
  
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
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        },
        {
          test: /\.(gif|png|jpg|jpeg|svg)?$/,
          loader: 'file-loader',
          options: {
            name: 'assets/img/[name].[ext]',
            outputPath: '../../',
          },
          
        },
        {
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
        '~': PATHS.src,
        '@': `${PATHS.src}/js`,
        images: path.resolve(__dirname, 'src/assets/img/')
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${PATHS.assets}css/[name].[contenthash].css`
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${PATHS.src}/${PATHS.assets}img`,
            to: `${PATHS.assets}img`
          },
          {
            from: `${PATHS.src}/static`,
            to: ''
          }
        ]
      }),
      new CleanWebpackPlugin(),
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
  