module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // 强制使用一致的缩进风格
    'indent': ['off', 2],
    // 不允许不必要的嵌套块
    'no-lone-blocks': 2,
    // 该规则禁止使用空格和tab 混合缩进
    'no-mixed-spaces-and-tabs': 'error',
    // 禁用不必要的转义
    'no-useless-escape': 'off',
    // 禁止出现多个空格
    'no-multi-spaces': 2,
    // 禁止多行字符串
    'no-multi-str': 2,
    // 禁止多个空行
    'no-multiple-empty-lines': [2, {
      'max': 1
    }],
    // 在函数括号之前需要或不允许使用空格
    'space-before-function-paren': 0,
    // 禁用tab
    'no-tabs': 'off',
    // 禁止调用 console 对象的方法
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
