const fs = require('fs')
const request = require('request')

export default class FileDownloads {
  constructor(argement) {
    const { fileUrl, format = 'hh:mm:ss' } = argement
    // 文件名称
    this.fileName = this.getName(fileUrl)
    this.format = format
    this.targetPath = this.getTargetPath(this.fileName)
    // 剩余时间
    this.timeOut = ''
    // 下载速度
    this.speed = ''
    // 下载大小
    this.receivedBytes = 0
    // 文件大小
    this.totalBytes = 0
    this.init(fileUrl)
  }

  init(fileUrl) {
    const self = this
    const req = request({ method: 'GET', uri: fileUrl })
    const out = fs.createWriteStream(self.targetPath)
    let lastTime = new Date()
    let oldSize = 0
    req.pipe(out)
    req.on('response', function (data) {
      // 初始化总文件大小
      self.totalBytes = parseInt(data.headers['content-length'])
    })
    req.on('data', function (chunk) {
      // 更新下载进度
      const timeOut = new Date()
      if (chunk.length > 0) {
        self.receivedBytes += chunk.length
        if (timeOut - lastTime) self.timeOut = self.setDownloadTime(self.totalBytes - self.receivedBytes, self.getSpeedWith(self.receivedBytes - oldSize, timeOut - lastTime))
        oldSize = self.receivedBytes
        lastTime = timeOut
      }
    })
    req.on('end', function () {
      console.log('File succesfully downloaded')
    })
  }

  getTargetPath(fileName) {
    return '/Users/luuman/Downloads' + '/' + fileName
  }

  getName(fileUrl) {
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1)
  }

  getSpeedWith(fileSize, timeOut) {
    const num = fileSize / 1024 / timeOut * 1000
    if (num === 'Infinity') console.log('fileSize', fileSize)
    this.speed = num
    return num
  }

  setSchedule(receivedBytes, totalBytes) {
    return parseFloat((receivedBytes / totalBytes).toFixed(4))
  }

  setSpeed(num) {
    if (num) return num < 990 ? parseFloat((num).toFixed(0)) + 'KB/S' : parseFloat((num / 1024).toFixed(2)) + 'MB/S'
  }

  setDownloadTime(fileSize, speed) {
    return fileSize / speed / 1000
  }

  setSize(value) {
    if (value === null || value === '') {
      return '0 Bytes'
    }
    var unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var index = 0
    var srcsize = parseFloat(value)
    index = Math.floor(Math.log(srcsize) / Math.log(1024))
    var size = srcsize / Math.pow(1024, index)
    size = size.toFixed(2)
    return size + unitArr[index]
  }

  setDate() {
    const time = this.timeOut
    let format = this.format
    var o = {
      // 月份
      M: Math.floor(time / 3600 / 24 / 30 % 100),
      // 日
      d: Math.floor(time / 3600 / 24 % 30),
      // 小时
      h: Math.floor(time / 3600 % 24),
      // 分
      m: Math.floor(time / 60 % 60),
      // 秒
      s: Math.floor(time % 60),
      // 毫秒
      S: Math.floor(time * 1000 % 1000)
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, ('this.getFullYear()' + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + '+' + ')').test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return format
  }

  get() {
    const { timeOut, speed, receivedBytes, totalBytes } = this
    console.log(this.speed)
    return {
      // fileName: fileName,
      // targetPath: targetPath,
      timeOut: this.setDate(timeOut),
      speed: this.setSpeed(speed),
      schedule: this.setSchedule(receivedBytes, totalBytes),
      receivedBytes: this.setSize(receivedBytes),
      totalBytes: this.setSize(totalBytes)
    }
  }
}
