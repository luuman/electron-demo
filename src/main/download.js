const fs = require('fs')
const request = require('request')

export default class FileDownloads {
  constructor(argement) {
    const { fileUrl } = argement
    // console.log(this)
    // 文件名称
    this.fileName = this.getName(fileUrl)
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
    // this.getSpeedWith()
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
      self.receivedBytes += chunk.length
      self.showProgress(self.receivedBytes, self.totalBytes)
      if (timeOut - lastTime) self.timeOut = self.getDownloadTime(self.totalBytes - self.receivedBytes, self.getSpeedWith(self.receivedBytes - oldSize, timeOut - lastTime))
      oldSize = self.receivedBytes
      lastTime = timeOut
    })
    req.on('end', function () {
      // console.log('File succesfully downloaded')
    })
  }

  getTargetPath(fileName) {
    return '/Users/luuman/Downloads' + '/' + fileName
  }

  getName(fileUrl) {
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1)
  }

  showProgress() { }

  get() {
    const { timeOut, speed, receivedBytes, totalBytes } = this
    console.log(this.speed)
    return {
      // fileName: fileName,
      // targetPath: targetPath,
      timeOut: timeOut,
      speed: this.SpeedFile(speed),
      schedule: this.getSchedule(receivedBytes, totalBytes),
      receivedBytes: this.renderSize(receivedBytes),
      totalBytes: this.renderSize(totalBytes)
    }
  }

  getSpeedWith(fileSize, timeOut) {
    const num = fileSize / 1024 / timeOut * 1000
    if (num === 'Infinity') console.log('fileSize', fileSize)
    this.speed = num
    // console.log(this.speed, fileSize, timeOut)
    return num
  }

  renderSize(value) {
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

  getSchedule(receivedBytes, totalBytes) {
    return parseFloat((receivedBytes / totalBytes).toFixed(4))
  }

  SpeedFile(num) {
    if (num) return num < 990 ? parseFloat((num).toFixed(0)) + 'KB/S' : parseFloat((num / 1024).toFixed(2)) + 'MB/S'
  }

  getDownloadTime(fileSize, speed) {
    let result = fileSize / speed / 1000
    var h = Math.floor(result / 3600 % 24)
    var m = Math.floor(result / 60 % 60)
    if (h < 1) {
      result = m + '分钟'
      return result
    } else {
      result = h + '小时' + m + '分钟'
      return result
    }
  }
}
