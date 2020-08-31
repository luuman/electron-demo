'use strict'
import Launcher from '@/main/Launcher'
import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

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
    width: 1050,
    height: 700,
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
    console.log('win', name)
    win.setSize(340, 720)
  } else {
    console.log('win!', name)
    win.setSize(1050, 700)
  }
})
ipcMain.on('download', (event, fileUrl) => {
  const path = require('path')
  win.webContents.session.on('will-download', (e, item) => {
    // 获取文件的总大小
    const totalBytes = item.getTotalBytes()
    let fileBase = 0
    // 设置文件的保存路径，此时默认弹出的 save dialog 将被覆盖
    const filePath = path.join(app.getPath('downloads'), item.getFilename())
    item.setSavePath(filePath)
    // 监听下载过程，计算并设置进度条进度
    item.on('updated', () => {
      let baifenb = item.getReceivedBytes() / totalBytes
      // if (fileBase !== baifenb) {
      //   fileBase = baifenb
      //   win.setProgressBar(baifenb)
      //   event.reply('download-reply', baifenb, baifenb)
      // }
      win.setProgressBar(baifenb)
      event.reply('download-reply', baifenb, baifenb)
    })
    // 监听下载结束事件
    item.on('done', (e, state) => {
      // 如果窗口还在的话，去掉进度条
      if (!win.isDestroyed()) {
        win.setProgressBar(-1)
      }
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
      }
    })
  })

  // const path = require('path')
  // win.webContents.session.on('will-download', (event, item, webContents) => {
  //   const filePath = path.join(app.getPath('downloads'), item.getFilename())
  //   item.setSavePath(filePath)
  // })
  win.webContents.downloadURL(fileUrl)
})

global.launcher = new Launcher()
console.log(global.launcher)
