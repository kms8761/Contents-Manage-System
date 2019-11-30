const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
useEslint:false
module.exports = {
  lintOnSave:false,
  'transpileDependencies': [
    'vuetify'
  ],
  devServer: {
    proxy: {
        '/api': {
            target: 'http://localhost:3000/' // 개발서버
        }
    }
  },
  configureWebpack: {
    plugins: [
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'daum-postcode-api',
            entry: 'http://dmaps.daum.net/map_js_init/postcode.v2.js',
            global: 'daum-postcode-api',
          },
        ],
      }),
    ],
  },


}
