//  在common下新建一个test.js文件
//  下面三个模块时为了在windows下一些输出错误信息中文字符会乱码的问题
// var iconv = require('iconv-lite')
// var encoding = 'cp936'
// var binaryEncoding = 'binary'

function restartApp() {
  //  引入spawn函数
  //   const { spawn } = require('child_process')
    const path = require('path')
  console.log(path.join(__dirname, '@/main/cmd'))
//   //  使用cmd命令 `start restartApp`: 执行restartApp.bat
//   const bat = spawn(
//     ['/c', 'start restartApp'],
//     {
//       cwd: path.join(__dirname, '../cmd'),
//       // 运行子进程的目录,此处千万要写对路径,否则会报'xxxx'不是不是内部或外部命令，也不是可运行的程序或批处理文件的提示
//       detached: true,
//       // 让父进程退出后，子进程能独立运行
//       shell: process.platform === 'win32',
//       windowsHide: true
//     }
//   )
//   bat.stdout.on('data', (data) => {
//     //  标准输出
//     console.log(data.toString())
//   })
//   bat.stderr.on('data', (data) => {
//     //  输出错误信息
//     console.log(data)
//     // console.log('stderr: ' + iconv.decode(new Buffer(data, binaryEncoding), encoding), iconv.decode(new Buffer(data, binaryEncoding), encoding))
//   })
//   bat.on('exit', (code) => {
//     console.log(`子进程退出，退出码 ${code}`)
//   })
}
function closeService () {
  const { exec } = require('child_process')
  exec('tasklist | find /i "xxxx.exe" && taskkill /F /im xxxx.exe', (error, stdout, stderr) => {
    if (error !== null) console.info('stderr: ' + error)
    else console.info('成功')
    console.info('stdout: ' + stdout)
    console.info('stderr: ' + stderr)
  })
}
module.exports = {
  restartApp,
  closeService
}
