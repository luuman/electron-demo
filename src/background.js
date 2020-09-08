'use strict'
import Launcher from '@/main/Launcher'
import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import is from 'electron-is'
import path from 'path'
const extract = require('extract-zip')
const isDevelopment = process.env.NODE_ENV !== 'production'
// process.noAsar = true
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
console.log(process.env.ELECTRON_NODE_INTEGRATION)

const gotSingleLock = app.requestSingleInstanceLock()
if (!gotSingleLock) {
  app.quit()
} else {
}
// app.setAsDefaultProtocolClient('myapp', )
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    // width: 1050,
    // height: 700,
    width: 340,
    height: 720,
    // frame: false,
    resizable: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  // openFile()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.handle('synchronous-message', (event, name) => {
  if (name === 'login') {
    win.setSize(340, 720)
  } else {
    win.setSize(1050, 700)
  }
})
// 启动下载
ipcMain.on('downloads', (event, fileUrl, desPath) => {
  downloadFile(fileUrl, desPath)
})
function getSpeedWith(fileSize, timeOut) {
  console.log('timeOut', timeOut)
  let num = fileSize / 1024 / timeOut * 1000
  return parseFloat((num).toFixed(0))
}
function SpeedFile(num) {
  return num < 990 ? parseFloat((num).toFixed(0)) + 'KB/S' : parseFloat((num / 1024).toFixed(2)) + 'MB/S'
}
function getDownloadTime(fileSize, speed) {
  let result = fileSize / speed / 1000
  var h = Math.floor(result / 3600 % 24)
  var m = Math.floor(result / 60 % 60)
  if (h < 1) {
    return result = m + '分钟'
  } else {
    return result = h + '小时' + m + '分钟'
  }
}
// class toDownload {
//   constructor{}
//   getSpeedWith
// }
ipcMain.on('download', (event, fileUrl, desPath) => {
  try {
    console.log('download fly')
    win.webContents.session.on('will-download', (e, item) => {
      // 获取文件的总大小
      const totalBytes = item.getTotalBytes()
      let fileBase = 0
      // 设置文件的保存路径，此时默认弹出的 save dialog 将被覆盖
      const filePath = path.join(path.join(app.getPath('downloads'), 'downloads'), item.getFilename())
      let openPaths = filePath.split('.')[0] + '/' + 'ReworldLauncher.exe'
      let oldSize = 0
      let lastTime = new Date()
      item.setSavePath(filePath)
      // 监听下载过程，计算并设置进度条进度
      item.on('updated', () => {
        let downSize = item.getReceivedBytes()
        let baifenb = downSize / totalBytes
        let timeOut = new Date()
        let speed = getSpeedWith(downSize - oldSize, timeOut - lastTime)
        let downloadTime = getDownloadTime(totalBytes - downSize, speed)
        oldSize = downSize
        lastTime = timeOut
        if (fileBase !== baifenb) {
          fileBase = baifenb
          if (win) win.setProgressBar(baifenb)
          if (win) event.reply('download-reply', baifenb, SpeedFile(speed), downloadTime)
          console.log(new Date(), baifenb)
        }
      })
      // 监听下载结束事件
      item.on('done', (e, state) => {
        // 如果窗口还在的话，去掉进度条
        if (win && !win.isDestroyed()) win.setProgressBar(-1)
        // 下载被取消或中断了
        if (state === 'interrupted') {
          dialog.showErrorBox(
            '下载失败',
            `文件 ${item.getFilename()} 因为某些原因被中断下载`
          )
        }
        // 下载完成，让 dock 上的下载目录Q弹一下下
        if (state === 'completed') {
          console.log(new Date())
          console.log('filePath', filePath.split('.')[0])
          if (is.macOS()) {
            app.dock.downloadFinished(filePath)
            extract(filePath, { dir: path.join(app.getPath('downloads'), 'downloads') }).then(res => {
              event.reply('download-finish', filePath, res)
            }).catch(err => {
              console.log('extractFile-err: ', err)
            })
          } else if (is.windows()) {
            // let filePath = path.join(app.getPath('downloads'), 'downloads') + '/' + fileUrl
            let openPaths = filePath.split('.')[0] + '/' + '重启世界.exe'
            console.time()
            extract(filePath, {
              dir: path.join(app.getPath('downloads'), 'downloads'),
              onEntry: (item, index) => {
                // item.fileName = item.fileName.replace('╓╪╞⌠╩└╜τ', '重启世界')
                console.log('onEntryitem', iconv.decode(iconv.encode(item.fileName, 'UTF-8'), 'utf-8'))
                item.fileName = iconv.decode(iconv.encode(item.fileName, 'CP437'), 'UTF-8')
              }
            }).then(res => {
              shell.openPath(openPaths)
              console.timeEnd()
            }).catch(err => {
              console.log('extractFile-err: ', err)
            })
          }
        }
      })
    })
    win.webContents.downloadURL(fileUrl)
  } catch (error) {
    console.log(error)
  }
})
var iconv = require('iconv-lite')

