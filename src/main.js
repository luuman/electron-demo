import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import isElectron from 'is-electron'
import { ipcRenderer } from 'electron'

import Mock from './mock/index'
// console.log(global.launcher)
if (process.env.NODE_ENV === 'development') {
	Mock.init()
}

// 不重定向白名单
const whiteList = ['/login']
let sizeName = ''
router.beforeEach((to, from, next) => {
	// console.log(store.getters.token, to, from, next)
	if (store.getters.token) {
		next()
		// reSetSize()
	} else {
		if (whiteList.indexOf(to.path) !== -1) {
			// reSetSize()
			next()
		} else {
			reSetSize('login')
			next()
			// next('login')
		}
	}
})
router.afterEach((to, from, next) => {
  // NProgress.done() // 结束Progress
})
// 窗口调节
function reSetSize(name = '') {
	console.log('reSetSize', name, sizeName, sizeName !== name)
	if (sizeName !== name) {
		console.log('name')
		sizeName = name
		ipcRenderer.invoke('synchronous-message', name)
		// ipcRenderer.invoke('message', (event, data) => {
		// 	console.log('message', data.msg)
		// })
	}
}

createApp(App).use(store).use(router).mount('#app')

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
