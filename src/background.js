'use strict'
import Launcher from '@/main/Launcher'
import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
// import unzip from 'unzip'
const isDevelopment = process.env.NODE_ENV !== 'production'
process.noAsar = true
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
function createWindow () {
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
ipcMain.on('download', (event, fileUrl) => {
  try {
    console.log('download fly')
    const path = require('path')
    win.webContents.session.on('will-download', (e, item) => {
      // 获取文件的总大小
      const totalBytes = item.getTotalBytes()
      let fileBase = 0
      // 设置文件的保存路径，此时默认弹出的 save dialog 将被覆盖
      const filePath = path.join(app.getPath('downloads'), item.getFilename())
      console.log(filePath)
      item.setSavePath(filePath)
      // 监听下载过程，计算并设置进度条进度
      item.on('updated', () => {
        let baifenb = item.getReceivedBytes() / totalBytes
        if (fileBase !== baifenb) {
          fileBase = baifenb
          if (win) win.setProgressBar(baifenb)
          if (win) event.reply('download-reply', baifenb, baifenb)
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
          app.dock.downloadFinished(filePath)
          // shell启动浏览器
          // shell.openExternal('http://www.google.com')
          // ipcRenderer.invoke('app-child', 'name')
          shell.openPath(filePath).then(res => {
            console.log('解压完毕')
            event.reply('download-finish', filePath)
          })
        }
      })
    })

    // const path = require('path')
    // win.webContents.session.on('will-download', (event, item, webContents) => {
    //   const filePath = path.join(app.getPath('downloads'), item.getFilename())
    //   item.setSavePath(filePath)
    // })
    win.webContents.downloadURL(fileUrl)
  } catch (error) {
    console.log(error)
  }
})
const { spawn, exec } = require('child_process')
// 打开应用
ipcMain.on('openApp', (event, appName) => {
  exec(`open -a "${appName}.app"`, (error, stdout, stderr) => {
    console.log(error, stdout, stderr)
  })
})
// 是否安装
ipcMain.on('appIs', (event, appName) => {
  const log = spawn('osascript', ['-e', `id of application \"${appName}\"`])
  // const log = spawn('osascript', ['-e', 'id of application \"应用名字\"'])
  let buffer = ''
  log.stdout.on('data', (data) => {
    buffer += data
  })
  log.stdout.on('end', () => {
    console.log(buffer)
    event.reply('appIs-finish', buffer)
  })
  log.stderr.on('data', (err) => {
    console.log('err', err)
  })
  log.stderr.on('end', () => {
  })
})
ipcMain.on('extractFile', (event, filePath, desPath) => {
  const extract = require('extract-zip')
  // const fs = require('fs')
  try {
    extract(filePath, { dir: path.join(desPath, 'extractFile') }, err => {
      if (err) console.log('extractFile err: ', err)
      // fs.writeFile(path.join(desPath, 'path.txt'), 'Electron.app/Contents/MacOS/Electron', err => {
      //   if (err) console.log('extractFile err: ', err)
      //   console.log('extractFile')
      // })
    })
  } catch (error) {
    console.log('catch : ', error)
  }
})

ipcMain.on('compressing', (event, filePath, desPath) => {
  console.log('compressing')
  const compressing = require('compressing')
  // 解压缩
  compressing.zip.uncompress(filePath, desPath)
    .then(() => {
      console.log('success')
    })
    .catch(err => {
      console.error(err)
    })
})
 
ipcMain.on('DecompressZip', (event, filePath, desPath) => {
  console.log('DecompressZip')
  var DecompressZip = require('decompress-zip')
  var unzipper = new DecompressZip(filePath)
  // Add the error event listener
  unzipper.on('error', function (err) {
    console.log('Caught an error', err)
  })

  // Notify when everything is extracted
  unzipper.on('extract', function (log) {
    console.log('Finished extracting', log)
  })

  // Notify "progress" of the decompressed files
  unzipper.on('progress', function (fileIndex, fileCount) {
    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount)
  })
  unzipper.extract({
    path: desPath,
    // You can filter the files that you want to unpack using the filter option
    filter: function (file) {
        console.log(file)
        return file.type !== 'SymbolicLink'
    }
  })
})

ipcMain.on('unzip', (event, filePath, desPath) => {
  console.log('unzip')
})

ipcMain.on('AdmZip', (event, filePath, desPath) => {
  console.log('AdmZip')
  var AdmZip = require('adm-zip')
  const unzipper = new AdmZip(filePath)
  unzipper.extractAllTo(desPath, true)
  console.log('app.asar.unpacked.zip 解压缩完成')
  console.log('unzipper.Extract({path: route}')
})

ipcMain.on('StreamZip', (event, filePath, desPath) => {
  // invalid or unsupported zip format 不支持的格式
  console.log('StreamZip')
  const StreamZip = require('node-stream-zip')
  const zip = new StreamZip({
    file: filePath
  })
  zip.on('ready', () => {
    console.log('Entries read: ' + zip.entriesCount);
    for (const entry of Object.values(zip.entries())) {
        const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
        console.log(`Entry ${entry.name}: ${desc}`);
    }
    //读取完毕，记得关闭文件
    zip.close()
  });
  // 报错提示
  zip.on('error', err => {
    console.log('unzip err：', err)
  })
})
  // console.log(args, agd)
  // const unzip = require('./unzip')
  // var StreamZip = require('node-stream-zip');
  // exec('ls -a', (error, stdout, stderr) => {
  //   console.log(error, stdout, stderr)
  // })
  // var unzipper = new StreamZip({
  //   file: args
  // , storeEntries: true
  // });
  // console.log(unzipper)
  // // unzipper.on('error', function (err) { console.error('[ERROR]', err); })
  // unzipper.on("error", (err) => {
  //   console.log("Unable to unzip the file " + args, err);
  //   // return reject(err);
  // });
//   

//   
 
// unzipper.list();

// packing a directory
// tar.pack('./my-directory').pipe(fs.createWriteStream('my-tarball.tar'))

// extracting a directory
  
  // fs.createReadStream(args).pipe(unzipper.Parse())
    // .on('entry', function (entry) {
    //   const fileName = entry.path;
    //   const type = entry.type; // 'Directory' or 'File'
    //   const size = entry.vars.uncompressedSize; // There is also compressedSize;
    //   if (fileName === "this IS the file I'm looking for") {
    //     entry.pipe(fs.createWriteStream('output/path'));
    //   } else {
    //     entry.autodrain();
    //   }
    // })
  
    // try {
  //   let extract = unzip.Extract({ path: './' });
  //   console.log(extract)
  // } catch (error) {
  //   console.log(error)
  // }
  
  // 
//   // fs.createReadStream(args).pipe(unzip.Extract({ path: 'output/path' }))
// })

global.launcher = new Launcher()
console.log(global.launcher)
