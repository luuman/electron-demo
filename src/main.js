import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import isElectron from 'is-electron'
import { ipcRenderer } from 'electron'
// import VueI18Next from '@panter/vue-i18next'
// import i18n from '@/i18n'
import i18nPlugin from '@/i18n'

// 本地假数据
import Mock from './mock/index'
if (process.env.NODE_ENV === 'development') {
	Mock.init()
}
// const i18n = new VueI18Next(localeManager.getI18n())

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

// const i18nStrings = {
// 	greetings: {
// 		hi: 'Hallo!'
// 	}
// }

const app = createApp(App)
app.use(store)
	.use(router)
	.use(i18nPlugin)
	// .use(VueI18n)
	.mount('#app')

// app.config.globalProperties.$t = i18n
// app.provide('$t', app.config.globalProperties.$t)

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
