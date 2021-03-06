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
    // "indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }],
    // "no-tabs": 0,
    // "no-console": "off",
    "class-methods-use-this": 0,
    "import/prefer-default-export": 0,
    "camelcase": 0,
    "guard-for-in": 0,
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
    ],
    "no-underscore-dangle": 0,
    "no-restricted-syntax": [
      "error",
      //"ForInStatement",
      //"ForOfStatement",
      "LabeledStatement",
      "WithStatement"
    ],
  },
};
