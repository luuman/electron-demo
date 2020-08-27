import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
// 通过axios-mock-adapter生成代理api地址

// import { LoginUsers } from './data/user'
import { users } from './data/user'
import { List } from './data/list'

export default {
  init () {
    console.log('Mock 本地启动')
    const mock = new MockAdapter(axios)
    // mock success request  模拟成功请求
    mock.onGet('/success').reply(200, {
      msg: 'success'
    })
    // mock error request  模拟失败请求
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    })
    // login 模拟登录接口
    mock.onPost('/user/login').reply(config => {
      // 解析axios传过来的数据
      const { username, password } = JSON.parse(config.data)
      return new Promise((resolve, reject) => {
        // 先创建一个用户为空对象
        let data = null
        setTimeout(() => {
          // 判断模拟的假数据中是否有和传过来的数据匹配的
          const hasUser = users.some(person => {
            // 如果存在这样的数据
            if (person.username === username && person.password === password) {
              data = JSON.parse(JSON.stringify(person))
              data.password = undefined
              return true
            } else {
              //  如果没有这个person
              return false
            }
          })
          // 如果有那么一个人
          if (hasUser) {
            resolve([200, { code: 200, msg: '登录成功', data }])
          } else {
          // 如果没有这么一个人
            resolve([200, { code: 500, msg: '账号错误' }])
          }
        }, 500)
      })
    })
    const _planList = List
    // 获取列表（分页） 模拟接收'/flight/getListPage'接口
    mock.onGet('/flight/getListPage').reply(config => {
      const { page, pageSize, id } = config.params
      console.log(page, pageSize, id)
      const mockList = _planList.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1)) // 分页数据显示
      const total = mockList.length // 数据总数
      return new Promise((resolve, reject) => { // 返回响应数据
        setTimeout(() => {
          resolve([200, {
            total: total,
            list: mockList
          }])
        }, 1000)
      })
    })
  //  模拟注册接口
  }
}
