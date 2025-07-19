// craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, 'src/'), // Set the alias for `~`
    },
  },
  resolve: {
    fallback : {
        "crypto": false 
    }
  }
};