ipcMain.on('zip-open', (event, fileUrl, fileName) => {
  if (is.macOS()) {
    let filePath = path.join(app.getPath('downloads'), 'downloads') + fileUrl
    extract(filePath, {
      dir: path.join(app.getPath('downloads'), 'downloads'),
      onEntry: (item, index) => {
        // console.log('onEntryitem', iconv.encode(item.fileName, 'CP437'))
        // console.log('onEntryitem', iconv.decode(iconv.encode(item.fileName, 'CP437'), 'UTF-8'))
        item.fileName = iconv.decode(iconv.encode(item.fileName, 'CP437'), 'UTF-8')
      }
    }).then(res => {
      openMacApp(fileName)
    }).catch(err => {
      console.log('extractFile-err: ', err)
    })
    // console.log(filePath, fileUrl, fileName)
    // fs.createReadStream('filePath')
    // fs.createReadStream('filePath').pipe(unzipper.Extract({ path: path.join(app.getPath('downloads')) }))
  } else if (is.windows()) {
    let filePath = path.join(app.getPath('downloads'), 'downloads') + '/' + fileUrl
    let openPaths = filePath.split('.')[0] + '/' + '重启世界.exe'
    console.log(filePath, fileUrl, fileName)
    console.time()
    extract(filePath, {
      dir: path.join(app.getPath('downloads'), 'downloads'),
      onEntry: (item, index) => {
        // item.fileName = item.fileName.replace('╓╪╞⌠╩└╜τ', '重启世界')
        console.log('onEntryitem', iconv.decode(iconv.encode(item.fileName, 'CP437'), 'CP936'))
        item.fileName = iconv.decode(iconv.encode(item.fileName, 'CP437'), 'UTF-8')
      }
    }).then(res => {
      shell.openPath(openPaths)
      console.timeEnd()
    }).catch(err => {
      console.log('extractFile-err: ', err)
    })
  }
})
const { spawn, exec } = require('child_process')
// 打开应用
ipcMain.on('openApp', (event, appName) => {
  exec(`open -a "${appName}.app"`, (error, stdout, stderr) => {
    console.log(error, stdout, stderr)
  })
})
// console.log('<==========')
// console.log('macOS: ', is.macOS())
// console.log('osx: ', is.osx())
// console.log('windows: ', is.windows())
// console.log('main: ', is.main())
// console.log('==========>')
// 是否安装
ipcMain.on('appIs', (event, appName) => {
  if (is.macOS()) {
    isInstallMac(appName).then(res => {
      console.log('appIs-finish')
      event.reply('appIs-finish', res)
    }).catch(err => console.log(err))
  } else if (is.windows()) {
    // exec(`reg query HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\| find / i "${appName}"`, (error, stdout, stderr) => {
    //   console.log(error, stdout, stderr)
    // })
  }
})
// 解压
ipcMain.on('extractFile', (event, filePath, desPath) => {
  // const fs = require('fs')
})

global.launcher = new Launcher()
console.log(global.launcher)
// win地址打开
// function openWinUrl(filePath) {
//   return shell.openPath(filePath)
// }
// Mac打开未知App
function openMacApp(appName) {
  return new Promise((resolve, reject) => {
    exec(`open -a "${appName}.app"`, (error, stdout, stderr) => {
      if (error !== null) {
        reject()
      } else {
        resolve()
      }
    })
  })
}
// MacApp是否安装
function isInstallMac(appName) {
  return new Promise((resolve, reject) => {
    let buffer = ''
    const appCmd = spawn('osascript', ['-e', `id of application \"${appName}\"`])
    appCmd.stdout.on('data', (data) => {
      buffer += data
    })
    appCmd.stdout.on('end', () => {
      console.log(buffer)
      resolve(buffer)
    })
    appCmd.stderr.on('data', (err) => {
      reject(err)
    })
    appCmd.stderr.on('end', () => {
    })
  })
}
// 文件下载
const fs = require('fs')
const request = require('request')
function downloadFile(file_url, targetPath, fileName) {
  fileName = file_url.substring(file_url.lastIndexOf('/') + 1)
  targetPath = targetPath + '/' + fileName
  console.log(file_url, targetPath)
  // Save variable to know progress
  let received_bytes = 0
  let total_bytes = 0
  let req = request({
    method: 'GET',
    uri: file_url
  })
  let out = fs.createWriteStream(targetPath)
  req.pipe(out)
  req.on('response', function (data) {
    // Change the total bytes value to get progress later.
    total_bytes = parseInt(data.headers['content-length'])
  })
  req.on('data', function (chunk) {
    // Update the received bytes
    received_bytes += chunk.length
    showProgress(received_bytes, total_bytes)
  })
  req.on('end', function () {
    console.log('File succesfully downloaded')
  })
}
function showProgress(received, total) {
  var percentage = (received * 100) / total
  console.log(percentage + '% | ' + received + ' bytes out of ' + total + ' bytes.')
}
const { restartApp } = require('@/main/cmd/start.js')
ipcMain.on('restartApp', (event, appName) => {
  console.log('restartApp')
  restartApp()
})
// function isInstallWin() {
//   return new Promise((resolve, reject) => {
//     reg query HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\| find / i "应用(可能会是一个hash)"

//   })
// }