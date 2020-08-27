import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import isElectron from 'is-electron'
import { ipcRenderer } from 'electron'

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

createApp(App).use(store).use(router).mount('#app')

console.log(ipcRenderer)
