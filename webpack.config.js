const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');  // Add this import
const HTMLPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack')

module.exports = {
  mode: 'production',
  cache: false, // Disable caching
  entry: {
    index: './src/index.tsx',
    contentScript: './scripts/content.ts',
    provider: './scripts/injectProvider.ts',
    background: './scripts/background.ts'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript' // TSX support
            ],
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: '/node_modules'
      },

      // Add this rule for SVG files
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "./manifest.json" },
      ],
    }),
    new HTMLPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: true,
      chunks: ['index']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NEXT_PUBLIC_KEY_PREFIX': JSON.stringify('vaultx-prod')
      }
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'), // Source folder
          to: path.resolve(__dirname, 'dist'), // Destination folder
          globOptions: {
            ignore: ['**/*.html'],
          },
        },
      ],
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: (chunk) => chunk.name !== 'background', // Exclude background.js from chunking
    },
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    fallback: {
      "crypto": false,
      "buffer": require.resolve('buffer/'),

    },
    alias: {
      '@': path.resolve(__dirname, 'src/'), // Set the alias for `~`
    },
  },
  output: {
    filename: (pathData) => {
      return pathData.chunk.name == 'index' ? '[name].[contenthash].js' : '[name].js'
    },
    path: getPath(__dirname, '/dist'),
    clean: true,
    publicPath: '/'
  },

};

function getPath(_dir, path) {
  console.log('Hello ' + _dir + path)
  return _dir + path
}