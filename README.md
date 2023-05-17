# 新手指南

## 一个包含 prettier，eslint，stylelint，commitlint  的配置文件合集

### 安装ly-lint

```bash
$ npm i ly-lint --save-dev
# or
$ pnpm add ly-lint -D
```


#### in .eslintrc.js

```javascript

const eslint = require('ly-lint/dist/eslint');

module.exports = {
  ...eslint,
  rules: {
    ...eslint.rules,
    // your rules
  },
};
```

#### in .stylelintrc.js

```javascript

const stylelint = require('ly-lint/dist/stylelint');

module.exports = {
  ...stylelint,
  rules: {
    ...stylelint.rules
    // your rules
  },
};
```

#### in .prettierrc.js

```javascript
const prettier = require('ly-lint/dist/prettier');

module.exports = {
  ...prettier,
};
```

#### in .commitlint.js

```javascript
const commitlint = require('ly-lint/dist/commitlint');

module.exports = {
  ...commitlint,
};
```
