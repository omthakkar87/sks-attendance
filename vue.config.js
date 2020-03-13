module.exports = {
  "lintOnSave": false,

  "transpileDependencies": [
    "vuetify"
  ],

  publicPath: '',
  devServer:{
    host:'0.0.0.0'
  },
  pluginOptions: {
    cordovaPath: 'src-cordova'
  },
  pwa: {
    themeColor: '#00bcd4',
    msTileColor: '#212121',
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png'
    }
  }
}
