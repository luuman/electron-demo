const path = require('path')
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      chainWebpackMainProcess: config => {
        config.resolve.alias.set('@', path.join(__dirname, 'src'))
      },
      builderOptions: {
        appId: 'com.reworld.app',
        // 项目名，也是生成的安装文件名，即aDemo.exe
        productName: 'Reworld',
        // 版权信息
        copyright: 'Copyright © 2019',
        directories: {
          // 输出文件路径
          // output: './dist'
        },
        icon: './icon/icons/icon.ico',
        files: ['**/*', 'static/*'],
        asar: true,
        mac: {
          icon: './icon/icon.icns',
          target: ['zip', 'dmg']
        },
        // win相关配置
        win: {
          // 图标，当前图标在根目录下，注意这里有两个坑
          icon: './app.ico',
          // 利用nsis制作安装程序
          target: ['zip', 'nsis']
        },
        nsis: {
          // 是否一键安装
          oneClick: false,
          // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowElevation: true,
          // 允许修改安装目录
          allowToChangeInstallationDirectory: true,
          // 安装图标
          installerIcon: './icon/icons/icon.ico',
          // 卸载图标
          uninstallerIcon: './icon/icons/icon.ico',
          // 安装时头部图标
          installerHeaderIcon: './icon/icons/icon.ico',
          // 创建桌面图标
          createDesktopShortcut: true,
          // 创建开始菜单图标
          createStartMenuShortcut: true,
          license: './LICENSE.txt'
        }
      }
    }
  }
}