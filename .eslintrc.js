module.exports = {
  env: {
    commonjs: true,
    es6: true,
    mocha: true
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-console": "off",
    "no-underscore-dangle":  [
      "error", { 
        "allow": [
          "_end", 
          "_sort",
          "_start",
          "_order",
          "_id"
        ]
      }
    ]
  },
};
