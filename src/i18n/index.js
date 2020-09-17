// import Vue from 'vue'
// import i18n from 'i18n'
import VueI18n from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

const messages = {
  zh: { message: zh },
  en: { message: en }
}
const storageLanguage = window.localStorage.getItem('locale_language')
let locale = ''
if (!storageLanguage) {
  window.localStorage.setItem('locale_language', 'zh')
  locale = 'zh'
} else {
  locale = window.localStorage.getItem('locale_language')
}

// const i18ns = new VueI18n({
//   locale, messages
// })
console.log(VueI18n, messages, locale)
// export default i18ns

// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$t = (key) => {
      console.log(key, options, key.split('.').reduce((o, i) => {
        console.log('o', o)
        if (o) return o[i]
      }, VueI18n))
      return key.split('.').reduce((o, i) => { if (o) return o[i] }, VueI18n)
    }
    // app.provide('zh', messages)
    app.provide('$t', options)
    app.directive('my-directive', {
      mounted(el, binding, vnode, oldVnode) {
        // some logic ...
      }
    })
    app.mixin({
      created() {
        // some logic ...
      }
    })
  }
}
