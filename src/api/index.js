// import { Post } from './axios'
import axios from 'axios'

/**
 * @用户信息
 */
// 密码登录
export const LoginPassword = params => axios.post('/user/login', { username: 'admin', password: '123456' }).then(res => res.data)
// export const LoginPassword = (params, showLoading) => Post('/user/login', params, showLoading)
// 短信验证码登录
// export const LoginVerify = (params, showLoading) => Get('/auth/login/verifyCode', params, showLoading)
// 发送登录短信验证码
// export const sendVCode = (params, showLoading) => Post('/auth/send/verifyCode', params, showLoading)
// 获取当前登录用户的个人信息
// export const getInfo = (params, showLoading) => Get('/auth/info', params, showLoading)
// 获取登录用户的菜单、权限信息
// export const getMenu = (params, showLoading) => Get('/auth/menu', params, showLoading)
// 退出
// export const Logout = (params, showLoading) => Get('/auth/logout', params, showLoading)
