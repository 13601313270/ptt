const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
    // https: true,
    // key: fs.readFileSync(path.join(__dirname, "/ssl/ssl.key")),
    // cert: fs.readFileSync(path.join(__dirname, "/ssl/ssl.crt")),
  // },
});
