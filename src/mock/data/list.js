// 引入mock
import Mock from 'mockjs'
const Random = Mock.Random

export const List = () => {
  const List = []
  const count = 300

  for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
      // 随机生成由2-10的整数
      id: Random.integer(2, 10),
      // 名字
      name: Random.cname(),
      // 属性名sex|规则：属性值  从数组里随机选一个
      'sex|1': ['男', '女'],
      // 默认日期为Y-M-D
      date: Random.date(),
      // 随机的两个大写字母构成的字符串
      port: Random.string('upper', 2),
      // 随机的两个小写字母构成的字符串
      bay: Random.string('lower', 2),
      // 三个字构成的一段文语句
      externalState: Random.csentence(3),
      // 随机选择
      'vipGrade|1': ['★', '★★', '★★★']
    }))
  }
  return List
}
