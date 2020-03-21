import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import DashboardPlugin from 'webpack-dashboard/plugin';
const path = require('path');
const find = require('find');
const buildConfig = require('./build.config.js');

const { entries } = buildConfig;
const files = find.fileSync('./src/js/');
const entrys = {};
const entrysArr = [];
const confEntry = [];
const isWindows = /^win/.test(process.platform);
const regSlash = isWindows ? '\\\\' : '\/';
const re = new RegExp('[\\w\\W]*src' + regSlash + '([\\w\\W]+)\\.js$');

for (let i = 0; i < files.length; i++) {
  if (/\.entry\.js$/.test(files[i])) {
    const filei = files[i].replace(re, '$1').replace('/js/page/', '');
    entrys[filei] = [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      `${__dirname}/${files[i]}`
    ];
    entrysArr.push(filei);

    const confe = `src/${files[i]}`;
    confEntry.push(path.resolve(__dirname, confe));
  }
}

let filterEntries = {};
if (Array.isArray(entries) && entries.length > 0) {
  for (let e = 0; e < entries.length; e++) {
    const entry = entries[e];
    for (let f in entrys) {
      if (f.indexOf(entry) != -1) {
        filterEntries[f] = entrys[f];
      }
    }
  }
} else {
  filterEntries = entrys;
}

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: filterEntries,
  target: 'web',
  output: {
    path: `${__dirname}/src`,
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('[name].css'),
    new DashboardPlugin()
  ],
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.json', '.less'],
    alias: {
      app: path.resolve(__dirname, 'src/js'),
      style: path.resolve(__dirname, 'src/styles'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ],
      },
      {
        test: /\.(less|css)$/,
        exclude: /\.mod\.(less|css)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer,
                ]
              }
            },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                modifyVars: {
                  "primary-color": "#356AF7",
                }
              }
            },
          ]
        }),
      },
      {
        test: /\.mod\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer,
                ]
              }
            },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                modifyVars: {
                  "primary-color": "#356AF7",
                }
              }
            },
          ]
        }),
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000,
          }
        },
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000,
          }
        },
      },
    ],
  },
};

// 根据入口js文件生成对应的html文件
for (let j = 0; j < entrysArr.length; j++) {
  const pathname = path.basename(entrysArr[j]).split('.')[0];
  const conf = {
    filename: `${pathname}.html`,
    template: './src/template.html',
    inject: 'body',
    title: pathname,
    hash: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
    },
    chunks: [entrysArr[j]],
  };
  config.plugins.push(new HtmlWebpackPlugin(conf));
}

export default config;
