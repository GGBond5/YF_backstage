const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  devServer: {
    port: '8088'
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/adms/'
    : '/',
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('images',resolve('src/assets/images'))
  }
}
