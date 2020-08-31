const path = require('path')
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      chainWebpackMainProcess: config => {
        config.resolve.alias.set('@', path.join(__dirname, 'src'))
      }
    }
  }
}