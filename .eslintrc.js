module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential'],
  globals: {
    HeyUI: true,
    Utils: true,
    Manba: true,
    Vue: true,
    R: true,
    G: true,
    log: true,
    Model: true,
    BMap: true
  },
  rules: {
    'space-before-function-paren': 0,
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-irregular-whitespace': 'off',
    semi: ['error', 'always'],
    eqeqeq: 'off',
    'linebreak-style': ['error', 'unix'],
    'no-useless-call': 'off',
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
