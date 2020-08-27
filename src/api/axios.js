import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
// import store from '../store'
// import router from '@/router'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API,
  // baseURL: 'http://127.0.0.1:8080',
  // api的base_url
  timeout: 15000
})

const createURL = (url, params) => {
  url += '?'
  for (var item in params) {
    url += `${item}=${params[item]}&`
  }
  url = url.substr(0, url.length - 1)
  return url
}
export const Get = (url, params, showLoading) => service.get(createURL(url, params))
// export const Get = (url, params, showLoading) => service({ url, method: 'get', params })
export const Post = (url, params, showLoading) => service.post(url, params, { showLoading: showLoading, token: true })
