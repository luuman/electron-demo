import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import isElectron from 'is-electron'
import { ipcRenderer } from 'electron'
// import { ipcRenderer, shell } from 'electron'

import Mock from './mock/index'
console.log(process.env)
if (process.env.NODE_ENV === 'development') {
	Mock.init()
}

// 不重定向白名单
const whiteList = ['/login']
let sizeName = ''

router.beforeEach((to, from, next) => {
	// console.log(store.getters.token, to, from, next)
	if (store.getters.token) {
		reSetSize()
		next()
	} else {
		if (whiteList.indexOf(to.path) !== -1) {
			// reSetSize()
			next()
		} else {
			reSetSize('login')
			next('login')
		}
	}
})

router.afterEach((to, from, next) => {
  // NProgress.done() // 结束Progress
})
console.log(isElectron())
function reSetSize(name = '') {
	console.log('reSetSize', name, sizeName, sizeName !== name)
	if (sizeName !== name) {
		console.log('name')
		sizeName = name
		// const ipcRenderer = window.ipcRenderer
		ipcRenderer.invoke('synchronous-message', name)
		// ipcRenderer.invoke('message', (event, data) => {
		// 	console.log('message', data.msg)
		// })
	}
}

// shell启动浏览器
// shell.openExternal('http://www.google.com')

// ipcRenderer.invoke('app-child', 'name')

createApp(App).use(store).use(router).mount('#app')

console.log(ipcRenderer)

// const { exec } = require('child_process')
// const os = require('os')

// export function openTerminal(cmd) {
//   if (os.platform() !== 'darwin') throw new Error('Not supported')

//   const command = [`osascript -e 'tell application "Terminal" to activate'`, `-e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down'`, `-e 'tell application "Terminal" to do script "${cmd}" in selected tab of the front window'`].join(' ')

//   const child = exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(error)
//       alert('Unable to open Terminal window, see dev console for error.')
//     }
//   })

//   child.on('exit', (code) => console.log('Open terminal exit'))
// }
// openTerminal()
const name = ['BaiduNetdisk_mac', 'QQ', '']
console.log(name)

const { spawn, exec } = require('child_process')
const log = spawn('osascript', ['-e', 'id of application \"BaiduNetdisk_mac\"'])
// const log = spawn('osascript', ['-e', 'id of application \"应用名字\"'])
let buffer = ''
log.stdout.on('data', (data) => {
	buffer += data
})
log.stdout.on('end', () => {
	console.log(buffer)
	if (buffer) {
		exec('open -a "BaiduNetdisk_mac.app"', (error, stdout, stderr) => {
			console.log(error, stdout, stderr)
		})
		// spawn('osascript', ['-e', ])
		// open -a 应用.app
	}
})
log.stderr.on('data', (err) => {
	console.log('err', err)
})
log.stderr.on('end', () => {
})
