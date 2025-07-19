const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');  // Add this import
const HTMLPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',  // or './src/index.jsx' if you're not using TypeScript
  output: {
    path: path.resolve(__dirname, 'dist-start'),
    filename: 'main.js',
    publicPath: '/', // This allows webpack-dev-server to serve assets correctly
  },
  devtool: 'inline-source-map', // Enable source maps for easier debugging
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
      chunks: ['main']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NEXT_PUBLIC_KEY_PREFIX': JSON.stringify('valutx-dev')
      }
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve static files from 'public' directory
    },
    historyApiFallback: true, // Allows for client-side routing
    compress: true, // Enable gzip compression
    port: 3003, // Set the port to 3000 or your preferred port
    hot: true, // Enable hot module replacement
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
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: '/'
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}