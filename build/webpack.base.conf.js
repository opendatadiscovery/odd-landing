/* Base config:
  ========================================================================== */

  const path = require('path')
  const fs = require('fs')
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const { VueLoaderPlugin } = require('vue-loader')
  const ImageMinPlugin = require('imagemin-webpack-plugin').default
  const imageminMozjpeg = require('imagemin-mozjpeg')
  const $ = require('jquery')
  const webpack = require('webpack')
  const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  
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
      app: PATHS.src
      // module: `${PATHS.src}/your-module.js`,
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
        {
          // Vue
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loader: {
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        },
        {
          // Fonts
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        },
        {
          test: /\.(gif|png|jpg|jpeg|svg)?$/,
          loader: 'file-loader',
          options: {
            name: 'assets/img/[name].[ext]',
            outputPath: '../../',
          },
          
          /* test: /\.(gif|png|jpe?g|svg)$/i,
          use: */ /* {
          loader: 'file-loader',
          options: {
            name: '[path][name]-[hash].[ext]',
            outputPath: '../',
            publicPath: '/',
          }, */
          /* [
            'file-loader', */
            /* options: {
              name: '[path][name]-[hash].[ext]',
              outputPath: '../',
              publicPath: '/',
            }, */
            /* {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.80],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 65
                }
              }
            },
          ], */
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
            /* {
              loader: 'resolve-url-loader',
              options: {}
            }, */
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
        vue$: 'vue/dist/vue.js',
        images: path.resolve(__dirname, 'src/assets/img/')
      }
    },
    plugins: [
      // Vue loader
      new VueLoaderPlugin(),
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
          // Fonts:
          {
            from: `${PATHS.src}/${PATHS.assets}fonts`,
            to: `${PATHS.assets}fonts`
          },
          // Static (copy to '/'):
          {
            from: `${PATHS.src}/static`,
            to: ''
          }
        ]
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),
      new CleanWebpackPlugin(),
      /* new ImageminPlugin({
        pngquant: {
          quality: '65-90',
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
            quality: 65
          })
        ]
      }), */
  
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
  